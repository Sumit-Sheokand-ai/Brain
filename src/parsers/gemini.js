export function parseGeminiExport(raw) {
  const conversations = Array.isArray(raw) ? raw : [raw]
  const messages = []
  for (const conv of conversations) {
    for (const msg of (conv.messages || [])) {
      const role = (msg.author === 'model' || msg.role === 'model') ? 'assistant' : 'user'
      const content = msg.content || msg.text || ''
      if (!content) continue
      messages.push({ role, content, timestamp: msg.timestamp || new Date().toISOString() })
    }
  }
  return { source: 'gemini', messages }
}
