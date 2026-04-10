const TYPE_MAP = { projects: 'project', concepts: 'concept', people: 'person', decisions: 'decision' }

export function buildGraph(entities, decisions) {
  const nodes = []
  for (const [key, type] of Object.entries(TYPE_MAP)) {
    for (const entity of (entities[key] || [])) {
      nodes.push({ id: entity.id, name: entity.name, type, facts: [] })
    }
  }
  for (const d of (decisions || [])) {
    nodes.push({
      id: `decision-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: d.text.slice(0, 60),
      type: 'decision',
      facts: []
    })
  }
  return { nodes, links: [] }
}

export function mergeGraph(existing, incoming) {
  const nodeMap = new Map(existing.nodes.map(n => [n.id, n]))
  for (const node of incoming.nodes) {
    if (!nodeMap.has(node.id)) {
      nodeMap.set(node.id, node)
    } else {
      const ex = nodeMap.get(node.id)
      ex.facts = [...new Set([...(ex.facts || []), ...(node.facts || [])])]
    }
  }
  const linkSet = new Set(existing.links.map(l => `${l.source}-${l.target}-${l.label}`))
  const allLinks = [...existing.links]
  for (const link of incoming.links) {
    const key = `${link.source}-${link.target}-${link.label}`
    if (!linkSet.has(key)) { allLinks.push(link); linkSet.add(key) }
  }
  return { nodes: Array.from(nodeMap.values()), links: allLinks }
}
