export function parseGenericExport(raw) {
  const arr = Array.isArray(raw) ? raw : (raw.messages || [])
  const messages = arr
    .filter(m => m.role && m.content)
    .map(m => ({
      role: m.role === 'human' ? 'user' : m.role,
      content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
      timestamp: m.timestamp || m.created_at || new Date().toISOString()
    }))
  return { source: 'generic', messages }
}
