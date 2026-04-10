import { parseClaudeExport } from './claude.js'
import { parseChatGPTExport } from './chatgpt.js'
import { parseGeminiExport } from './gemini.js'
import { parseGenericExport } from './generic.js'

export function detectAndParse(raw) {
  if (Array.isArray(raw) && raw[0]?.chat_messages) return parseClaudeExport(raw)
  const first = Array.isArray(raw) ? raw[0] : raw
  if (first?.mapping) return parseChatGPTExport(Array.isArray(raw) ? raw[0] : raw)
  if (Array.isArray(raw) && raw[0]?.messages?.[0]?.author) return parseGeminiExport(raw)
  return parseGenericExport(raw)
}

export { parseClaudeExport, parseChatGPTExport, parseGeminiExport, parseGenericExport }
