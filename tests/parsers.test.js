import { describe, it, expect } from 'vitest'
import { parseClaudeExport } from '../src/parsers/claude.js'
import { parseChatGPTExport } from '../src/parsers/chatgpt.js'
import { parseGeminiExport } from '../src/parsers/gemini.js'
import { parseGenericExport } from '../src/parsers/generic.js'
import { detectAndParse } from '../src/parsers/index.js'

const claudeRaw = [
  {
    uuid: 'abc',
    created_at: '2026-01-01T00:00:00Z',
    chat_messages: [
      { sender: 'human', text: 'What is Supabase?', created_at: '2026-01-01T00:00:01Z' },
      { sender: 'assistant', text: 'Supabase is an open-source Firebase alternative.', created_at: '2026-01-01T00:00:02Z' }
    ]
  }
]

const chatgptRaw = {
  title: 'Test',
  mapping: {
    node1: { message: { author: { role: 'user' }, content: { parts: ['Hello'] }, create_time: 1700000000 }, children: ['node2'] },
    node2: { message: { author: { role: 'assistant' }, content: { parts: ['Hi there!'] }, create_time: 1700000001 }, children: [] }
  }
}

const geminiRaw = [
  {
    title: 'Test',
    messages: [
      { author: 'user', content: 'What is Gemini?', timestamp: '2026-01-01T00:00:00Z' },
      { author: 'model', content: 'I am Gemini.', timestamp: '2026-01-01T00:00:01Z' }
    ]
  }
]

describe('Claude parser', () => {
  it('normalizes claude export format', () => {
    const result = parseClaudeExport(claudeRaw)
    expect(result.source).toBe('claude')
    expect(result.messages[0]).toEqual({ role: 'user', content: 'What is Supabase?', timestamp: '2026-01-01T00:00:01Z' })
    expect(result.messages[1].role).toBe('assistant')
  })
})

describe('ChatGPT parser', () => {
  it('normalizes chatgpt mapping tree', () => {
    const result = parseChatGPTExport(chatgptRaw)
    expect(result.source).toBe('chatgpt')
    expect(result.messages.length).toBeGreaterThan(0)
    expect(['user', 'assistant']).toContain(result.messages[0].role)
  })
})

describe('Gemini parser', () => {
  it('normalizes gemini export format', () => {
    const result = parseGeminiExport(geminiRaw)
    expect(result.source).toBe('gemini')
    expect(result.messages[0].role).toBe('user')
    expect(result.messages[1].role).toBe('assistant')
  })
})

describe('Generic parser', () => {
  it('passes through normalized role+content arrays', () => {
    const raw = [{ role: 'user', content: 'hello' }, { role: 'assistant', content: 'world' }]
    const result = parseGenericExport(raw)
    expect(result.source).toBe('generic')
    expect(result.messages[0].role).toBe('user')
  })
})

describe('detectAndParse', () => {
  it('detects claude format', () => {
    expect(detectAndParse(claudeRaw).source).toBe('claude')
  })
  it('detects chatgpt format', () => {
    expect(detectAndParse(chatgptRaw).source).toBe('chatgpt')
  })
})
