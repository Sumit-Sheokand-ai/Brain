import React, { useState, useEffect } from 'react'
import { render, Box, Text, useInput, useApp } from 'ink'
import { homedir } from 'os'
import { join } from 'path'
import { Store } from '../store.js'

const BRAIN_DIR = process.env.BRAIN_DIR || join(homedir(), '.claude', 'brain')

function BrainDashboard() {
  const { exit } = useApp()
  const [data, setData] = useState(null)

  const load = () => {
    const store = new Store(BRAIN_DIR)
    store.init()
    const meta = store.readMeta()
    const projects = store.readEntities('projects')
    const concepts = store.readEntities('concepts')
    const people = store.readEntities('people')
    const header = store.readHeader()
    const graph = store.readGraph()
    const prefs = store.readKnowledge('preferences.md').split('\n').filter(Boolean).slice(0, 5)
    const facts = store.readKnowledge('facts.md').split('\n').filter(Boolean).slice(0, 5)
    setData({ meta, projects, concepts, people, header, graph, prefs, facts })
  }

  useEffect(() => { load() }, [])

  useInput((input, key) => {
    if (input === 'q') exit()
    if (input === 'r') load()
  })

  if (!data) return React.createElement(Text, { color: 'cyan' }, 'Loading brain...')

  const tokenEst = Math.round(data.header.length / 4)
  const lastSync = data.meta.lastUpdated
    ? new Date(data.meta.lastUpdated).toLocaleTimeString()
    : 'never'

  return React.createElement(Box, { flexDirection: 'column', padding: 1 },
    React.createElement(Box, { borderStyle: 'round', borderColor: 'cyan', paddingX: 2 },
      React.createElement(Text, { bold: true, color: 'cyan' }, `🧠 BRAIN v${data.meta.version}  `),
      React.createElement(Text, { color: 'gray' }, `last sync: ${lastSync}  `),
      React.createElement(Text, { color: 'green' }, `header: ~${tokenEst} tokens`)
    ),
    React.createElement(Box, { marginTop: 1, flexDirection: 'row', gap: 2 },
      React.createElement(Box, { flexDirection: 'column', borderStyle: 'single', borderColor: 'blue', paddingX: 1, width: 28 },
        React.createElement(Text, { bold: true, color: 'blue' }, 'ENTITIES'),
        React.createElement(Text, { color: 'white' }, `Projects:   ${data.projects.length}`),
        React.createElement(Text, { color: 'white' }, `Concepts:   ${data.concepts.length}`),
        React.createElement(Text, { color: 'white' }, `People:     ${data.people.length}`),
        React.createElement(Text, { color: 'white' }, `Graph nodes: ${data.graph.nodes.length}`),
        React.createElement(Box, { marginTop: 1, flexDirection: 'column' },
          React.createElement(Text, { bold: true, color: 'blue' }, 'TOP PROJECTS'),
          ...data.projects.slice(0, 4).map(p =>
            React.createElement(Text, { key: p.id, color: 'gray' }, `  · ${p.name}`)
          )
        )
      ),
      React.createElement(Box, { flexDirection: 'column', borderStyle: 'single', borderColor: 'magenta', paddingX: 1, flexGrow: 1 },
        React.createElement(Text, { bold: true, color: 'magenta' }, 'RECENT FACTS'),
        ...data.facts.slice(0, 4).map((f, i) =>
          React.createElement(Text, { key: i, color: 'gray' }, `  ${f}`)
        ),
        React.createElement(Box, { marginTop: 1, flexDirection: 'column' },
          React.createElement(Text, { bold: true, color: 'magenta' }, 'PREFERENCES'),
          ...data.prefs.slice(0, 3).map((p, i) =>
            React.createElement(Text, { key: i, color: 'gray' }, `  ${p}`)
          )
        )
      )
    ),
    React.createElement(Box, { marginTop: 1, borderStyle: 'single', borderColor: 'green', paddingX: 1 },
      React.createElement(Box, { flexDirection: 'column' },
        React.createElement(Text, { bold: true, color: 'green' }, `ACTIVE CONTEXT HEADER  (~${tokenEst} tokens)`),
        React.createElement(Text, { color: 'gray' }, data.header.slice(0, 200) + (data.header.length > 200 ? '...' : ''))
      )
    ),
    React.createElement(Box, { marginTop: 1 },
      React.createElement(Text, { color: 'gray' }, '  [r] refresh  [q] quit  [brain recall <query>] search')
    )
  )
}

export async function cmdDashboard() {
  render(React.createElement(BrainDashboard))
}
