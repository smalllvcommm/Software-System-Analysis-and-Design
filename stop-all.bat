@echo off
chcp 65001 >nul
echo ======================================
echo   停止所有服务
echo ======================================
echo.

echo [1/2] 停止后端服务（端口 8080）...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
    echo 正在停止进程 %%a...
    taskkill /F /PID %%a >nul 2>&1
)
echo ✓ 后端服务已停止

echo.
echo [2/2] 停止前端服务（端口 5173）...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    echo 正在停止进程 %%a...
    taskkill /F /PID %%a >nul 2>&1
)
echo ✓ 前端服务已停止

echo.
echo ======================================
echo ✓ 所有服务已停止
echo ======================================
echo.
pause

