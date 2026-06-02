import { colors } from "./console.ts"

export function render({
  model,
  currentBalance,
  currency,
  spent,
  since,
}: {
  model: string
  currentBalance: string
  currency: string
  spent: number
  since: string
}): string {
  const color = resolveColorByLevel(Number(currentBalance))
  const symbol = currency === "CNY" ? "¥" : currency === "USD" ? "$" : ""
  // 💰 ¥6.72 | 💸 ¥1.00 (Since 2026-05-31) | 🐳 DeepSeek-V4-Pro[1m]
  return `💰 ${color}${symbol}${currentBalance}${colors.reset} | 💸 ${colors.cyan}${symbol}${spent.toFixed(2)}${colors.reset} (Since ${since}) | 🐳 ${model}`
}

function resolveColorByLevel(total_balance: number): string {
  switch (true) {
    case total_balance < 1: {
      return colors.red
    }
    case total_balance < 6: {
      return colors.yellow
    }
    default: {
      return colors.green
    }
  }
}
