#!/usr/bin/env node
import { program } from 'commander'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const pkg = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../package.json'), 'utf8'))

program
  .name('brain')
  .description('Visual Brain — JARVIS knowledge system for Claude Code')
  .version(pkg.version)

// Commands registered in Task 5
program.parse()
