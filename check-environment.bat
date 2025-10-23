@echo off
chcp 65001 >nul
echo ==========================================
echo   環境診斷工具
echo ==========================================
echo.

echo [1/5] 檢查 Java 環境...
echo.
java -version 2>&1 | findstr "version"
if %errorlevel% neq 0 (
    echo ❌ 錯誤: 未找到 Java
    echo 請安裝 JDK 21 或更高版本
    echo 下載地址: https://www.oracle.com/java/technologies/downloads/
) else (
    echo ✅ Java 環境正常
)
echo.

echo [2/5] 檢查 Maven...
echo.
if exist "backend\mvnw.cmd" (
    echo ✅ Maven Wrapper 存在
) else (
    echo ❌ 錯誤: 找不到 Maven Wrapper
)
echo.

echo [3/5] 檢查 MySQL...
echo.
mysql --version 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  警告: MySQL 命令行工具未找到
    echo 請確保 MySQL 已安裝並添加到 PATH
) else (
    echo ✅ MySQL 已安裝
)
echo.

echo [4/5] 檢查端口佔用...
echo.
netstat -ano | findstr ":8080" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  警告: 端口 8080 已被佔用
    echo 請執行以下命令查看佔用進程:
    echo   netstat -ano ^| findstr :8080
    netstat -ano | findstr ":8080"
) else (
    echo ✅ 端口 8080 可用
)
echo.

echo [5/5] 檢查 Node.js 環境...
echo.
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 錯誤: 未找到 Node.js
    echo 請安裝 Node.js 18 或更高版本
    echo 下載地址: https://nodejs.org/
) else (
    node -v
    echo ✅ Node.js 環境正常
)
echo.

echo ==========================================
echo   診斷完成
echo ==========================================
echo.
echo 提示:
echo 1. 如果 MySQL 未啟動，請運行: net start MySQL80
echo 2. 如果端口被佔用，可以修改 application.properties 中的 server.port
echo 3. 詳細的問題排查請查看 TROUBLESHOOTING.md
echo.
pause

