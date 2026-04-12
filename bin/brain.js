#!/usr/bin/env node
import { program } from 'commander'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const pkg = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../package.json'), 'utf8'))

program
  .name('brain')
  .description('Visual Brain — JARVIS knowledge system for Claude Code')
  .version(pkg.version)

program
  .command('import <zipPath>')
  .description('Import exported chat zip')
  .action(async (p) => { const { cmdImport } = await import('../src/commands/import.js'); await cmdImport(p) })

program
  .command('update')
  .description('Update brain from current session history')
  .option('--source <src>', 'Source', 'session')
  .action(async () => { const { cmdUpdate } = await import('../src/commands/update.js'); await cmdUpdate() })

program
  .command('status')
  .description('Show brain stats')
  .action(async () => { const { cmdStatus } = await import('../src/commands/status.js'); cmdStatus() })

program
  .command('recall <query>')
  .description('Search brain for a topic')
  .action(async (q) => { const { cmdRecall } = await import('../src/commands/recall.js'); cmdRecall(q) })

program
  .command('graph')
  .description('Open visual knowledge graph in browser')
  .action(async () => { const { cmdGraph } = await import('../src/commands/open-graph.js'); await cmdGraph() })

program
  .command('dashboard')
  .description('Launch terminal dashboard')
  .action(async () => { const { cmdDashboard } = await import('../src/commands/dashboard.js'); await cmdDashboard() })

program
  .command('reset')
  .description('Wipe and reinitialize brain')
  .action(async () => { const { cmdReset } = await import('../src/commands/reset.js'); cmdReset() })

program
  .command('export')
  .description('Export brain as portable zip')
  .action(async () => { const { cmdExport } = await import('../src/commands/export-brain.js'); cmdExport() })

program
  .command('inject-header')
  .description('Print context header to stdout (used by SessionStart hook)')
  .action(async () => {
    const { Store } = await import('../src/store.js')
    const { join } = await import('path')
    const { homedir } = await import('os')
    const store = new Store(process.env.BRAIN_DIR || join(homedir(), '.claude', 'brain'))
    store.init()
    process.stdout.write(store.readHeader())
  })

program.parse()
