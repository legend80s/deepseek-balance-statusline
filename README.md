# deepseek-balance-statusline

A [Claude Code](https://claude.ai) plugin that shows your DeepSeek account balance in the status line when the active model is DeepSeek.

```text
DeepSeek 💰 ¥6.72
```

Only appears when a DeepSeek model is active. Non-DeepSeek models show nothing.

## Install

Inside a Claude Code instance, run the following commands:

**Step 1: Add the marketplace**

```
claude plugin marketplace add legend80s/deepseek-balance-statusline
```

**Step 2: Install the plugin**

```
claude plugin install deepseek-balance-statusline
```

After that, launch `claude`:

```sh
claude
```

**Step 3: Configure the statusline**

```
/deepseek-balance-statusline:setup
```

Done! Restart Claude Code to load the new statusLine config, then the balance will appear when you use a DeepSeek model.

---

## Manual Installation

If you prefer to set up manually (or the plugin install doesn't work for your environment):

**Step 1: Clone the repository**

```sh
git clone https://github.com/legend80s/deepseek-balance-statusline
cd deepseek-balance-statusline
```

**Step 2: Set the API key**

Add the following to your shell config file (`~/.bashrc`, `~/.bash_profile`, or `~/.zshrc`):

```sh
export DEEP_SEEK_API_KEY_FOR_BALANCE="sk-xxx"
```

Replace `sk-xxx` with your DeepSeek API key. Get one at https://platform.deepseek.com/api_keys.

Optionally set a custom API base URL:

```sh
export BASE_URL="https://api.deepseek.com"
```

Then reload your shell config:

```sh
source ~/.bashrc
```

**Step 3: Configure the status line**

Add the `statusLine` field to `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "node \"/path/to/deepseek-balance-statusline/deepseek-balance-statusline.ts\""
  }
}
```

Replace `/path/to/` with the actual path to the cloned repository.

> **Windows + Git Bash users**: Use forward-slash paths, e.g. `/c/Users/yourname/projects/deepseek-balance-statusline/deepseek-balance-statusline.ts`.

**Step 4: Test it**

```sh
echo '{"model":{"display_name":"DeepSeek-V4-Flash"}}' | node deepseek-balance-statusline.ts
```

If the API key is set correctly, you should see the balance output like this:

```
DeepSeek 💰 ¥6.27
```

**Step 5: Restart Claude Code**

Restart Claude Code for the status line to take effect.

---

## What it does

When your active model contains "DeepSeek" in its name, the plugin fetches your account balance from the DeepSeek API and displays it in the status line:

```
DeepSeek 💰 ¥6.72
```

The display updates every ~300ms with the latest balance. If the balance fetch fails (e.g. network error), nothing is shown to avoid clutter.

## How it works

```
Claude Code → stdin JSON → deepseek-balance-statusline → stdout → displayed in terminal
```

1. Claude Code sends a JSON status payload to the plugin via stdin every ~300ms
2. The plugin checks if `model.display_name` contains "deepseek" (case-insensitive)
3. If yes, it calls `GET https://api.deepseek.com/user/balance` with your API key
4. The balance is written to stdout with `\r` (carriage return) to update in-place
5. If the model changes away from DeepSeek, the status line clears

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DEEP_SEEK_API_KEY_FOR_BALANCE` | Yes | — | DeepSeek API key with balance query permission |
| `BASE_URL` | No | `https://api.deepseek.com` | Custom API base URL (e.g. for proxy) |

## Requirements

- Claude Code
- Node.js 18+
- A DeepSeek API key from https://platform.deepseek.com/api_keys

## Debugging

Logs are written to `/tmp/claude-statusline-debug.log`:

```bash
tail -f /tmp/claude-statusline-debug.log
```

## Development

```bash
git clone https://github.com/legend80s/deepseek-balance-statusline
cd deepseek-balance-statusline
pnpm install

# Test with fixtures
cat test/fixtures/test-data-deepseek.json | node deepseek-balance-statusline.ts

# Test with actual balance
DEEP_SEEK_API_KEY_FOR_BALANCE=sk-xxx cat test/fixtures/test-data-deepseek.json | node deepseek-balance-statusline.ts

# Lint & format
pnpm biome check --write .
```

## License

MIT
