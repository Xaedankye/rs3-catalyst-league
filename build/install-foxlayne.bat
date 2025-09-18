@echo off
setlocal enabledelayedexpansion

REM Foxlayne One-Click Installer for Windows
REM This script handles everything: download, install, and setup
REM
REM Usage: install-foxlayne.bat [version]
REM Example: install-foxlayne.bat v1.0.5
REM If no version is specified, it will install the latest release

echo 🦊 Foxlayne - RuneScape Catalyst League Tracker
echo ================================================
echo.

REM Check if PowerShell is available
powershell -Command "Write-Host '[INFO] Checking system requirements...'" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] PowerShell is required but not available.
    echo Please install PowerShell and try again.
    pause
    exit /b 1
)

REM Handle version parameter
if "%1"=="" (
    echo [INFO] Installing latest version...
    set RELEASE_URL=https://api.github.com/repos/Xaedankye/rs3-catalyst-league/releases/latest
) else (
    echo [INFO] Installing specific version: %1
    set RELEASE_URL=https://api.github.com/repos/Xaedankye/rs3-catalyst-league/releases/tags/%1
)

echo [INFO] Fetching release information...
for /f "tokens=*" %%i in ('powershell -Command "try { $response = Invoke-RestMethod -Uri '%RELEASE_URL%'; $response.assets | Where-Object { $_.name -like '*.exe' } | Select-Object -First 1 -ExpandProperty browser_download_url } catch { Write-Host 'Error fetching release info'; exit 1 }"') do set DOWNLOAD_URL=%%i

for /f "tokens=*" %%i in ('powershell -Command "try { $response = Invoke-RestMethod -Uri '%RELEASE_URL%'; $response.assets | Where-Object { $_.name -like '*.exe' } | Select-Object -First 1 -ExpandProperty name } catch { Write-Host 'Error fetching release info'; exit 1 }"') do set INSTALLER_FILENAME=%%i

if "%DOWNLOAD_URL%"=="" (
    echo [ERROR] Could not find download URL. Please check your internet connection.
    pause
    exit /b 1
)

echo [SUCCESS] Found release!
echo [INFO] Installer file: %INSTALLER_FILENAME%
echo [INFO] Download URL: %DOWNLOAD_URL%

REM Create temp directory
set TEMP_DIR=%TEMP%\foxlayne-installer
if not exist "%TEMP_DIR%" mkdir "%TEMP_DIR%"

set INSTALLER_FILE=%TEMP_DIR%\%INSTALLER_FILENAME%

echo [INFO] Downloading Foxlayne installer...
echo [INFO] Saving to: %INSTALLER_FILE%
powershell -Command "try { Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%INSTALLER_FILE%' } catch { Write-Host 'Download failed'; exit 1 }"

if not exist "%INSTALLER_FILE%" (
    echo [ERROR] Download failed. Please check your internet connection.
    pause
    exit /b 1
)

echo [SUCCESS] Download completed!

echo [INFO] Starting installation...
echo [INFO] Please follow the installation wizard that opens.

REM Run the installer
start /wait "" "%INSTALLER_FILE%"

REM Clean up
rmdir /s /q "%TEMP_DIR%" 2>nul

echo.
echo [SUCCESS] Installation completed successfully!
echo.
echo 🎉 Foxlayne has been installed and is ready to use!
echo.
echo You can now launch Foxlayne from your Start Menu or Desktop.
echo.
echo For support, visit: https://github.com/Xaedankye/rs3-catalyst-league
echo.

pause
