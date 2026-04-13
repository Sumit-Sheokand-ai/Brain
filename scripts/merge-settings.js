import { readFileSync, writeFileSync, existsSync } from 'fs'
import { homedir } from 'os'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const settingsPath = process.argv[2] || join(homedir(), '.claude', 'settings.json')

const existing = existsSync(settingsPath)
  ? JSON.parse(readFileSync(settingsPath, 'utf8'))
  : {}

// Merge hooks
if (!existing.hooks) existing.hooks = {}
if (!existing.hooks.SessionStart) existing.hooks.SessionStart = []
if (!existing.hooks.Stop) existing.hooks.Stop = []

const sessionStartHook = { type: 'command', command: 'brain inject-header 2>/dev/null || true', statusMessage: 'Loading brain context...' }
const stopHook = { type: 'command', command: 'brain update --source session 2>/dev/null || true', async: true, statusMessage: 'Updating brain...' }

const hasSessionStart = existing.hooks.SessionStart.some(g => (g.hooks || []).some(h => h.command?.includes('inject-header')))
const hasStop = existing.hooks.Stop.some(g => (g.hooks || []).some(h => h.command?.includes('brain update')))

if (!hasSessionStart) existing.hooks.SessionStart.push({ hooks: [sessionStartHook] })
if (!hasStop) existing.hooks.Stop.push({ hooks: [stopHook] })

// Merge extraKnownMarketplaces
if (!existing.extraKnownMarketplaces) existing.extraKnownMarketplaces = {}
existing.extraKnownMarketplaces['brain-skill'] = {
  source: { source: 'directory', path: join(homedir(), '.claude', 'plugins', 'brain').replace(/\//g, '\\') }
}

// Merge enabledPlugins
if (!existing.enabledPlugins) existing.enabledPlugins = {}
existing.enabledPlugins['brain@brain-skill'] = true

writeFileSync(settingsPath, JSON.stringify(existing, null, 2))
console.log('✓ settings.json updated')
