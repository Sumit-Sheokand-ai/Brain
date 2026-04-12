import { homedir } from 'os'
import { join } from 'path'
import { Store } from '../store.js'

const BRAIN_DIR = process.env.BRAIN_DIR || join(homedir(), '.claude', 'brain')

export function cmdRecall(query) {
  const store = new Store(BRAIN_DIR)
  const q = query.toLowerCase()
  const results = []

  for (const type of ['projects', 'concepts', 'people', 'decisions']) {
    try {
      const entities = store.readEntities(type)
      const matches = entities.filter(e =>
        e.name.toLowerCase().includes(q) ||
        (e.facts || []).some(f => f.toLowerCase().includes(q))
      )
      results.push(...matches.map(e => ({ type, ...e })))
    } catch {}
  }

  for (const file of ['facts.md', 'preferences.md', 'patterns.md']) {
    try {
      const lines = store.readKnowledge(file).split('\n').filter(l => l.toLowerCase().includes(q))
      results.push(...lines.map(l => ({ type: 'knowledge', text: l.trim() })))
    } catch {}
  }

  if (results.length === 0) {
    console.log(`No brain entries found for: "${query}"`)
    return
  }

  console.log(`\n🧠 BRAIN RECALL: "${query}"\n`)
  for (const r of results.slice(0, 20)) {
    console.log(`  [${r.type}] ${r.text || r.name}`)
  }
  console.log()
}
