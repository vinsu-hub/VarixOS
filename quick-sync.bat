@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo    COMMAND SUITE - Quick Sync
echo ========================================
echo.

:: Vault root = the folder this script lives in (portable across units)
set "VAULT_PATH=%~dp0"
if "!VAULT_PATH:~-1!"=="\" set "VAULT_PATH=!VAULT_PATH:~0,-1!"
set "GDRIVE_REMOTE=gdrive:VarixOS"

:: Check if rclone is available
where rclone >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] rclone not found.
    echo Please install from: https://rclone.org/install/
    echo Or run: winget install Rclone.Rclone
    pause
    exit /b 1
)

:: Sync to Google Drive
echo Syncing vault to Google Drive...
echo Source: %VAULT_PATH%
echo Destination: %GDRIVE_REMOTE%
echo.

rclone sync "%VAULT_PATH%" "%GDRIVE_REMOTE%" --progress --exclude ".obsidian/workspace.json" --exclude ".obsidian/workspace-mobile.json" --exclude "node_modules/**" --exclude "graphify-out/.graphify_*"

if %errorLevel% equ 0 (
    echo.
    echo [OK] Sync complete!
) else (
    echo.
    echo [ERROR] Sync failed. Check rclone configuration.
)

echo.
pause
