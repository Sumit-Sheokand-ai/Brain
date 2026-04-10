export function parseClaudeExport(raw) {
  const conversations = Array.isArray(raw) ? raw : [raw]
  const messages = []
  for (const conv of conversations) {
    for (const msg of (conv.chat_messages || [])) {
      if (!msg.text) continue
      messages.push({
        role: msg.sender === 'human' ? 'user' : 'assistant',
        content: msg.text,
        timestamp: msg.created_at || conv.created_at || new Date().toISOString()
      })
    }
  }
  return { source: 'claude', messages }
}
