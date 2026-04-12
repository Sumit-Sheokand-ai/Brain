import AdmZip from 'adm-zip'
import { extname, basename } from 'path'
import { Store } from '../store.js'
import { detectAndParse } from '../parsers/index.js'
import { extractEntities } from '../extractor/entities.js'
import { extractFacts } from '../extractor/facts.js'
import { buildHeader } from '../extractor/header.js'
import { buildGraph, mergeGraph } from '../graph.js'
import { homedir } from 'os'
import { join } from 'path'

const BRAIN_DIR = process.env.BRAIN_DIR || join(homedir(), '.claude', 'brain')

export async function cmdImport(zipPath) {
  const store = new Store(BRAIN_DIR)
  store.init()

  const zip = new AdmZip(zipPath)
  const entries = zip.getEntries().filter(e => extname(e.name) === '.json')

  if (entries.length === 0) {
    console.error('No JSON files found in zip.')
    process.exit(1)
  }

  let totalMessages = 0
  let skipped = 0

  for (const entry of entries) {
    const raw = entry.getData().toString('utf8')
    const fingerprint = store.fingerprint(raw)

    if (store.isProcessed(fingerprint)) { skipped++; continue }

    let parsed
    try {
      parsed = detectAndParse(JSON.parse(raw))
    } catch {
      console.warn(`Skipping ${entry.name} — parse error`)
      continue
    }

    const entities = extractEntities(parsed.messages)
    const facts = extractFacts(parsed.messages)

    for (const type of ['projects', 'concepts', 'people']) {
      const existing = store.readEntities(type)
      const existingIds = new Set(existing.map(e => e.id))
      const newOnes = entities[type].filter(e => !existingIds.has(e.id))
      if (newOnes.length) store.writeEntities(type, [...existing, ...newOnes])
    }

    if (facts.preferences.length)
      store.appendKnowledge('preferences.md', facts.preferences.map(f => `- ${f.text}`).join('\n'))
    if (facts.decisions.length)
      store.appendKnowledge('facts.md', facts.decisions.map(d => `- decided: ${d.text}`).join('\n'))

    const existingGraph = store.readGraph()
    const newGraph = buildGraph(entities, facts.decisions)
    store.writeGraph(mergeGraph(existingGraph, newGraph))

    const allProjects = store.readEntities('projects')
    const allConcepts = store.readEntities('concepts')
    const prefsText = store.readKnowledge('preferences.md')
    const header = buildHeader(
      { projects: allProjects, concepts: allConcepts },
      { preferences: prefsText.split('\n').filter(Boolean).map(t => ({ text: t.replace(/^- /, '') })), decisions: [] }
    )
    store.writeHeader(header)
    store.markProcessed(fingerprint, `${parsed.source}-${basename(zipPath)}`)
    totalMessages += parsed.messages.length
  }

  store.writeMeta({ lastUpdated: new Date().toISOString() })
  console.log(`✓ Imported ${totalMessages} messages from ${entries.length - skipped} files (${skipped} skipped as duplicates)`)
  console.log(`✓ Context header updated (${store.readHeader().length} chars)`)
}
