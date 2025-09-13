// @ts-check

/*
Produces production builds and stitches together d.ts files.

To specify the package to build, simply pass its name and the desired build
formats to output (defaults to `buildOptions.formats` specified in that package,
or "esm,cjs"):

```
# name supports fuzzy match. will build all packages with name containing "dom":
nr build dom

# specify the format to output
nr build core --formats cjs
```
*/

import fs from 'node:fs'
import { parseArgs } from 'node:util'
import path from 'node:path'
import { brotliCompressSync, gzipSync } from 'node:zlib'
import pico from 'picocolors'
import { cpus } from 'node:os'
import { targets as allTargets, exec, fuzzyMatchTarget } from './utils.js'
import { scanEnums } from './inline-enums.js'
import prettyBytes from 'pretty-bytes'
import { spawnSync } from 'node:child_process'

const commit = spawnSync('git', ['rev-parse', '--short=7', 'HEAD'])
  .stdout.toString()
  .trim()

const { values, positionals: targets } = parseArgs({
  allowPositionals: true,
  options: {
    formats: {
      type: 'string',
      short: 'f',
    },
    devOnly: {
      type: 'boolean',
      short: 'd',
    },
    prodOnly: {
      type: 'boolean',
      short: 'p',
    },
    withTypes: {
      type: 'boolean',
      short: 't',
    },
    sourceMap: {
      type: 'boolean',
      short: 's',
    },
    release: {
      type: 'boolean',
    },
    all: {
      type: 'boolean',
      short: 'a',
    },
    size: {
      type: 'boolean',
    },
  },
})

const {
  formats,
  all: buildAllMatching,
  devOnly,
  prodOnly,
  withTypes: buildTypes,
  sourceMap,
  release: isRelease,
  size: writeSize,
} = values
console.log('🚀 ~ buildAllMatching:', buildAllMatching)

const sizeDir = path.resolve('temp/size')

run()

async function run() {
  // recursive参数表示会递归创建
  if (writeSize) fs.mkdirSync(sizeDir, { recursive: true })
  /*
    https://soonwang.me/blog/ts-const-enum
    inline-enums.js 是一个枚举内联优化工具，用于在构建时将 TypeScript 枚举转换为更高效的形式。
    主要功能
    扫描枚举声明 (scanEnums)：

    使用 git grep 查找所有包含 export enum 的文件
    解析 AST 提取枚举信息（名称、值、位置）
    生成全局替换映射表并缓存到 temp/enum.json
    内联枚举 (inlineEnums)：

    返回 Rollup 插件，在构建时进行代码转换
    将枚举声明重写为对象字面量
    提供 defines 映射用于全局替换
    解决的问题
    Vue 3 之前使用 const enum，但遇到了问题（#1228），改用普通枚举后又担心包体积增大。这个工具通过预处理实现了：

    零成本抽象：枚举使用时被直接替换为字面量值
    保持兼容性：支持枚举的反向映射等 TypeScript 特性
    减少包体积：避免运行时枚举对象的开销
    // 原始代码
    export enum ErrorCodes {
      SETUP_FUNCTION = 0,
      RENDER_FUNCTION = 1
    }

    // 转换后
    export const ErrorCodes = {
      "SETUP_FUNCTION": 0,
      "0": "SETUP_FUNCTION", 
      "RENDER_FUNCTION": 1,
      "1": "RENDER_FUNCTION"
    }
  */
  const removeCache = scanEnums()
  try {
    const resolvedTargets = targets.length
      ? // 指定了构建的包，使用这个将命令行输入的“模糊包名”，解析成实际要构建的目标包列表
        fuzzyMatchTarget(targets, buildAllMatching)
      : allTargets
    await buildAll(resolvedTargets)
    await checkAllSizes(resolvedTargets)
    // 构建ts声明文件
    if (buildTypes) {
      await exec(
        'pnpm',
        [
          'run',
          'build-dts',
          ...(targets.length
            ? ['--environment', `TARGETS:${resolvedTargets.join(',')}`]
            : []),
        ],
        {
          stdio: 'inherit',
        },
      )
    }
  } finally {
    // 移除生成的enum处理的缓存文件
    removeCache()
  }
}

/**
 * Builds all the targets in parallel.
 * @param {Array<string>} targets - An array of targets to build.
 * @returns {Promise<void>} - A promise representing the build process.
 */
async function buildAll(targets) {
  await runParallel(cpus().length, targets, build)
}

/**
 * Runs iterator function in parallel.
 * @template T - The type of items in the data source
 * @param {number} maxConcurrency - The maximum concurrency.
 * @param {Array<T>} source - The data source
 * @param {(item: T) => Promise<void>} iteratorFn - The iteratorFn
 * @returns {Promise<void[]>} - A Promise array containing all iteration results.
 */
async function runParallel(maxConcurrency, source, iteratorFn) {
  /**@type {Promise<void>[]} */
  const ret = []
  /**@type {Promise<void>[]} */
  const executing = []
  for (const item of source) {
    const p = Promise.resolve().then(() => iteratorFn(item))
    ret.push(p)

    if (maxConcurrency <= source.length) {
      const e = p.then(() => {
        // 移除已完成的任务
        executing.splice(executing.indexOf(e), 1)
      })
      executing.push(e)
      if (executing.length >= maxConcurrency) {
        // 达到上限时等待任务执行，执行完再放下一个
        await Promise.race(executing)
      }
    }
  }
  return Promise.all(ret)
}

const privatePackages = fs.readdirSync('packages-private')

/**
 * Builds the target.
 * @param {string} target - The target to build.
 * @returns {Promise<void>} - A promise representing the build process.
 */
async function build(target) {
  const pkgBase = privatePackages.includes(target)
    ? `packages-private`
    : `packages`
  const pkgDir = path.resolve(`${pkgBase}/${target}`)
  const pkg = JSON.parse(fs.readFileSync(`${pkgDir}/package.json`, 'utf-8'))

  // if this is a full build (no specific targets), ignore private packages
  if ((isRelease || !targets.length) && pkg.private) {
    return
  }

  // if building a specific format, do not remove dist.
  if (!formats && fs.existsSync(`${pkgDir}/dist`)) {
    fs.rmSync(`${pkgDir}/dist`, { recursive: true })
  }

  const env =
    (pkg.buildOptions && pkg.buildOptions.env) ||
    (devOnly ? 'development' : 'production')

  await exec(
    'rollup',
    [
      '-c',
      '--environment',
      [
        `COMMIT:${commit}`,
        `NODE_ENV:${env}`,
        `TARGET:${target}`,
        formats ? `FORMATS:${formats}` : ``,
        prodOnly ? `PROD_ONLY:true` : ``,
        sourceMap ? `SOURCE_MAP:true` : ``,
      ]
        .filter(Boolean)
        .join(','),
    ],
    { stdio: 'inherit' },
  )
}

/**
 * Checks the sizes of all targets.
 * @param {string[]} targets - The targets to check sizes for.
 * @returns {Promise<void>}
 */
async function checkAllSizes(targets) {
  if (devOnly || (formats && !formats.includes('global'))) {
    return
  }
  console.log()
  for (const target of targets) {
    await checkSize(target)
  }
  console.log()
}

/**
 * Checks the size of a target.
 * @param {string} target - The target to check the size for.
 * @returns {Promise<void>}
 */
async function checkSize(target) {
  const pkgDir = path.resolve(`packages/${target}`)
  await checkFileSize(`${pkgDir}/dist/${target}.global.prod.js`)
  if (!formats || formats.includes('global-runtime')) {
    await checkFileSize(`${pkgDir}/dist/${target}.runtime.global.prod.js`)
  }
}

/**
 * Checks the file size.
 * @param {string} filePath - The path of the file to check the size for.
 * @returns {Promise<void>}
 */
async function checkFileSize(filePath) {
  if (!fs.existsSync(filePath)) {
    return
  }
  const file = fs.readFileSync(filePath)
  const fileName = path.basename(filePath)

  const gzipped = gzipSync(file)
  // 用于计算产物的压缩体积
  const brotli = brotliCompressSync(file)
  /*
    在 scripts/build.js 的 checkFileSize 中，它用于计算产物的 Brotli 压缩体积：

    file 是原始构建产物的 Buffer
    brotliCompressSync(file) 生成 .br 压缩后的内容
    随后用 brotli.length 展示/记录“Brotli 大小”（同时也计算 gzipSync 的 gzip 大小）
    目的：对比 min/gzip/brotli 三种体积，便于评估发布资源大小
    补充：

    Brotli 一般比 gzip 体积更小，但压缩更慢；常见于 Web 服务器预压缩静态资源（.br）
    Node 18+ 完全支持；本项目引擎要求满足
  */
  console.log(
    `${pico.gray(pico.bold(fileName))} min:${prettyBytes(
      file.length,
    )} / gzip:${prettyBytes(gzipped.length)} / brotli:${prettyBytes(
      brotli.length,
    )}`,
  )

  if (writeSize)
    fs.writeFileSync(
      path.resolve(sizeDir, `${fileName}.json`),
      JSON.stringify({
        file: fileName,
        size: file.length,
        gzip: gzipped.length,
        brotli: brotli.length,
      }),
      'utf-8',
    )
}
