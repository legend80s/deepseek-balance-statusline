const {
  BASE_URL = "https://api.deepseek.com",
  DEEPSEEK_API_KEY_FOR_BALANCE: API_KEY,
} = process.env

// console.log("BASE_URL:", BASE_URL)
// console.log("API_KEY:", API_KEY)

export async function getBalance() {
  const balance = await getBalanceCore({ signal: AbortSignal.timeout(3000) })

  // console.log("balance:", balance)

  return balance?.balance_infos[0].total_balance
}

/**
 * https://github.com/esengine/DeepSeek-Reasonix/blob/fdea3bb8/src/client.ts#L48-L58
 * @param opts
 * @returns
 */
async function getBalanceCore(
  opts: { signal?: AbortSignal } = {},
): Promise<UserBalance | null> {
  try {
    const resp = await fetch(`${BASE_URL}/user/balance`, {
      method: "GET",
      headers: { Authorization: `Bearer ${API_KEY}` },
      signal: opts.signal,
    })
    if (!resp.ok) {
      throw new Error(
        `getBalance failed: HTTP ${resp.status} ${resp.statusText}`,
        { cause: resp },
      )
    }
    const data = (await resp.json()) as UserBalance
    // console.log("data:", data)
    if (!data || !Array.isArray(data.balance_infos)) return null
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
  currency: string
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
