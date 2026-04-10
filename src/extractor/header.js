const MAX_CHARS = 600

export function buildHeader(entities, facts) {
  const lines = ['<!-- BRAIN CONTEXT -->']

  if (entities.projects?.length)
    lines.push(`Projects: ${entities.projects.map(p => p.name).slice(0, 5).join(', ')}`)

  if (entities.concepts?.length)
    lines.push(`Stack: ${entities.concepts.map(c => c.name).slice(0, 8).join(', ')}`)

  if (facts.preferences?.length)
    lines.push(`Preferences: ${facts.preferences.map(f => f.text).slice(0, 3).join(' | ')}`)

  if (facts.decisions?.length)
    lines.push(`Decisions: ${facts.decisions.map(d => d.text).slice(0, 3).join(' | ')}`)

  lines.push('<!-- END BRAIN CONTEXT -->')

  let header = lines.join('\n')
  if (header.length > MAX_CHARS) header = header.slice(0, MAX_CHARS) + '\n...'
  return header
}
