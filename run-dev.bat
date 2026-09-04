@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo   VANVISION - Forest Rights Decision Intelligence DSS
echo ========================================================
echo.

:: 1. Add common Windows / Winget Node paths if not already in PATH
if exist "%LOCALAPPDATA%\Microsoft\WinGet\Links" (
    set "PATH=%LOCALAPPDATA%\Microsoft\WinGet\Links;!PATH!"
)
if exist "%LOCALAPPDATA%\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.19.0-win-x64" (
    set "PATH=%LOCALAPPDATA%\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.19.0-win-x64;!PATH!"
)

:: 2. Verify Node.js and npm are available
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not found in your PATH.
    echo Please install Node.js LTS version from https://nodejs.org/
    echo or restart your terminal / computer if you just installed it.
    echo.
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not found in your PATH.
    echo.
    pause
    exit /b 1
)

:: 3. Check if node_modules exists, if not install dependencies
if not exist "%~dp0node_modules" (
    echo [INFO] First-time setup: Installing required dependencies...
    cd /d "%~dp0"
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

:: 4. Check if current path contains a hash '#' symbol (Vite known issue with '#' in paths)
set "DIR_PATH=%~dp0"
if "%DIR_PATH:~-1%"=="\" set "DIR_PATH=%DIR_PATH:~0,-1%"

echo %DIR_PATH% | findstr /c:"#" >nul
if %errorlevel% equ 0 (
    echo [INFO] Detected '#' symbol in directory path.
    echo [INFO] Using virtual drive mount V: for Vite compatibility...
    if not exist "V:\" (
        subst V: "%DIR_PATH%"
    )
    cd /d V:\
) else (
    cd /d "%DIR_PATH%"
)

:: 5. Start the Vite development server
echo [SUCCESS] Launching VANVISION dev server...
echo.
call npm run dev

if errorlevel 1 (
    echo.
    echo [ERROR] Server exited with an error.
    pause
)
