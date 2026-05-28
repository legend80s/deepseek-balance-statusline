import { colors } from "./console.ts"

const {
  BASE_URL = "https://api.deepseek.com",
  DEEP_SEEK_API_KEY_FOR_BALANCE: API_KEY,
} = process.env

// console.log("BASE_URL:", BASE_URL)
// console.log("API_KEY:", API_KEY)

export async function getBalance() {
  const balance = await getBalanceCore({ signal: AbortSignal.timeout(3000) })

  // console.log("balance:", balance)

  return balance.balance_infos[0]
}

export function renderBalance({
  total_balance,
  currency,
}: BalanceInfo): string {
  const color = resolveColorByLevel(Number(total_balance))
  const symbol = currency === "CNY" ? "¥" : "$"
  return `DeepSeek${color} 💰 ${symbol}${total_balance} ${colors.reset}`
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

/**
 * https://github.com/esengine/DeepSeek-Reasonix/blob/fdea3bb8/src/client.ts#L48-L58
 * @param opts
 * @returns
 */
async function getBalanceCore(
  opts: { signal?: AbortSignal } = {},
): Promise<UserBalance> {
  try {
    const resp = await fetch(`${BASE_URL}/user/balance`, {
      method: "GET",
      headers: { Authorization: `Bearer ${API_KEY}` },
      signal: opts.signal,
    })
    if (!resp.ok) {
      throw new Error(
        `getBalance failed: HTTP ${resp.status} ${resp.statusText} DEEP_SEEK_API_KEY_FOR_BALANCE (${API_KEY})`,
        { cause: resp },
      )
    }
    const data = (await resp.json()) as UserBalance
    // console.log("data:", data)
    if (!data || !Array.isArray(data.balance_infos)) {
      throw new TypeError("balance_infos no Array")
    }
    return data
  } catch (err) {
    // console.error("err:", err)
    throw err
  }
}

if (import.meta.main) {
  const balance = await getBalanceCore()
  console.log("balance:", balance?.balance_infos[0].total_balance)
}

interface BalanceInfo {
  /** 货币类型（"CNY" 或 "USD"） */
  currency: "CNY" | "USD"
  /** 总余额 */
  total_balance: string
  /** 赠送余额 */
  granted_balance?: string
  /** 充值余额 */
  topped_up_balance?: string
}

interface UserBalance {
  is_available: boolean
  balance_infos: BalanceInfo[]
}
