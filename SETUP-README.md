# Command Suite - Setup & Sync

> The legacy `.bat` scripts (`sync.bat`, `quick-sync.bat`, `setup-and-sync.bat`,
> `unit-setup.bat`) have been restored for unit deployment and updated: they now
> target the **`gdrive:VarixOS`** remote convention, resolve the vault root from
> their own folder (portable across units), quote both sync paths correctly
> (fixing the old pull/bidirectional bug), exclude `node_modules`, and build the
> plugin via `npm run build`. `sync-drive.ps1` remains the primary sync path —
> the `.bat` files are convenience wrappers around the same rclone setup.

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
