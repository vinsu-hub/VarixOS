# Google Drive sync for the VarixOS vault via rclone.
# First-time setup (one time per machine, needs a browser for OAuth):
#   powershell -ExecutionPolicy Bypass -File sync-drive.ps1 -Configure
# Sync to the dedicated drive:
#   powershell -ExecutionPolicy Bypass -File sync-drive.ps1
# Optional scheduled sync every hour:
#   powershell -ExecutionPolicy Bypass -File sync-drive.ps1 -InstallTask

param(
    [switch]$Configure,
    [switch]$InstallTask,
    [switch]$UninstallTask,
    [string]$Remote = "gdrive",
    [string]$Folder = "VarixOS"
)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }
$taskName = "VarixOS-DriveSync"

if (-not (Get-Command rclone -ErrorAction SilentlyContinue)) {
    Write-Error "rclone not found. Run bootstrap.ps1 first, or: winget install Rclone.Rclone"
}

if ($UninstallTask) {
    schtasks /Delete /TN $taskName /F 2>$null
    Write-Host "Scheduled task '$taskName' removed." -ForegroundColor Green
    exit 0
}

if ($Configure) {
    $remotes = rclone listremotes 2>$null
    if ($remotes -contains "$Remote`:") {
        Write-Host "Remote '$Remote`:' already configured." -ForegroundColor Green
        # Ensure target folder exists
        rclone mkdir "${Remote}:/$Folder"
    } else {
        Write-Host "Configuring rclone remote '$Remote' (Google Drive)..." -ForegroundColor Yellow
        Write-Host "-> A browser window will open for Google OAuth. Choose your dedicated account and allow access.`n"
        rclone config create $Remote drive --non-interactive 2>$null
        if (-not (rclone listremotes) -or -not ((rclone listremotes) -contains "$Remote`:")) {
            Write-Warning "Interactive setup required. Running 'rclone config' — choose n) New remote, name it '$Remote', pick drive, accept defaults."
            rclone config
        }
        rclone mkdir "${Remote}:/$Folder"
    }
    Write-Host "Target ready at ${Remote}:/$Folder" -ForegroundColor Green
    exit 0
}

if ($InstallTask) {
    $ps = (Get-Command powershell).Source
    $action = "`"$ps`" -ExecutionPolicy Bypass -NoProfile -File `"$root\sync-drive.ps1`""
    schtasks /Create /TN $taskName /TR $action /SC HOURLY /F | Out-Null
    Write-Host "Scheduled task '$taskName' created (runs hourly)." -ForegroundColor Green
    exit 0
}

Write-Host "Syncing vault -> ${Remote}:/$Folder ..." -ForegroundColor Cyan
rclone sync "$root" "${Remote}:/$Folder" --exclude ".obsidian/workspace.json" --exclude "node_modules/**" --progress
if ($LASTEXITCODE -eq 0) { Write-Host "Sync complete." -ForegroundColor Green }
else { Write-Error "rclone exited with code $LASTEXITCODE" }
