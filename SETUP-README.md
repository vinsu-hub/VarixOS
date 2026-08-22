# Command Suite - Setup & Sync

## Quick Start

### First Time Setup (Main Unit)
Run `setup-and-sync.bat` to:
1. Check system prerequisites (Python, Node.js)
2. Install Python dependencies (graphify)
3. Build the Command Center plugin
4. Build graph visualization
5. Install rclone (if needed)
6. Sync to Google Drive
7. Verify all plugins
8. Generate summary

### First Time Setup (New Unit)
Run `unit-setup.bat` to:
1. Check system prerequisites
2. Install rclone
3. Pull vault from Google Drive
4. Install Python dependencies
5. Build Command Center plugin
6. Build graph visualization
7. Verify plugins
8. Generate summary

### Daily Sync
Run `quick-sync.bat` to sync your vault to Google Drive.

### Bidirectional Sync
Run `sync.bat` to:
- Push local changes to Google Drive
- Pull remote changes to local
- Merge both directions

### Rebuild Graph
Run `build-graph.bat` to rebuild the knowledge graph visualization.

## Prerequisites

### Required
- Python 3.9+ (with pip)
- Node.js 16+ (with npm)

### Optional (for Google Drive sync)
- rclone (installed automatically by setup-and-sync.bat)
- Google Drive remote configured in rclone

## rclone Configuration

1. Install rclone: `winget install Rclone.Rclone`
2. Run configuration: `rclone config`
3. Choose "n" for new remote
4. Name it: `googledrive`
5. Choose "Google Drive"
6. Follow prompts to authenticate

## Installed Plugins

| Plugin | Purpose | Hotkey |
|--------|---------|--------|
| command-center | Dashboard | — |
| obsidian-living-graph | Knowledge graph | Shift+P, Shift+C |
| termy | Terminal | Shift+T, Shift+E |
| hot-reload | Development | — |

## File Structure

```
COMMAND SUITE/
├── .obsidian/           # Obsidian config
│   └── plugins/
│       ├── command-center/  # Custom dashboard plugin
│       ├── obsidian-living-graph/  # Graph visualization
│       ├── termy/  # Terminal emulator
│       └── hot-reload/  # Development helper
├── wiki/                # Knowledge base (51 nodes)
├── graphify-out/        # Graph visualization
│   └── graph.html       # Interactive graph
├── ops/                 # Operations
├── projects/            # Project files
├── setup-and-sync.bat   # Full setup script (main unit)
├── unit-setup.bat       # New unit setup script
├── quick-sync.bat       # Quick sync script
├── sync.bat             # Bidirectional sync script
└── build-graph.bat      # Graph rebuild script
```

## Multi-Unit Setup

To set up another computer with the same vault:

1. Copy the entire `COMMAND SUITE` folder to the new unit
2. Run `unit-setup.bat` on the new unit
3. Use `sync.bat` to keep both units in sync

### Sync Workflow
- **Main Unit**: Make changes, run `quick-sync.bat` to push
- **New Unit**: Run `sync.bat` →选择 "Pull" to get changes
- **Both Units**: Run `sync.bat` →选择 "Bidirectional" to merge

## Hotkeys

| Hotkey | Action |
|--------|--------|
| Shift+T | Open terminal |
| Shift+E | Close terminal |
| Shift+P | Toggle graph |
| Shift+C | Toggle graph |

## Troubleshooting

### "graphify not found"
```bash
pip install graphifyy
```

### "rclone not configured"
```bash
rclone config
# Set up googledrive remote
```

### "Plugin build failed"
```bash
npm install -g esbuild
cd .obsidian/plugins/command-center
esbuild main.ts --bundle --outfile=main.js --external:obsidian --format=cjs --target=es2018
```

### Graph shows no edges
This is normal for wiki-only content. The graph extracts concepts and relationships from markdown files.

### Terminal not working
The Termy plugin uses PowerShell on Windows. If you encounter issues:
1. Check that PowerShell is in your PATH
2. Try running `powershell` from Command Prompt
3. Restart Obsidian after installation
