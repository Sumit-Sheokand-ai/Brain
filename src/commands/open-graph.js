import { homedir } from 'os'
import { join, dirname } from 'path'
import { existsSync, copyFileSync } from 'fs'
import { fileURLToPath } from 'url'
import open from 'open'

const BRAIN_DIR = process.env.BRAIN_DIR || join(homedir(), '.claude', 'brain')
const TEMPLATE = join(dirname(fileURLToPath(import.meta.url)), '../templates/graph.html')

export async function cmdGraph() {
  const dest = join(BRAIN_DIR, 'graph.html')
  if (!existsSync(dest) || process.env.BRAIN_FORCE_TEMPLATE) copyFileSync(TEMPLATE, dest)
  console.log(`Opening graph: ${dest}`)
  await open(dest)
}
