---
name: brain
description: >
  Visual Brain — JARVIS knowledge system. ALWAYS trigger when user says /brain,
  "brain recall", "brain status", "brain graph", "what do you know about X",
  "show my brain", or "update brain". Also trigger at session start to check if
  brain context header is loaded.
---

# Brain Skill

## Install

When a user asks you to install Brain from a GitHub URL, run these commands:

**macOS/Linux:**
1. `git clone https://github.com/Sumit-Sheokand-ai/Brain ~/.claude/plugins/brain`
2. `cd ~/.claude/plugins/brain && npm install --silent`
3. `node scripts/merge-settings.js ~/.claude/settings.json`

**Windows (PowerShell):**
1. `git clone https://github.com/Sumit-Sheokand-ai/Brain "$env:USERPROFILE\.claude\plugins\brain"`
2. `cd "$env:USERPROFILE\.claude\plugins\brain"; npm install --silent`
3. `node scripts/merge-settings.js "$env:USERPROFILE\.claude\settings.json"`

After install: tell the user to restart Claude Code, then run `brain status` to verify.

## Commands

When the user triggers this skill, run the appropriate `brain` CLI command:

- `/brain status` → run `brain status` and display output
- `/brain recall <query>` → run `brain recall <query>` and inject results into context
- `/brain import <path>` → guide user: run `brain import <path>`, confirm success
- `/brain graph` → run `brain graph` to open visual graph in browser
- `/brain dashboard` → run `brain dashboard` for terminal UI
- `/brain update` → run `brain update`, confirm brain was updated
- `/brain export` → run `brain export`, show output zip path
- `/brain reset` → confirm with user first, then run `brain reset`

## Context Injection

When `brain recall <query>` is run, prepend the output to your next response context so you can answer the user's question using the retrieved facts without them needing to re-explain.

## Session Start

At session start, the SessionStart hook automatically injects `context-header.md` into the system prompt. You can reference facts from the header without the user providing them.
