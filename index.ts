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
      log(`DeepSeek 💰 ¥ LOADING`)
      const { getBalance, renderBalance } = await import("./utils/balance.ts")
      const { readState, writeState } = await import("./utils/state.ts")

      const balanceInfo = await getBalance()
      const currentBalance = Number(balanceInfo.total_balance)

      let spent: number
      let since: string

      const state = readState()
      if (!state) {
        since = new Date().toISOString().slice(0, 10)
        writeState({
          cumulativeSpent: 0,
          lastBalance: currentBalance,
          _lastBalance: currentBalance,
          since,
        })
        spent = 0
      } else {
        // console.log("state.lastBalance:", {
        //   lastBalance: state.lastBalance,
        //   currentBalance,
        // })
        const consumption = Math.max(0, state.lastBalance - currentBalance)
        state.cumulativeSpent += consumption
        state._lastBalance = state.lastBalance
        state.lastBalance = currentBalance
        writeState(state)
        spent = state.cumulativeSpent
        since = state.since
      }

      process.stdout.write(
        renderBalance({
          currentBalance: balanceInfo.total_balance,
          currency: balanceInfo.currency,
          spent,
          since,
        }),
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

  log("END\n")
})
