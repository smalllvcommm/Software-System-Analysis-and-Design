#!/bin/bash

# 設置顏色輸出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "  個人信息管理系統 - 一鍵啟動"
echo "=========================================="
echo ""

# 檢查環境
echo "[1/3] 檢查環境..."
echo ""

# 檢查 Java
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ 錯誤: 未找到 Java，請安裝 JDK 21+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Java 環境正常${NC}"

# 檢查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 錯誤: 未找到 Node.js，請安裝 Node.js 18+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js 環境正常${NC}"

echo ""
echo "[2/3] 啟動後端服務..."
echo ""

# 啟動後端（後台運行）
cd backend
./mvnw spring-boot:run > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

echo -e "${GREEN}後端服務已啟動 (PID: $BACKEND_PID)${NC}"

# 等待後端啟動
echo "等待後端服務啟動..."
sleep 10

echo ""
echo "[3/3] 啟動前端服務..."
echo ""

# 檢查並安裝前端依賴
if [ ! -d "frontend/node_modules" ]; then
    echo "正在安裝前端依賴..."
    cd frontend
    npm install
    cd ..
fi

# 啟動前端（後台運行）
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo -e "${GREEN}前端服務已啟動 (PID: $FRONTEND_PID)${NC}"

echo ""
echo "=========================================="
echo "  啟動完成！"
echo "=========================================="
echo ""
echo -e "後端地址: ${YELLOW}http://localhost:8080${NC}"
echo -e "前端地址: ${YELLOW}http://localhost:5173${NC}"
echo ""
echo "後端日誌: backend.log"
echo "前端日誌: frontend.log"
echo ""
echo "停止服務："
echo "  後端: kill $BACKEND_PID"
echo "  前端: kill $FRONTEND_PID"
echo ""

# 保存 PID 到文件
echo $BACKEND_PID > backend.pid
echo $FRONTEND_PID > frontend.pid

echo "進程 ID 已保存到 backend.pid 和 frontend.pid"
echo ""

