import { describe, it, expect } from 'vitest'
import { buildGraph, mergeGraph } from '../src/graph.js'

const entities = {
  projects: [{ id: 'gateai', name: 'GateAI' }],
  concepts: [{ id: 'supabase', name: 'Supabase' }, { id: 'next-js', name: 'Next.js' }],
  people: []
}

describe('buildGraph', () => {
  it('creates nodes for each entity', () => {
    const graph = buildGraph(entities, [])
    const nodeIds = graph.nodes.map(n => n.id)
    expect(nodeIds).toContain('gateai')
    expect(nodeIds).toContain('supabase')
  })
  it('assigns correct node types', () => {
    const graph = buildGraph(entities, [])
    expect(graph.nodes.find(n => n.id === 'gateai').type).toBe('project')
    expect(graph.nodes.find(n => n.id === 'supabase').type).toBe('concept')
  })
})

describe('mergeGraph', () => {
  it('merges new nodes without duplicates', () => {
    const existing = { nodes: [{ id: 'gateai', name: 'GateAI', type: 'project', facts: [] }], links: [] }
    const incoming = buildGraph(entities, [])
    const merged = mergeGraph(existing, incoming)
    expect(merged.nodes.filter(n => n.id === 'gateai').length).toBe(1)
    expect(merged.nodes.length).toBe(3)
  })
})
