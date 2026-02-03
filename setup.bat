@echo off
echo ==========================================
echo SplitMint Setup Script
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version and install with default settings.
    echo.
    echo After installation, restart your terminal and run this script again.
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

REM Check if npm is available
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not available!
    echo Please reinstall Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] npm is available
npm --version
echo.

REM Check if .env.local exists
if not exist ".env.local" (
    echo [WARNING] .env.local file not found!
    echo.
    echo Creating .env.local from template...
    copy .env.example .env.local >nul 2>nul
    echo.
    echo [ACTION REQUIRED] Please edit .env.local and add your Supabase credentials:
    echo   1. Go to https://supabase.com
    echo   2. Create a project
    echo   3. Get your Project URL and anon key from Settings -^> API
    echo   4. Edit .env.local and replace the placeholder values
    echo.
    notepad .env.local
    echo.
)

echo ==========================================
echo Installing Dependencies...
echo ==========================================
echo.
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Failed to install dependencies!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo Next Steps:
echo   1. Make sure you've set up Supabase:
echo      - Create account at https://supabase.com
echo      - Create a new project
echo      - Run the SQL from supabase-schema.sql
echo      - Add credentials to .env.local
echo.
echo   2. Start the development server:
echo      npm run dev
echo.
echo   3. Open your browser to:
echo      http://localhost:3000
echo.
echo For detailed instructions, see QUICKSTART.md
echo.
pause
