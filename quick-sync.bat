@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo    COMMAND SUITE - Quick Sync
echo ========================================
echo.

set "VAULT_PATH=D:\OBSIDIAN\COMMAND SUITE"
set "GDRIVE_REMOTE=googledrive:Obsidian/COMMAND SUITE"

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

rclone sync "%VAULT_PATH%" %GDRIVE_REMOTE% --progress --exclude ".obsidian/workspace.json" --exclude ".obsidian/workspace-mobile.json" --exclude "graphify-out/.graphify_*"

if %errorLevel% equ 0 (
    echo.
    echo [OK] Sync complete!
) else (
    echo.
    echo [ERROR] Sync failed. Check rclone configuration.
)

echo.
pause
