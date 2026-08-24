@echo off
setlocal enabledelayedexpansion

echo.
echo  ██████╗ ██████╗ ██████╗ ███████╗    ███╗   ███╗ ██████╗ ██████╗  █████╗ ██╗     
echo ██╔════╝██╔═══██╗██╔══██╗██╔════╝    ████╗ ████║██╔═══██╗██╔══██╗██╔══██╗██║     
echo ██║     ██║   ██║██║  ██║█████╗      ██╔████╔██║██║   ██║██████╔╝███████║██║     
echo ██║     ██║   ██║██║  ██║██╔══╝      ██║╚██╔╝██║██║   ██║██╔══██╗██╔══██║██║     
echo ╚██████╗╚██████╔╝██████╔╝███████╗    ██║ ╚═╝ ██║╚██████╔╝██║  ██║██║  ██║███████╗
echo  ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝    ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
echo.
echo  ███╗   ███╗██╗   ██╗██████╗ ███████╗██████╗     ██████╗ ██████╗ ██╗███████╗███████╗
echo  ████╗ ████║██║   ██║██╔══██╗██╔════╝██╔══██╗    ██╔══██╗██╔══██╗██║██╔════╝██╔════╝
echo  ██╔████╔██║██║   ██║██║  ██║█████╗  ██████╔╝    ██████╔╝██████╔╝██║█████╗  ███████╗
echo  ██║╚██╔╝██║██║   ██║██║  ██║██╔══╝  ██╔══██╗    ██╔═══╝ ██╔══██╗██║██╔══╝  ╚════██║
echo  ██║ ╚═╝ ██║╚██████╔╝██████╔╝███████╗██║  ██║    ██║     ██║  ██║██║███████╗███████║
echo  ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝    ╚═╝     ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝
echo.
echo  ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
echo  ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
echo     ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
echo     ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
echo     ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
echo     ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
echo.
echo ========================================
echo    COMMAND SUITE - Complete Setup
echo ========================================
echo.

:: Configuration
:: Vault root = the folder this script lives in (portable across units)
set "VAULT_PATH=%~dp0"
if "!VAULT_PATH:~-1!"=="\" set "VAULT_PATH=!VAULT_PATH:~0,-1!"
set "GDRIVE_REMOTE=gdrive:VarixOS"
set "RCLONE_CONFIG=%USERPROFILE%\.config\rclone\rclone.conf"
set "PLUGIN_DIR=%VAULT_PATH%\.obsidian\plugins"

:: ============================================
:: STEP 1: System Check
:: ============================================
echo [1/8] System Check...
echo.

:: Check Python
where python >nul 2>&1
if %errorLevel% equ 0 (
    echo [OK] Python found
    python --version 2>&1 | findstr /v "Python"
) else (
    echo [ERROR] Python not found. Please install Python 3.9+
    pause
    exit /b 1
)

:: Check Node.js
where node >nul 2>&1
if %errorLevel% equ 0 (
    echo [OK] Node.js found
) else (
    echo [ERROR] Node.js not found. Please install Node.js
    pause
    exit /b 1
)

:: Check npm
where npm >nul 2>&1
if %errorLevel% equ 0 (
    echo [OK] npm found
) else (
    echo [ERROR] npm not found
    pause
    exit /b 1
)

:: ============================================
:: STEP 2: Install Python Dependencies
:: ============================================
echo.
echo [2/8] Installing Python dependencies...
echo.

:: Check if graphify is installed
python -c "import graphify" >nul 2>&1
if %errorLevel% neq 0 (
    echo Installing graphify...
    pip install graphifyy -q
    if %errorLevel% neq 0 (
        echo [ERROR] Failed to install graphify
        pause
        exit /b 1
    )
    echo [OK] graphify installed
) else (
    echo [OK] graphify already installed
)

:: ============================================
:: STEP 3: Build Command Center Plugin
:: ============================================
echo.
echo [3/8] Building Command Center plugin...
echo.

if exist "%PLUGIN_DIR%\command-center\package.json" (
    echo Building plugin via npm run build...
    cd /d "%PLUGIN_DIR%\command-center"
    call npm run build
    if !errorLevel! equ 0 (
        echo [OK] Plugin built successfully
    ) else (
        echo [WARNING] Plugin build failed. Using committed prebuilt main.js.
    )
) else if exist "%PLUGIN_DIR%\command-center\main.js" (
    echo [SKIP] No package.json — using committed prebuilt main.js
) else (
    echo [SKIP] No command-center plugin found
)

:: ============================================
:: STEP 4: Build Graph Visualization
:: ============================================
echo.
echo [4/8] Building graph visualization...
echo.

if exist "%VAULT_PATH%\wiki" (
    cd /d "%VAULT_PATH%"
    
    :: Create graphify-out if it doesn't exist
    if not exist "graphify-out" mkdir graphify-out
    
    :: Write Python path
    python -c "import sys; open('graphify-out/.graphify_python', 'w', encoding='utf-8').write(sys.executable)"
    
    :: Run graphify
    echo Running graphify on wiki folder...
    graphify wiki --html
    
    if %errorLevel% equ 0 (
        echo [OK] Graph built successfully
    ) else (
        echo [WARNING] Graph build failed. Check if wiki folder exists.
    )
) else (
    echo [SKIP] No wiki folder found
)

:: ============================================
:: STEP 5: Install rclone
:: ============================================
echo.
echo [5/8] Checking rclone for Google Drive sync...
echo.

where rclone >nul 2>&1
if %errorLevel% neq 0 (
    echo rclone not found. Installing...
    
    :: Check if winget is available
    where winget >nul 2>&1
    if %errorLevel% equ 0 (
        winget install Rclone.Rclone --accept-package-agreements --accept-source-agreements
    ) else (
        echo [INFO] Please install rclone manually from: https://rclone.org/install/
        echo Or run: winget install Rclone.Rclone
    )
) else (
    echo [OK] rclone already installed
)

:: Check if rclone config exists
if not exist "%RCLONE_CONFIG%" (
    echo.
    echo [INFO] rclone not configured for Google Drive.
    echo Preferred: powershell -ExecutionPolicy Bypass -File sync-drive.ps1 -Configure
    echo Or manually: rclone config — set up a remote named 'gdrive'.
    echo Target folder convention: gdrive:VarixOS
    echo.
)

:: ============================================
:: STEP 6: Sync to Google Drive
:: ============================================
echo.
echo [6/8] Syncing vault to Google Drive...
echo.

where rclone >nul 2>&1
if %errorLevel% equ 0 (
    :: Check if config exists
    if exist "%RCLONE_CONFIG%" (
        echo Syncing %VAULT_PATH% to %GDRIVE_REMOTE%...
        rclone sync "%VAULT_PATH%" "%GDRIVE_REMOTE%" --progress --exclude ".obsidian/workspace.json" --exclude ".obsidian/workspace-mobile.json" --exclude "node_modules/**" --exclude "graphify-out/.graphify_*"
        
        if %errorLevel% equ 0 (
            echo [OK] Sync complete
        ) else (
            echo [ERROR] Sync failed. Check rclone configuration.
        )
    ) else (
        echo [SKIP] rclone not configured. Run 'rclone config' first.
    )
) else (
    echo [SKIP] rclone not available. Install it first.
)

:: ============================================
:: STEP 7: Verify Plugins
:: ============================================
echo.
echo [7/8] Verifying plugins...
echo.

:: Check community-plugins.json
if exist "%PLUGIN_DIR%\community-plugins.json" (
    echo [OK] community-plugins.json found
    
    :: List installed plugins
    echo Installed plugins:
    for /f "delims=" %%i in (%PLUGIN_DIR%\community-plugins.json) do (
        echo   %%i
    )
) else (
    echo [WARNING] community-plugins.json not found
)

:: Check each plugin
for /d %%D in ("%PLUGIN_DIR%\*") do (
    if exist "%%D\manifest.json" (
        echo [OK] Plugin: %%~nxD
    )
)

:: ============================================
:: STEP 8: Generate Summary
:: ============================================
echo.
echo [8/8] Generating summary...
echo.

:: Count files
set /a md_count=0
for /r "%VAULT_PATH%" %%f in (*.md) do set /a md_count+=1

:: Count wiki nodes
set /a wiki_count=0
if exist "%VAULT_PATH%\wiki" (
    for /r "%VAULT_PATH%\wiki" %%f in (*.md) do set /a wiki_count+=1
)

:: Count plugins
set /a plugin_count=0
for /d %%D in ("%PLUGIN_DIR%\*") do (
    if exist "%%D\manifest.json" set /a plugin_count+=1
)

:: ============================================
:: DONE
:: ============================================
echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo  Vault Statistics:
echo    - Total .md files: !md_count!
echo    - Wiki nodes: !wiki_count!
echo    - Plugins installed: !plugin_count!
echo.
echo  Plugins:
echo    - command-center (dashboard)
echo    - obsidian-living-graph (visualization)
echo    - termy (terminal)
echo    - hot-reload (development)
echo.
echo  Quick Commands:
echo    - Shift+D: Open Command Center dashboard
echo    - Shift+T: Open terminal
echo    - Shift+E: Close terminal
echo    - Shift+P: Toggle graph
echo    - Shift+C: Toggle graph
echo.
echo  Graph Visualization:
if exist "%VAULT_PATH%\graphify-out\graph.html" (
    echo    - Open: %VAULT_PATH%\graphify-out\graph.html
) else (
    echo    - Not built yet. Run build-graph.bat
)
echo.
echo  Google Drive Sync:
if exist "%RCLONE_CONFIG%" (
    echo    - Configured: %GDRIVE_REMOTE%
) else (
    echo    - Not configured. Run rclone config
)
echo.
echo ========================================
echo.
pause
