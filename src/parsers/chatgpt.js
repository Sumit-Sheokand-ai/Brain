export function parseChatGPTExport(raw) {
  const conversations = Array.isArray(raw) ? raw : [raw]
  const messages = []
  for (const conv of conversations) {
    if (!conv.mapping) continue
    const nodes = Object.values(conv.mapping).filter(n => n.message?.content?.parts?.length)
    nodes.sort((a, b) => (a.message.create_time || 0) - (b.message.create_time || 0))
    for (const node of nodes) {
      const role = node.message.author.role
      if (!['user', 'assistant'].includes(role)) continue
      const content = node.message.content.parts.join('').trim()
      if (!content) continue
      messages.push({
        role,
        content,
        timestamp: node.message.create_time
          ? new Date(node.message.create_time * 1000).toISOString()
          : new Date().toISOString()
      })
    }
  }
  return { source: 'chatgpt', messages }
}
