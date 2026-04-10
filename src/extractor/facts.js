const PREFERENCE_PATTERNS = [
  /I prefer ([^.!?\n]{5,80})/gi,
  /prefer ([^.!?\n]{5,60}) over/gi,
  /I like ([^.!?\n]{5,60})/gi,
  /I use ([^.!?\n]{5,60}) for/gi,
  /always use ([^.!?\n]{5,60})/gi,
]

const DECISION_PATTERNS = [
  /(?:I |we )?decided to ([^.!?\n]{5,80})/gi,
  /going with ([^.!?\n]{5,60})/gi,
  /will use ([^.!?\n]{5,60})/gi,
  /chose ([^.!?\n]{5,60})/gi,
]

export function extractFacts(messages) {
  const userText = messages.filter(m => m.role === 'user').map(m => m.content).join('\n')
  const preferences = []
  const decisions = []
  const seen = new Set()

  for (const pattern of PREFERENCE_PATTERNS) {
    let match
    while ((match = pattern.exec(userText)) !== null) {
      const text = (match[1] || match[2] || '').trim()
      if (text && !seen.has(text) && text.length > 4) {
        preferences.push({ text, extractedAt: new Date().toISOString() })
        seen.add(text)
      }
    }
  }

  for (const pattern of DECISION_PATTERNS) {
    let match
    while ((match = pattern.exec(userText)) !== null) {
      const text = (match[1] || '').trim()
      if (text && !seen.has(text) && text.length > 4) {
        decisions.push({ text, extractedAt: new Date().toISOString() })
        seen.add(text)
      }
    }
  }

  return { preferences, decisions }
}
