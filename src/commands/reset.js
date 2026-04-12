import { homedir } from 'os'
import { join } from 'path'
import { rmSync } from 'fs'
import { Store } from '../store.js'

const BRAIN_DIR = process.env.BRAIN_DIR || join(homedir(), '.claude', 'brain')

export function cmdReset() {
  rmSync(BRAIN_DIR, { recursive: true, force: true })
  new Store(BRAIN_DIR).init()
  console.log('✓ Brain wiped and reinitialized.')
}
