import { parseArgs } from 'node:util'

/*
node .\00_my_idea\01_parseArgs.js --format=aaa bbb

🚀 ~ args: {"values":{"format":"aaa","prod":false,"inline":false},"positionals":["bbb"]}
*/

const args = parseArgs({
  allowPositionals: true,
  options: {
    format: {
      type: 'string',
      // 简写
      short: 'f',
      default: 'global',
    },
    prod: {
      type: 'boolean',
      short: 'p',
      default: false,
    },
    inline: {
      type: 'boolean',
      short: 'i',
      default: false,
    },
  },
})

console.warn('🚀 ~ args:', JSON.stringify(args))
