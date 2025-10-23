@echo off
chcp 65001 >nul
echo ======================================
echo   个人信息管理系统 - 一键启动
echo ======================================
echo.

echo 提示: 此脚本将同时启动前端和后端服务
echo       每个服务会在独立的窗口中运行
echo.
echo 启动后:
echo   - 后端: http://localhost:8080
echo   - 前端: http://localhost:5173
echo.
echo 按任意键开始启动，或关闭窗口取消...
pause >nul

echo.
echo [1/2] 启动后端服务...
start "后端服务 - Spring Boot" cmd /k "cd /d %~dp0 && start-backend.bat"
echo ✓ 后端服务窗口已打开

echo.
echo 等待 5 秒让后端先启动...
timeout /t 5 /nobreak >nul

echo.
echo [2/2] 启动前端服务...
start "前端服务 - Vite" cmd /k "cd /d %~dp0 && start-frontend.bat"
echo ✓ 前端服务窗口已打开

echo.
echo ======================================
echo ✓ 启动完成！
echo ======================================
echo.
echo 两个服务窗口已打开：
echo   1. 后端服务 - Spring Boot
echo   2. 前端服务 - Vite
echo.
echo 等待服务完全启动后（约 30-60 秒），访问：
echo   http://localhost:5173
echo.
echo 要停止所有服务，请：
echo   - 关闭两个服务窗口
echo   - 或运行 stop-all.bat
echo.
echo ======================================
pause
