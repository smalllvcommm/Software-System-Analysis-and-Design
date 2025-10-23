@echo off
chcp 65001 >nul
echo ==========================================
echo   個人信息管理系統 - 一鍵啟動
echo ==========================================
echo.

echo [1/3] 檢查環境...
echo.

:: 檢查 Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 錯誤: 未找到 Java，請安裝 JDK 21+
    pause
    exit /b 1
)
echo ✅ Java 環境正常

:: 檢查 Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 錯誤: 未找到 Node.js，請安裝 Node.js 18+
    pause
    exit /b 1
)
echo ✅ Node.js 環境正常

echo.
echo [2/3] 啟動後端服務...
echo.

:: 啟動後端（在新窗口）
start "後端服務" cmd /c "cd backend && mvnw.cmd spring-boot:run"

:: 等待後端啟動
timeout /t 10 /nobreak >nul

echo.
echo [3/3] 啟動前端服務...
echo.

:: 檢查前端依賴
if not exist "frontend\node_modules" (
    echo 正在安裝前端依賴...
    cd frontend
    call npm install
    cd ..
)

:: 啟動前端（在新窗口）
start "前端服務" cmd /c "cd frontend && npm run dev"

echo.
echo ==========================================
echo   啟動完成！
echo ==========================================
echo.
echo 後端地址: http://localhost:8080
echo 前端地址: http://localhost:5173
echo.
echo 按任意鍵退出本窗口...
pause >nul

