const KNOWN_CONCEPTS = [
  'Next.js','React','Vue','Angular','Svelte','Nuxt',
  'Supabase','Firebase','MongoDB','PostgreSQL','MySQL','SQLite','Redis',
  'Prisma','Drizzle','TypeORM',
  'Node.js','Deno','Bun','Express','Fastify','Hono',
  'TypeScript','JavaScript','Python','Go','Rust',
  'Tailwind','CSS','SCSS','shadcn',
  'Vercel','Netlify','Railway','Cloudflare','AWS','GCP','Azure',
  'Docker','Kubernetes','GitHub','GitLab',
  'OpenAI','Anthropic','Claude','GPT','Gemini','LangChain',
  'Stripe','Resend','Twilio','SendGrid'
]

export function extractEntities(messages) {
  const text = messages.map(m => m.content).join('\n')
  const projects = []
  const concepts = []
  const seen = new Set()

  const projectPattern = /(?:project|app|building|built|working on|called)\s+([A-Z][a-zA-Z0-9-]+)/g
  let match
  while ((match = projectPattern.exec(text)) !== null) {
    const name = match[1]
    if (!seen.has(name) && name.length > 2) {
      projects.push({ id: name.toLowerCase(), name })
      seen.add(name)
    }
  }

  for (const concept of KNOWN_CONCEPTS) {
    if (text.includes(concept) && !seen.has(concept)) {
      concepts.push({ id: concept.toLowerCase().replace(/[^a-z0-9]/g, '-'), name: concept })
      seen.add(concept)
    }
  }

  return { projects, concepts, people: [] }
}
