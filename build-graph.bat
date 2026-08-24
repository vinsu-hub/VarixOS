@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo    COMMAND SUITE - Build Graph
echo ========================================
echo.

:: Vault root = the folder this script lives in (portable across units)
set "VAULT_PATH=%~dp0"
if "!VAULT_PATH:~-1!"=="\" set "VAULT_PATH=!VAULT_PATH:~0,-1!"

:: Check if Python is available
where python >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Python not found.
    pause
    exit /b 1
)

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
)

echo Building graph from wiki folder...
cd /d "%VAULT_PATH%"

:: Create graphify-out if it doesn't exist
if not exist "graphify-out" mkdir graphify-out

:: Write Python path
python -c "import sys; open('graphify-out/.graphify_python', 'w', encoding='utf-8').write(sys.executable)"

:: Run graphify
graphify wiki --html

if %errorLevel% equ 0 (
    echo.
    echo [OK] Graph built successfully!
    echo Open: %VAULT_PATH%\graphify-out\graph.html
) else (
    echo.
    echo [ERROR] Graph build failed.
)

echo.
pause
