# Vue 3 Package.json 脚本命令说明

## 构建相关命令

### `build`
- **作用**: 构建所有包的生产版本
- **命令**: `node scripts/build.js`
- **说明**: 执行完整的构建流程，生成所有包的分发版本

### `build-dts`
- **作用**: 构建 TypeScript 声明文件
- **命令**: `tsc -p tsconfig.build.json --declaration --emitDeclarationOnly`
- **说明**: 生成 .d.ts 类型声明文件，用于 TypeScript 支持

### `build-sfc-playground`
- **作用**: 构建 SFC（单文件组件）演示场
- **命令**: `run-s build-compiler-cjs build-runtime-esm build-ssr-esm && node scripts/build-sfc-playground.js`
- **说明**: 构建在线 SFC 编译器演示工具

## 开发相关命令

### `dev`
- **作用**: 开发模式构建
- **命令**: `node scripts/dev.js`
- **说明**: 启动开发环境，支持热重载和调试

### `dev-esm`
- **作用**: ESM 格式开发构建
- **命令**: `node scripts/dev.js -if esm-bundler-runtime`
- **说明**: 以 ESM 模块格式进行开发构建

### `dev-compiler`
- **作用**: 编译器开发模式
- **命令**: `run-p "dev template-explorer" "dev compiler-core -- --sourcemap"`
- **说明**: 同时启动模板浏览器和编译器核心的开发模式

## 测试相关命令

### `test`
- **作用**: 运行所有测试
- **命令**: `node scripts/test.js`
- **说明**: 执行完整的测试套件

### `test-unit`
- **作用**: 运行单元测试
- **命令**: `vitest`
- **说明**: 使用 Vitest 运行单元测试

### `test-dts`
- **作用**: 测试 TypeScript 类型定义
- **命令**: `run-s build-dts test-dts-only`
- **说明**: 构建并测试 TypeScript 声明文件

### `test-coverage`
- **作用**: 生成测试覆盖率报告
- **命令**: `vitest --coverage`
- **说明**: 运行测试并生成代码覆盖率报告

## 代码质量相关命令

### `lint`
- **作用**: 代码风格检查
- **命令**: `eslint --cache --ext .ts packages/*/src/**.ts`
- **说明**: 使用 ESLint 检查 TypeScript 代码风格

### `lint-fix`
- **作用**: 自动修复代码风格问题
- **命令**: `eslint --cache --ext .ts packages/*/src/**.ts --fix`
- **说明**: 自动修复可修复的代码风格问题

### `format`
- **作用**: 格式化代码
- **命令**: `prettier --write --cache .`
- **说明**: 使用 Prettier 格式化所有代码文件

### `format-check`
- **作用**: 检查代码格式
- **命令**: `prettier --check --cache .`
- **说明**: 检查代码是否符合格式规范，不进行修改

## 发布相关命令

### `release`
- **作用**: 发布新版本
- **命令**: `node scripts/release.js`
- **说明**: 执行版本发布流程，包括构建、测试、打标签等

### `changelog`
- **作用**: 生成更新日志
- **命令**: `conventional-changelog -p angular -i CHANGELOG.md -s`
- **说明**: 基于 Git 提交记录生成标准格式的更新日志

## 性能测试命令

### `bench`
- **作用**: 运行性能基准测试
- **命令**: `vitest bench`
- **说明**: 执行性能基准测试套件

## 特定包构建命令

### `build-compiler-cjs`
- **作用**: 构建编译器 CommonJS 版本
- **命令**: `node scripts/build.js compiler-sfc compiler-dom -f cjs`

### `build-compiler-esm`
- **作用**: 构建编译器 ESM 版本
- **命令**: `node scripts/build.js compiler-sfc compiler-dom -f esm-browser`

### `build-runtime-esm`
- **作用**: 构建运行时 ESM 版本
- **命令**: `node scripts/build.js runtime-dom runtime-core reactivity shared -f esm-bundler && node scripts/build.js vue -f esm-bundler-runtime && node scripts/build.js vue -f esm-browser-runtime`

### `build-ssr-esm`
- **作用**: 构建服务端渲染 ESM 版本
- **命令**: `node scripts/build.js compiler-sfc compiler-dom -f esm-bundler && node scripts/build.js server-renderer -f esm-bundler`

## 工具命令

### `preinstall`
- **作用**: 安装前检查
- **命令**: `node ./scripts/checkYarn.js`
- **说明**: 确保使用 Yarn 包管理器进行安装

### `postinstall`
- **作用**: 安装后处理
- **命令**: `simple-git-hooks`
- **说明**: 设置 Git 钩子

## 使用说明

1. **开发时**: 使用 `npm run dev` 启动开发环境
2. **测试时**: 使用 `npm run test` 运行测试
3. **构建时**: 使用 `npm run build` 构建生产版本
4. **发布时**: 使用 `npm run release` 发布新版本
5. **代码检查**: 使用 `npm run lint` 检查代码风格

### `clean`
- **作用**: 清理构建产物
- **命令**: `rimraf --glob packages/*/dist temp .eslintcache`
- **说明**: 删除所有包的 dist 目录、临时文件和 ESLint 缓存

### `size`
- **作用**: 分析包大小
- **命令**: `run-s "size-*" && node scripts/usage-size.js`
- **说明**: 运行所有大小分析命令并生成使用大小报告

### `check`
- **作用**: TypeScript 类型检查
- **命令**: `tsc --incremental --noEmit`
- **说明**: 执行 TypeScript 类型检查，不生成文件

### `test-e2e`
- **作用**: 端到端测试
- **命令**: `node scripts/build.js vue -f global -d && vitest --project e2e`
- **说明**: 构建全局版本并运行端到端测试

### `dev-sfc`
- **作用**: SFC 开发环境
- **命令**: `run-s dev-sfc-prepare dev-sfc-run`
- **说明**: 启动单文件组件开发环境

### `serve`
- **作用**: 启动静态服务器
- **命令**: `serve`
- **说明**: 启动本地静态文件服务器

### `open`
- **作用**: 打开模板浏览器
- **命令**: `open http://localhost:3000/packages-private/template-explorer/local.html`
- **说明**: 在浏览器中打开模板浏览器工具

## Git 钩子配置

### `pre-commit`
- **作用**: 提交前检查
- **命令**: `pnpm lint-staged && pnpm check`
- **说明**: 在 Git 提交前运行代码检查和类型检查

### `commit-msg`
- **作用**: 提交信息验证
- **命令**: `node scripts/verify-commit.js`
- **说明**: 验证 Git 提交信息格式

## 注意事项

- 本项目使用 **pnpm** 作为包管理器（版本 10.15.0）
- 构建脚本支持多种模块格式（CJS、ESM、Global）
- 测试使用 Vitest 框架
- 代码风格使用 ESLint + Prettier
- 需要 Node.js 版本 >= 18.12.0
- 项目类型为 ESM 模块