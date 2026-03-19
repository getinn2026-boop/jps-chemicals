@echo off
echo Setting up JPS Chemicals application...
echo.

cd /d "%~dp0"

echo 1. Generating Prisma client...
node node_modules/prisma/build/index.js generate
if %errorlevel% neq 0 (
    echo Error: Failed to generate Prisma client
    pause
    exit /b 1
)

echo.
echo 2. Setting up database...
node node_modules/prisma/build/index.js db push
if %errorlevel% neq 0 (
    echo Error: Failed to setup database
    pause
    exit /b 1
)

echo.
echo 3. Starting development server...
echo.
echo You can now access your application at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

node node_modules/next/dist/bin/next dev

pause