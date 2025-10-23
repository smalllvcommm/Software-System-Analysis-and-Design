@echo off
chcp 65001 >nul
echo ======================================
echo   启动前端服务
echo ======================================
echo.

cd frontend

echo [1/3] 检查 Node.js 环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未检测到 Node.js！
    echo 请先安装 Node.js 18 或更高版本
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js 环境正常

echo.
echo [2/3] 安装/更新依赖...
echo 这可能需要几分钟...
call npm install
if errorlevel 1 (
    echo ❌ 依赖安装失败！
    echo 请检查网络连接或尝试使用淘宝镜像：
    echo npm config set registry https://registry.npmmirror.com
    pause
    exit /b 1
)
echo ✓ 依赖安装完成

echo.
echo [3/3] 启动 Vite 开发服务器...
echo.
echo 前端将运行在: http://localhost:5173
echo 按 Ctrl+C 可停止前端服务
echo.
echo ======================================
echo.

call npm run dev

if errorlevel 1 (
    echo.
    echo ======================================
    echo ❌ 前端启动失败！
    echo ======================================
    echo.
    echo 可能的原因：
    echo 1. 端口 5173 已被占用
    echo 2. 依赖安装不完整
    echo 3. package.json 配置错误
    echo.
    echo 请检查上方的错误信息
    echo ======================================
    pause
    exit /b 1
)

