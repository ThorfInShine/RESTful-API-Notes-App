@echo off
echo.
echo ===================================
echo    Notes App Docker Update Script
echo ===================================
echo.

set IMAGE_NAME=ghcr.io/thorfinshine/restful-api-notes-app:latest
set CONTAINER_NAME=notes-app

echo [INFO] Checking Docker status...
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

echo [INFO] Current container status:
docker ps -a --filter "name=%CONTAINER_NAME%" --format "table {{.Names}}\t{{.Status}}"

echo.
echo [INFO] Pulling latest image...
docker pull %IMAGE_NAME%
if errorlevel 1 (
    echo [ERROR] Failed to pull latest image
    pause
    exit /b 1
)

echo [INFO] Stopping existing container...
docker stop %CONTAINER_NAME% 2>nul

echo [INFO] Removing existing container...
docker rm %CONTAINER_NAME% 2>nul

echo [INFO] Starting new container...
docker run -d --name %CONTAINER_NAME% --restart unless-stopped -p 8080:80 %IMAGE_NAME%
if errorlevel 1 (
    echo [ERROR] Failed to start container
    pause
    exit /b 1
)

echo [INFO] Cleaning up old images...
docker image prune -f

echo.
echo ===================================
echo [SUCCESS] Update completed!
echo Application available at: http://localhost:8080
echo ===================================
echo.
pause