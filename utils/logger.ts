import fs from "node:fs/promises"
import os from "node:os"
import { join } from "node:path"

const LOG_FILE = join(os.tmpdir(), "claude-statusline-debug.log")

export function log(message: string): Promise<void> {
  return fs.appendFile(LOG_FILE, `${new Date().toISOString()} - ${message}\n`)
}

if (import.meta.main) {
  console.log(LOG_FILE)
}
