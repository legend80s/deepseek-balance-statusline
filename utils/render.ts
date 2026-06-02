import { colors } from "./console.ts"

export function render({
  model,
  currentBalance,
  currency,
  spent,
  since,
  showModel,
}: {
  model: string
  currentBalance: string
  currency: string
  spent: number
  since: string
  showModel: boolean
}): string {
  const color = resolveColorByLevel(Number(currentBalance))
  const symbol = currency === "CNY" ? "¥" : currency === "USD" ? "$" : ""
  const modelTag = showModel ? ` | 🐳 ${model}` : ""
  return `💰 ${color}${symbol}${currentBalance}${colors.reset} | 💸 ${colors.cyan}${symbol}${spent.toFixed(2)}${colors.reset} (Since ${since})${modelTag}`
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
