@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo    COMMAND SUITE - Bidirectional Sync
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

echo Bidirectional sync with Google Drive...
echo Source: %VAULT_PATH%
echo Remote: %GDRIVE_REMOTE%
echo.

:: Ask user for sync direction
echo Select sync direction:
echo   [1] Push (Local → Google Drive)
echo   [2] Pull (Google Drive → Local)
echo   [3] Bidirectional (merge both)
echo.
set /p "choice=Enter choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo Pushing local changes to Google Drive...
    rclone sync "%VAULT_PATH%" %GDRIVE_REMOTE% --progress --exclude ".obsidian/workspace.json" --exclude ".obsidian/workspace-mobile.json" --exclude "graphify-out/.graphify_*"
) else if "%choice%"=="2" (
    echo.
    echo Pulling remote changes to local...
    rclone sync %GDRIVE_REMOTE%"%VAULT_PATH%" --progress --exclude ".obsidian/workspace.json" --exclude ".obsidian/workspace-mobile.json" --exclude "graphify-out/.graphify_*"
) else if "%choice%"=="3" (
    echo.
    echo Merging both directions...
    :: First push local changes
    echo [1/2] Pushing local changes...
    rclone sync "%VAULT_PATH%" %GDRIVE_REMOTE% --progress --exclude ".obsidian/workspace.json" --exclude ".obsidian/workspace-mobile.json" --exclude "graphify-out/.graphify_*"
    
    :: Then pull any remote changes
    echo [2/2] Pulling remote changes...
    rclone copy %GDRIVE_REMOTE%"%VAULT_PATH%" --progress --exclude ".obsidian/workspace.json" --exclude ".obsidian/workspace-mobile.json" --exclude "graphify-out/.graphify_*"
) else (
    echo [ERROR] Invalid choice
    pause
    exit /b 1
)

if %errorLevel% equ 0 (
    echo.
    echo [OK] Sync complete!
) else (
    echo.
    echo [ERROR] Sync failed. Check rclone configuration.
)

echo.
pause
