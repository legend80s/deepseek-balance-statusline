const { BASE_URL, API_KEY } = process.env

console.log("BASE_URL:", BASE_URL)
console.log("API_KEY:", API_KEY)

async function getBalance(
  opts: { signal?: AbortSignal } = {},
): Promise<UserBalance | null> {
  try {
    const resp = await fetch(`${BASE_URL}/user/balance`, {
      method: "GET",
      headers: { Authorization: `Bearer ${API_KEY}` },
      signal: opts.signal,
    })
    if (!resp.ok) return null
    const data = (await resp.json()) as UserBalance
    if (!data || !Array.isArray(data.balance_infos)) return null
    return data
  } catch {
    return null
  }
}

interface BalanceInfo {
  currency: string
  total_balance: string
  granted_balance?: string
  topped_up_balance?: string
}

interface UserBalance {
  is_available: boolean
  balance_infos: BalanceInfo[]
}
