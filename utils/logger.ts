import fs from "node:fs"

const LOG_FILE = "/tmp/claude-statusline-debug.log"

export function log(message: string): void {
  fs.appendFileSync(LOG_FILE, `${new Date().toISOString()} - ${message}\n`)
}
