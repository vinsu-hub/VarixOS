# VarixOS bootstrap — one-shot setup for a fresh machine.
# Installs required applications, restores plugin dependencies, and builds the
# command-center plugin. Run from the vault root:
#   powershell -ExecutionPolicy Bypass -File bootstrap.ps1

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }

Write-Host "=== VarixOS Bootstrap ===" -ForegroundColor Cyan
Write-Host "Vault root: $root`n"

function Test-Cmd($name) {
    return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

# ── 1. Applications via winget ──
if (-not (Test-Cmd "winget")) {
    Write-Warning "winget not found — install App Installer from the Microsoft Store, then re-run."
} else {
    $apps = @(
        @{ Id = "Git.Git";              Name = "Git" },
        @{ Id = "OpenJS.NodeJS.LTS";    Name = "Node.js LTS" },
        @{ Id = "Obsidian.Obsidian";    Name = "Obsidian" },
        @{ Id = "Rclone.Rclone";        Name = "rclone" }
    )
    foreach ($app in $apps) {
        if ($app.Id -eq "Obsidian.Obsidian" -and (Test-Path "$env:LOCALAPPDATA\Programs\obsidian\Obsidian.exe")) {
            Write-Host "[skip] $($app.Name) already installed" -ForegroundColor DarkGray
            continue
        }
        if ($app.Name -eq "Git" -and (Test-Cmd "git")) { Write-Host "[skip] Git already installed" -ForegroundColor DarkGray; continue }
        if ($app.Name -eq "Node.js LTS" -and (Test-Cmd "node")) { Write-Host "[skip] Node.js already installed" -ForegroundColor DarkGray; continue }
        if ($app.Name -eq "rclone" -and (Test-Cmd "rclone")) { Write-Host "[skip] rclone already installed" -ForegroundColor DarkGray; continue }
        Write-Host "[install] $($app.Name)..." -ForegroundColor Yellow
        winget install --id $app.Id --silent --accept-package-agreements --accept-source-agreements
        # Refresh PATH for this session after installs
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    }
}

# ── 2. Plugin dependencies + build ──
$pluginDir = Join-Path $root ".obsidian\plugins\command-center"
if (Test-Path (Join-Path $pluginDir "package.json")) {
    if (Test-Cmd "npm") {
        Push-Location $pluginDir
        try {
            if (Test-Path (Join-Path $pluginDir "main.js")) {
                Write-Host "`n[ok] command-center main.js present (prebuilt)" -ForegroundColor Green
                Write-Host "     Rebuilding anyway to match your local main.ts..." -ForegroundColor DarkGray
            } else {
                Write-Host "`n[build] command-center main.js missing — building..." -ForegroundColor Yellow
            }
            npm install
            npm run build
            Write-Host "[ok] command-center built" -ForegroundColor Green
        } finally {
            Pop-Location
        }
    } else {
        Write-Warning "npm not found. The committed prebuilt main.js will still work; install Node.js to rebuild from source."
    }
}

# ── 3. Sanity checks ──
$required = @("CLAUDE.md", "ops\metrics.md", ".obsidian\community-plugins.json")
foreach ($f in $required) {
    if (Test-Path (Join-Path $root $f)) { Write-Host "[ok] $f" -ForegroundColor Green }
    else { Write-Warning "missing: $f" }
}

Write-Host "`n=== Next steps ===" -ForegroundColor Cyan
Write-Host "1. Open Obsidian -> Open folder as vault -> select this folder."
Write-Host "2. Settings -> Community plugins -> Turn on community plugins (enable Command Center)."
Write-Host "3. Optional Google Drive sync:"
Write-Host "   powershell -ExecutionPolicy Bypass -File sync-drive.ps1 -Configure   # first time only"
Write-Host "   powershell -ExecutionPolicy Bypass -File sync-drive.ps1               # then as needed"
