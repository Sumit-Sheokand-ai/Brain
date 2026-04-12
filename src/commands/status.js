import { homedir } from 'os'
import { join } from 'path'
import { Store } from '../store.js'

const BRAIN_DIR = process.env.BRAIN_DIR || join(homedir(), '.claude', 'brain')

export function cmdStatus() {
  const store = new Store(BRAIN_DIR)
  store.init()

  const meta = store.readMeta()
  const projects = store.readEntities('projects')
  const concepts = store.readEntities('concepts')
  const people = store.readEntities('people')
  const header = store.readHeader()
  const graph = store.readGraph()
  const tokenEstimate = Math.round(header.length / 4)

  console.log('\n🧠 BRAIN STATUS')
  console.log('─'.repeat(40))
  console.log(`Version:      ${meta.version}`)
  console.log(`Last updated: ${meta.lastUpdated ? new Date(meta.lastUpdated).toLocaleString() : 'never'}`)
  console.log(`\nEntities:`)
  console.log(`  Projects:    ${projects.length}`)
  console.log(`  Concepts:    ${concepts.length}`)
  console.log(`  People:      ${people.length}`)
  console.log(`  Graph nodes: ${graph.nodes.length} | links: ${graph.links.length}`)
  console.log(`\nContext header: ~${tokenEstimate} tokens`)
  console.log('─'.repeat(40))
}
