# VarixOS — Obsidian Command Suite

Portable, self-installing copy of the Varix command-center vault. Pull this repo on any machine and everything needed is one script away.

## Quick start (new machine)

```powershell
git clone https://github.com/vinsu-hub/VarixOS.git
cd VarixOS
powershell -ExecutionPolicy Bypass -File bootstrap.ps1
```

Bootstrap installs **Git, Node.js LTS, Obsidian, rclone** via winget, restores plugin dependencies, and builds the command-center plugin from source. The plugin ships prebuilt (`main.js` committed), so it works even without Node.

Then: open Obsidian → *Open folder as vault* → select this folder → enable community plugins.

## Google Drive sync

The vault syncs to a dedicated Google Drive folder (`gdrive:VarixOS`) using rclone.

```powershell
# One-time configuration (browser OAuth against your dedicated account)
powershell -ExecutionPolicy Bypass -File sync-drive.ps1 -Configure

# Manual sync any time
powershell -ExecutionPolicy Bypass -File sync-drive.ps1

# Hourly automatic sync (Windows scheduled task)
powershell -ExecutionPolicy Bypass -File sync-drive.ps1 -InstallTask

# Remove the scheduled task
powershell -ExecutionPolicy Bypass -File sync-drive.ps1 -UninstallTask
```

## What's inside

| Path | Purpose |
|---|---|
| `ops/` | Recurring operational docs — metrics, schedule, headlines, today |
| `projects/` | All active work by domain, each with a `STATUS.md` |
| `content/`, `wiki/`, `inbox/`, `daily-notes/`, `system/` | Deliverables, research, captures, logs, config |
| `_archive-vault/` | Retired content |
| `.obsidian/plugins/command-center/` | Custom dashboard plugin (TypeScript + esbuild) |

## Command Center plugin

The dashboard reads `ops/` files and per-domain `STATUS.md` files. Conventions:

- **Pipeline** — checklist items under `## Pipeline Value` in `ops/metrics.md` tagged `[lead] [contacted] [proposal] [won] [lost]`
- **Blocked** — add a line `Status: blocked — <reason>` to any project's `STATUS.md`
- **Sync health** — dots derive from each `STATUS.md` `## Last Updated` field; thresholds configurable in plugin settings
- **Changelog** — done tasks routed `→ slug` get appended to that project's `## Changelog` by the Handoff Writer skill

Rebuild after editing plugin source:

```powershell
cd .obsidian/plugins/command-center
npm install   # once
npm run build # after edits
```

## Repo hygiene

- `node_modules/` and machine-specific Obsidian state are gitignored
- Plugin bundles (`main.js`) are committed so clones run immediately
