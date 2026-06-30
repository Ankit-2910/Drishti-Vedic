# ============================================================================
# DRISHTI VEDIC+ v2.0 — One-Command PowerShell Deployment Helper
# ============================================================================
# Run from inside the drishti-v2 folder:
#   .\deploy\deploy.ps1
#
# This script checks prerequisites, installs dependencies, and walks you
# through the deployment with clear next-step prompts.
# ============================================================================

# Make script self-aware of its location
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
Set-Location $ProjectRoot

# Colors
function Write-Header($msg) { Write-Host "`n=== $msg ===" -ForegroundColor Cyan }
function Write-Step($msg)   { Write-Host "→ $msg" -ForegroundColor Yellow }
function Write-OK($msg)     { Write-Host "✓ $msg" -ForegroundColor Green }
function Write-Err($msg)    { Write-Host "✗ $msg" -ForegroundColor Red }
function Write-Info($msg)   { Write-Host "  $msg" -ForegroundColor Gray }

Write-Host @"

  ╔════════════════════════════════════════════════════════════╗
  ║                                                            ║
  ║       DRISHTI VEDIC+ v2.0 — Deployment Helper              ║
  ║       Shivanchal Consultants · Bhopal · 2026               ║
  ║                                                            ║
  ╚════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Magenta

# ============================================================================
# STEP 1 — Check prerequisites
# ============================================================================
Write-Header "STEP 1: Checking Prerequisites"

# Node.js
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        $major = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
        if ($major -ge 20) {
            Write-OK "Node.js $nodeVersion installed"
        } else {
            Write-Err "Node.js $nodeVersion found, but v20+ required"
            Write-Info "Download from https://nodejs.org"
            exit 1
        }
    }
} catch {
    Write-Err "Node.js not found"
    Write-Info "Install from https://nodejs.org and restart PowerShell"
    exit 1
}

# Git
try {
    $gitVersion = git --version 2>$null
    if ($gitVersion) { Write-OK "Git installed ($gitVersion)" }
} catch {
    Write-Err "Git not found"
    Write-Info "Install from https://git-scm.com/download/win"
    exit 1
}

# Execution policy
$policy = Get-ExecutionPolicy -Scope CurrentUser
if ($policy -eq 'Restricted') {
    Write-Err "PowerShell execution policy is Restricted"
    Write-Info "Run this in Administrator PowerShell:"
    Write-Info "  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser"
    exit 1
}
Write-OK "PowerShell execution policy: $policy"

# ============================================================================
# STEP 2 — Install dependencies
# ============================================================================
Write-Header "STEP 2: Installing Dependencies"

if (Test-Path "node_modules") {
    Write-Info "node_modules already exists — skipping install"
    $reinstall = Read-Host "Reinstall anyway? (y/N)"
    if ($reinstall -eq 'y') {
        Write-Step "Removing old node_modules..."
        Remove-Item -Recurse -Force node_modules
        Write-Step "Running npm install..."
        npm install
    }
} else {
    Write-Step "Running npm install (3-5 minutes)..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Err "npm install failed"
        Write-Info "Try: npm install --legacy-peer-deps"
        exit 1
    }
    Write-OK "Dependencies installed"
}

# ============================================================================
# STEP 3 — Setup .env.local
# ============================================================================
Write-Header "STEP 3: Environment Configuration"

if (-not (Test-Path ".env.local")) {
    Write-Step "Creating .env.local from template..."
    Copy-Item .env.example .env.local
    Write-OK ".env.local created"
    Write-Info "App runs in mock mode without API keys — perfect for first test"
    Write-Info "Add real keys later via Vercel dashboard"
} else {
    Write-OK ".env.local already exists"
}

# ============================================================================
# STEP 4 — Build test
# ============================================================================
Write-Header "STEP 4: Build Verification"

$skipBuild = Read-Host "Run production build test? (recommended, takes ~30s) (Y/n)"
if ($skipBuild -ne 'n') {
    Write-Step "Running next build..."
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Err "Build failed — fix errors above before deploying"
        exit 1
    }
    Write-OK "Build succeeded — ready for deployment"
}

# ============================================================================
# STEP 5 — Next steps menu
# ============================================================================
Write-Header "STEP 5: Choose Next Action"

Write-Host "  1. Run dev server locally (http://localhost:3000)"
Write-Host "  2. Initialize git + push to GitHub"
Write-Host "  3. Show Vercel deployment instructions"
Write-Host "  4. Exit"
Write-Host ""

$choice = Read-Host "Your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Step "Starting dev server on http://localhost:3000"
        Write-Info "Press Ctrl+C to stop"
        Start-Sleep -Seconds 2
        npm run dev
    }
    "2" {
        Write-Header "Git Setup"
        if (-not (Test-Path ".git")) {
            git init
            Write-OK "Git initialized"
        }

        $gitName = git config --global user.name
        if (-not $gitName) {
            $name = Read-Host "Your name for git commits"
            $email = Read-Host "Your email for git commits"
            git config --global user.name "$name"
            git config --global user.email "$email"
        }

        git add .
        $commitMsg = Read-Host "Commit message (default: 'Initial DRISHTI v2 build')"
        if (-not $commitMsg) { $commitMsg = "Initial DRISHTI v2 build" }
        git commit -m $commitMsg

        Write-Info ""
        Write-Info "Now create a repo at https://github.com/new (name it 'drishti-vedic')"
        Write-Info "Then run these commands (replace USERNAME):"
        Write-Info ""
        Write-Info "  git remote add origin https://github.com/USERNAME/drishti-vedic.git"
        Write-Info "  git branch -M main"
        Write-Info "  git push -u origin main"
    }
    "3" {
        Write-Header "Vercel Deployment Instructions"
        Write-Host "1. Visit https://vercel.com/new" -ForegroundColor White
        Write-Host "2. Click 'Import Git Repository'" -ForegroundColor White
        Write-Host "3. Select 'drishti-vedic' from list → Import" -ForegroundColor White
        Write-Host "4. Framework: Next.js (auto-detected)" -ForegroundColor White
        Write-Host "5. Click 'Deploy'" -ForegroundColor White
        Write-Host "6. Wait ~2 minutes for build" -ForegroundColor White
        Write-Host "7. Your URL: https://drishti-vedic.vercel.app" -ForegroundColor White
        Write-Host ""
        Write-Host "Adding real API keys later:" -ForegroundColor Cyan
        Write-Host "  Vercel → Project → Settings → Environment Variables" -ForegroundColor White
        Write-Host "  Add PROKERALA_CLIENT_ID, GEMINI_API_KEY, etc." -ForegroundColor White
        Write-Host "  Redeploy from Deployments tab" -ForegroundColor White
    }
    default {
        Write-OK "Setup complete. Run 'npm run dev' anytime to start."
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  Documentation: POWERSHELL-DEPLOYMENT-GUIDE.md" -ForegroundColor Cyan
Write-Host "  Master index:  README-V2.md" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
