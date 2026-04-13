# 🧠 Brain — Visual Knowledge Graph for Claude Code

Your AI conversations, remembered. Brain extracts entities and facts from Claude, ChatGPT, and Gemini exports and builds a searchable knowledge graph that persists across sessions.

## What it does

- Extracts people, projects, concepts, and facts from your AI chat history
- Builds a visual knowledge graph you can explore in the browser
- Injects relevant context into Claude automatically at session start
- Works with Claude Code, ChatGPT exports, and Gemini exports

## Install

Tell Claude Code:

> "Install Brain from https://github.com/Sumit-Sheokand-ai/Brain"

Claude will handle cloning, npm setup, and wiring into your settings. Restart Claude Code when done, then run `brain status` to verify.

## Commands

| Command | What it does |
|---------|-------------|
| `brain status` | Show stats |
| `brain import <zip>` | Import exported chats |
| `brain recall <query>` | Search your knowledge |
| `brain graph` | Open visual graph in browser |
| `brain dashboard` | Terminal UI |
| `brain update` | Re-extract from current session |
| `brain export` | Export as portable zip |
| `brain reset` | Wipe and start over |

## Supported Sources

- **Claude** — export from claude.ai
- **ChatGPT** — export from chat.openai.com
- **Gemini** — export from Google Takeout

## Requirements

- Node.js 18+
- Claude Code (for skill integration)
- Git

## Data

Brain stores your knowledge graph at `~/.claude/brain/` by default. Override with the `BRAIN_DIR` environment variable.

## License

MIT
