import fs from "node:fs/promises"
import os from "node:os"
import { join } from "node:path"

const LOG_FILE = join(os.tmpdir(), "claude-statusline-debug.log")

let isFirstCall = true

export function log(...messages: (string | number)[]): Promise<void> {
  const msg = messages.join(" ")
  const line = `${new Date().toISOString()} - ${msg}\n`
  if (isFirstCall) {
    isFirstCall = false
    return fs.writeFile(LOG_FILE, line)
  }
  return fs.appendFile(LOG_FILE, line)
}

if (import.meta.main) {
  console.log(LOG_FILE)
}
