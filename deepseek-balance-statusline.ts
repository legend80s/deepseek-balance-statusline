#!/usr/bin/env node

import { colors } from "./utils/console.ts"
import { log } from "./utils/logger.ts"

log(`start`)

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
      const { getBalance } = await import("./balance.ts")

      // log(`getBalance is: ${typeof getBalance}|${getBalance.toString()}`)

      const rmb = await getBalance()
      log(`getBalance rmb: ${rmb}|${typeof rmb}`)

      process.stdout.write(
        `\rDeepSeek${colors.green} 💰 ¥${rmb}${colors.reset}`,
      )
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

  // console.log("done")
})
