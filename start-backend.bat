@echo off
chcp 65001 >nul
echo ======================================
echo   启动后端服务
echo ======================================
echo.

cd backend

echo [1/3] 检查 Java 环境...
java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未检测到 Java！
    echo 请先安装 JDK 17 或更高版本
    echo 下载地址: https://www.oracle.com/java/technologies/downloads/
    pause
    exit /b 1
)
echo ✓ Java 环境正常

echo.
echo [2/3] 清理旧的构建文件...
if exist target rmdir /s /q target >nul 2>&1
echo ✓ 清理完成

echo.
echo [3/3] 启动 Spring Boot 后端...
echo.
echo 后端将运行在: http://localhost:8080
echo 按 Ctrl+C 可停止后端服务
echo.
echo ======================================
echo.

mvnw.cmd spring-boot:run

if errorlevel 1 (
    echo.
    echo ======================================
    echo ❌ 后端启动失败！
    echo ======================================
    echo.
    echo 可能的原因：
    echo 1. MySQL 数据库未运行
    echo 2. 端口 8080 已被占用
    echo 3. 数据库配置不正确
    echo.
    echo 请检查上方的错误信息
    echo 或查看 TROUBLESHOOTING.md 获取帮助
    echo ======================================
    pause
    exit /b 1
)

