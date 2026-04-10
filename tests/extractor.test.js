import { describe, it, expect } from 'vitest'
import { extractEntities } from '../src/extractor/entities.js'
import { extractFacts } from '../src/extractor/facts.js'
import { buildHeader } from '../src/extractor/header.js'

const sampleMessages = [
  { role: 'user', content: 'I am building GateAI using Next.js and Supabase for auth.' },
  { role: 'assistant', content: 'Great, I see you are using Prisma as your ORM.' },
  { role: 'user', content: 'Yes, I decided to use Prisma. I prefer short responses.' },
  { role: 'user', content: 'I also have a project called Syntellia using React.' }
]

describe('extractEntities', () => {
  it('finds project names', () => {
    const result = extractEntities(sampleMessages)
    const projectNames = result.projects.map(p => p.name)
    expect(projectNames).toContain('GateAI')
    expect(projectNames).toContain('Syntellia')
  })
  it('finds tool/framework concepts', () => {
    const result = extractEntities(sampleMessages)
    const conceptNames = result.concepts.map(c => c.name)
    expect(conceptNames).toContain('Next.js')
    expect(conceptNames).toContain('Supabase')
  })
})

describe('extractFacts', () => {
  it('extracts preferences', () => {
    const result = extractFacts(sampleMessages)
    const factTexts = result.preferences.map(f => f.text)
    expect(factTexts.some(t => t.includes('short responses'))).toBe(true)
  })
  it('extracts decisions', () => {
    const result = extractFacts(sampleMessages)
    const decisionTexts = result.decisions.map(d => d.text)
    expect(decisionTexts.some(t => t.includes('Prisma'))).toBe(true)
  })
})

describe('buildHeader', () => {
  it('builds a header under 150 tokens (rough: chars/4)', () => {
    const entities = extractEntities(sampleMessages)
    const facts = extractFacts(sampleMessages)
    const header = buildHeader(entities, facts)
    expect(header.length / 4).toBeLessThan(150)
    expect(header).toContain('GateAI')
  })
})
