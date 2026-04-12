# install.ps1 — installs Visual Brain on Windows
$ErrorActionPreference = "Stop"

$Repo = Split-Path -Parent $MyInvocation.MyCommand.Path
$ClaudeDir = "$env:USERPROFILE\.claude"
$BrainDir = "$ClaudeDir\brain"

Write-Host "🧠 Installing Visual Brain..."

# Create brain data dirs
New-Item -ItemType Directory -Force -Path "$BrainDir\entities","$BrainDir\knowledge","$BrainDir\imports","$BrainDir\processed" | Out-Null

# Install npm deps
Set-Location $Repo
npm install --silent

# Link CLI globally
npm link 2>$null

# Copy graph template
Copy-Item "$Repo\src\templates\graph.html" "$BrainDir\graph.html" -Force -ErrorAction SilentlyContinue

# Merge settings
node "$Repo\scripts\merge-settings.js" "$ClaudeDir\settings.json"

# Initialize store
node "$Repo\bin\brain.js" status 2>$null

Write-Host ""
Write-Host "✓ Visual Brain installed!"
Write-Host "  Data dir: $BrainDir"
Write-Host "  Run: brain status"
Write-Host "  Import: brain import path\to\export.zip"
