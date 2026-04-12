#!/usr/bin/env bash
# install.sh — installs Visual Brain globally
set -euo pipefail

REPO="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$HOME/.claude"
BRAIN_DIR="$CLAUDE_DIR/brain"
SKILLS_DIR="$CLAUDE_DIR/skills/brain"

echo "🧠 Installing Visual Brain..."

# 1. Create brain data directory
mkdir -p "$BRAIN_DIR/entities" "$BRAIN_DIR/knowledge" "$BRAIN_DIR/imports" "$BRAIN_DIR/processed"

# 2. Install npm dependencies
cd "$REPO" && npm install --silent

# 3. Link brain CLI globally
npm link 2>/dev/null || { echo "Note: npm link failed, add $REPO/bin to PATH manually"; }

# 4. Initialize brain store
node "$REPO/bin/brain.js" status > /dev/null 2>&1 || true

# 5. Install skill plugin
mkdir -p "$SKILLS_DIR/.claude-plugin" "$SKILLS_DIR/.claude/skills/brain"
cp "$REPO/src/templates/graph.html" "$BRAIN_DIR/graph.html" 2>/dev/null || true

# 6. Merge hooks + plugin into settings.json
node "$REPO/scripts/merge-settings.js" "$CLAUDE_DIR/settings.json"

echo ""
echo "✓ Visual Brain installed!"
echo "  Data dir: $BRAIN_DIR"
echo "  Run: brain status"
echo "  Import chats: brain import ~/Downloads/claude_export.zip"
