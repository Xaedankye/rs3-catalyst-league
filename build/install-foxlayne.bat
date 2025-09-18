@echo off
setlocal enabledelayedexpansion

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

echo [INFO] Fetching latest release information...
for /f "tokens=*" %%i in ('powershell -Command "try { $response = Invoke-RestMethod -Uri 'https://api.github.com/repos/Xaedankye/rs3-catalyst-league/releases/latest'; $response.assets | Where-Object { $_.name -like '*.exe' } | Select-Object -First 1 -ExpandProperty browser_download_url } catch { Write-Host 'Error fetching release info'; exit 1 }"') do set DOWNLOAD_URL=%%i

if "%DOWNLOAD_URL%"=="" (
    echo [ERROR] Could not find download URL. Please check your internet connection.
    pause
    exit /b 1
)

echo [SUCCESS] Found latest release!

REM Create temp directory
set TEMP_DIR=%TEMP%\foxlayne-installer
if not exist "%TEMP_DIR%" mkdir "%TEMP_DIR%"

set INSTALLER_FILE=%TEMP_DIR%\Foxlayne-Setup.exe

echo [INFO] Downloading Foxlayne installer...
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
