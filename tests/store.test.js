import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync, existsSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { Store } from '../src/store.js'

let tmpDir, store

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), 'brain-test-'))
  store = new Store(tmpDir)
})

afterEach(() => rmSync(tmpDir, { recursive: true }))

describe('Store', () => {
  it('initializes brain directory structure', () => {
    store.init()
    expect(existsSync(join(tmpDir, 'entities'))).toBe(true)
    expect(existsSync(join(tmpDir, 'knowledge'))).toBe(true)
    expect(existsSync(join(tmpDir, 'context-header.md'))).toBe(true)
    expect(existsSync(join(tmpDir, 'meta.json'))).toBe(true)
  })

  it('reads and writes graph.json', () => {
    store.init()
    store.writeGraph({ nodes: [], links: [] })
    expect(store.readGraph()).toEqual({ nodes: [], links: [] })
  })

  it('reads and writes entities', () => {
    store.init()
    store.writeEntities('projects', [{ id: 'p1', name: 'GateAI' }])
    expect(store.readEntities('projects')).toEqual([{ id: 'p1', name: 'GateAI' }])
  })

  it('tracks processed fingerprints to prevent duplicate imports', () => {
    store.init()
    expect(store.isProcessed('abc123')).toBe(false)
    store.markProcessed('abc123', 'claude-2026-01')
    expect(store.isProcessed('abc123')).toBe(true)
  })
})
