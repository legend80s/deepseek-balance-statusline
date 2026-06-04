#!/usr/bin/env node

import pkg from "./package.json" with { type: "json" }

import { getBalance, getBalanceCore } from "./utils/balance.ts"
import { renderBalanceOnly } from "./utils/render.ts"

const balanceInfo = await getBalance()
const args = process.argv.slice(2)

// 显示帮助信息
if (args.includes("--help") || args.includes("-h")) {
  showHelp()
  process.exit(0)
}

// 显示版本信息
if (args.includes("--version") || args.includes("-v")) {
  await showVersion()
  process.exit(0)
}

async function main() {
  const json = args.includes("--json")

  if (json) {
    console.log(await getBalanceCore())
  } else {
    console.log(
      renderBalanceOnly({
        currentBalance: balanceInfo.total_balance,
        currency: balanceInfo.currency,
      }),
    )
  }
}
main().catch(console.error)

function showHelp() {
  console.log(`
${"=".repeat(50)}
  🚀 ${pkg.name} - DeepSeek 余额查询工具
${"=".repeat(50)}

📦 用法:
  $ deepseek-balance [选项]

✨ 选项:
  --json           以 JSON 格式输出余额信息
  --help, -h       显示这个帮助信息
  --version, -v    显示版本号

📝 示例:
  $ deepseek-balance
  💰 ¥8.46

  $ deepseek-balance --json
  {"balance": 8.46, "currency": "CNY", "unit": "yuan"}

📚 说明:
  查询 DeepSeek API 账户余额，支持普通文本和 JSON 格式输出。
  默认输出带有货币符号的友好格式。

${"=".repeat(50)}
  `)
}

async function showVersion() {
  console.log(`${pkg.name} v${pkg.version}`)
}
