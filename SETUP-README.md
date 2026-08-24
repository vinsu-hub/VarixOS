# Command Suite - Setup & Sync

> The legacy `.bat` sync scripts (`sync.bat`, `quick-sync.bat`, `setup-and-sync.bat`,
> `unit-setup.bat`) were removed — they targeted a different rclone remote
> (`googledrive:Obsidian/COMMAND SUITE`) and had a broken quoting bug in their
> pull/bidirectional paths. Everything below is the single supported setup.

## Quick Start

### New machine
```powershell
git clone https://github.com/vinsu-hub/VarixOS.git
cd VarixOS
powershell -ExecutionPolicy Bypass -File bootstrap.ps1
```
Bootstrap installs Git, Node.js LTS, Obsidian, and rclone via winget, restores plugin dependencies, and builds the command-center plugin (a prebuilt `main.js` is committed, so it works even without Node).

Then open Obsidian → *Open folder as vault* → select this folder → enable community plugins.

### Google Drive sync (rclone)
Remote convention: **`gdrive:`** remote → **`VarixOS`** folder.

```powershell
# One-time configuration (browser OAuth against your dedicated account)
powershell -ExecutionPolicy Bypass -File sync-drive.ps1 -Configure

# Manual sync any time
powershell -ExecutionPolicy Bypass -File sync-drive.ps1

# Hourly automatic sync (Windows scheduled task "VarixOS-DriveSync")
powershell -ExecutionPolicy Bypass -File sync-drive.ps1 -InstallTask

# Remove the scheduled task
powershell -ExecutionPolicy Bypass -File sync-drive.ps1 -UninstallTask
```

### Graph visualization
```bat
build-graph.bat
```
Rebuilds the graphify knowledge graph into `wiki/graphify-out/`.

## Command Center plugin

Source lives in `.obsidian/plugins/command-center/`. After editing:

```powershell
cd .obsidian\plugins\command-center
npm run build
```

The hot-reload plugin picks up changes automatically while Obsidian is running.
