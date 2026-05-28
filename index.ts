#!/usr/bin/env node

import plugin from "./.claude-plugin/plugin.json" with { type: "json" }
import { colors } from "./utils/console.ts"
import { log } from "./utils/logger.ts"

log(`BEGIN`)
log(`${plugin.name}@${plugin.version}`)

let input = ""

process.stdin.on("data", (chunk) => {
  input += chunk
})

process.stdin.on("end", async () => {
  try {
    const data = JSON.parse(input)
    const model: string = data.model?.display_name
    log(`model: ${model}`)

    if (model.toLowerCase().includes("deepseek")) {
      // process.stdout.write(
      //   `${colors.yellow}DeepSeek 💰 ¥ LOADING${colors.reset}`,
      // )
      log(`DeepSeek 💰 ¥ LOADING`)
      const { getBalance, renderBalance } = await import("./utils/balance.ts")

      // log(`getBalance is: ${typeof getBalance}|${getBalance.toString()}`)

      const { total_balance, currency } = await getBalance()
      log(`getBalance: ${total_balance}|${typeof total_balance}`)

      process.stdout.write(renderBalance({ total_balance, currency }))
    } else {
      // console.log("no DeepSeek")
    }
  } catch (err) {
    // console.log(err)
    // @ts-expect-error
    const msg = `deepseek-statusLine ${err.name} ${err.message}`
    console.log(`\n${colors.red}${msg}${colors.reset}`)
    // @ts-expect-error
    log(`${msg}→stack:${err.stack}`)
  }

  log("END\n")
})
