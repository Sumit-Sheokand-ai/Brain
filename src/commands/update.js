import { readFileSync, existsSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'
import { Store } from '../store.js'
import { extractEntities } from '../extractor/entities.js'
import { extractFacts } from '../extractor/facts.js'
import { buildHeader } from '../extractor/header.js'
import { buildGraph, mergeGraph } from '../graph.js'

const BRAIN_DIR = process.env.BRAIN_DIR || join(homedir(), '.claude', 'brain')
const HISTORY_FILE = join(homedir(), '.claude', 'history.jsonl')

export async function cmdUpdate() {
  const store = new Store(BRAIN_DIR)
  store.init()

  if (!existsSync(HISTORY_FILE)) {
    console.log('No session history found at ~/.claude/history.jsonl')
    return
  }

  const lines = readFileSync(HISTORY_FILE, 'utf8').trim().split('\n').filter(Boolean)
  const messages = []

  for (const line of lines.slice(-200)) {
    try {
      const entry = JSON.parse(line)
      if (entry.role && entry.content) {
        messages.push({
          role: entry.role,
          content: typeof entry.content === 'string' ? entry.content : JSON.stringify(entry.content)
        })
      }
    } catch { continue }
  }

  if (messages.length === 0) {
    console.log('No extractable messages in recent history.')
    return
  }

  const entities = extractEntities(messages)
  const facts = extractFacts(messages)

  for (const type of ['projects', 'concepts']) {
    const existing = store.readEntities(type)
    const existingIds = new Set(existing.map(e => e.id))
    const newOnes = entities[type].filter(e => !existingIds.has(e.id))
    if (newOnes.length) store.writeEntities(type, [...existing, ...newOnes])
  }

  if (facts.preferences.length)
    store.appendKnowledge('preferences.md', facts.preferences.map(f => `- ${f.text}`).join('\n'))

  const existingGraph = store.readGraph()
  store.writeGraph(mergeGraph(existingGraph, buildGraph(entities, facts.decisions)))

  const allProjects = store.readEntities('projects')
  const allConcepts = store.readEntities('concepts')
  const prefsText = store.readKnowledge('preferences.md')
  const header = buildHeader(
    { projects: allProjects, concepts: allConcepts },
    { preferences: prefsText.split('\n').filter(Boolean).map(t => ({ text: t.replace(/^- /, '') })), decisions: [] }
  )
  store.writeHeader(header)
  store.writeMeta({ lastUpdated: new Date().toISOString() })
  console.log(`✓ Brain updated from session history (${messages.length} messages processed)`)
}
