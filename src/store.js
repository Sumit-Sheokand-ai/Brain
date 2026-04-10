import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { createHash } from 'crypto'

export class Store {
  constructor(brainDir) {
    this.dir = brainDir
  }

  init() {
    const dirs = ['entities', 'knowledge', 'imports', 'processed']
    for (const d of dirs) mkdirSync(join(this.dir, d), { recursive: true })

    if (!existsSync(join(this.dir, 'context-header.md')))
      writeFileSync(join(this.dir, 'context-header.md'), '<!-- Brain context header — regenerated automatically -->\n')

    if (!existsSync(join(this.dir, 'meta.json')))
      writeFileSync(join(this.dir, 'meta.json'), JSON.stringify({ version: '1.0.0', lastUpdated: null, importCount: 0 }, null, 2))

    if (!existsSync(join(this.dir, 'graph.json')))
      writeFileSync(join(this.dir, 'graph.json'), JSON.stringify({ nodes: [], links: [] }, null, 2))

    for (const type of ['people', 'projects', 'concepts', 'decisions'])
      if (!existsSync(join(this.dir, 'entities', `${type}.json`)))
        writeFileSync(join(this.dir, 'entities', `${type}.json`), '[]')

    for (const f of ['facts.md', 'preferences.md', 'patterns.md', 'timeline.md'])
      if (!existsSync(join(this.dir, 'knowledge', f)))
        writeFileSync(join(this.dir, 'knowledge', f), '')

    if (!existsSync(join(this.dir, 'processed', 'index.json')))
      writeFileSync(join(this.dir, 'processed', 'index.json'), '{}')
  }

  readGraph() {
    return JSON.parse(readFileSync(join(this.dir, 'graph.json'), 'utf8'))
  }

  writeGraph(graph) {
    writeFileSync(join(this.dir, 'graph.json'), JSON.stringify(graph, null, 2))
  }

  readEntities(type) {
    return JSON.parse(readFileSync(join(this.dir, 'entities', `${type}.json`), 'utf8'))
  }

  writeEntities(type, data) {
    writeFileSync(join(this.dir, 'entities', `${type}.json`), JSON.stringify(data, null, 2))
  }

  readKnowledge(file) {
    return readFileSync(join(this.dir, 'knowledge', file), 'utf8')
  }

  appendKnowledge(file, content) {
    const path = join(this.dir, 'knowledge', file)
    const existing = existsSync(path) ? readFileSync(path, 'utf8') : ''
    writeFileSync(path, existing + '\n' + content)
  }

  readHeader() {
    return readFileSync(join(this.dir, 'context-header.md'), 'utf8')
  }

  writeHeader(content) {
    writeFileSync(join(this.dir, 'context-header.md'), content)
  }

  readMeta() {
    return JSON.parse(readFileSync(join(this.dir, 'meta.json'), 'utf8'))
  }

  writeMeta(data) {
    writeFileSync(join(this.dir, 'meta.json'), JSON.stringify({ ...this.readMeta(), ...data }, null, 2))
  }

  isProcessed(fingerprint) {
    const idx = JSON.parse(readFileSync(join(this.dir, 'processed', 'index.json'), 'utf8'))
    return !!idx[fingerprint]
  }

  markProcessed(fingerprint, label) {
    const idx = JSON.parse(readFileSync(join(this.dir, 'processed', 'index.json'), 'utf8'))
    idx[fingerprint] = { label, processedAt: new Date().toISOString() }
    writeFileSync(join(this.dir, 'processed', 'index.json'), JSON.stringify(idx, null, 2))
  }

  fingerprint(content) {
    return createHash('md5').update(content).digest('hex').slice(0, 16)
  }
}
