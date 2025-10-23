# 快速參考卡片

## 🚀 快速啟動（5 分鐘）

```bash
# 1. 創建數據庫
mysql -u root -p
CREATE DATABASE backwork CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# 2. 配置密碼（backend/src/main/resources/application.properties）
spring.datasource.password=YOUR_PASSWORD

# 3. 啟動（Windows）
start-all.bat

# 3. 啟動（Linux/macOS）
chmod +x start-all.sh
./start-all.sh
```

## 📍 訪問地址

| 服務 | 地址 |
|------|------|
| 前端 | http://localhost:5173 |
| 後端 | http://localhost:8080 |
| 註冊頁 | http://localhost:5173/register |
| 登錄頁 | http://localhost:5173/login |
| 管理後台 | http://localhost:5173/admin |

## 🔐 首次使用

```bash
# 1. 註冊帳號（瀏覽器）
http://localhost:5173/register
用戶名：admin
密碼：admin123

# 2. 升級為管理員（MySQL）
mysql -u root -p
USE backwork;
UPDATE users SET role = 'ADMIN' WHERE username = 'admin';
EXIT;

# 3. 重新登錄即可訪問管理後台
```

## 🗂️ 項目結構

```
Software-System-Analysis-and-Design/
├── backend/                 # Spring Boot 後端
│   ├── src/main/java/      # Java 源代碼
│   │   └── com/example/info/
│   │       ├── controller/ # 控制器層
│   │       ├── service/    # 服務層
│   │       ├── repository/ # 數據訪問層
│   │       ├── entity/     # 實體類
│   │       ├── dto/        # 數據傳輸對象
│   │       ├── config/     # 配置類
│   │       ├── util/       # 工具類
│   │       └── exception/  # 異常處理
│   └── src/main/resources/
│       └── application.properties  # 配置文件
│
├── frontend/               # React 前端
│   ├── src/
│   │   ├── api/           # API 服務
│   │   ├── components/    # 可復用組件
│   │   ├── configs/       # 配置文件
│   │   ├── hooks/         # 自定義 Hooks
│   │   ├── layouts/       # 布局組件
│   │   ├── pages/         # 頁面組件
│   │   ├── router/        # 路由配置
│   │   ├── services/      # 業務服務
│   │   ├── styles/        # 樣式文件
│   │   └── types/         # TypeScript 類型
│   └── package.json       # 依賴配置
│
├── start-all.bat          # Windows 啟動腳本
├── start-all.sh           # Linux/macOS 啟動腳本
└── [文檔文件].md          # 各種文檔
```

## 📊 數據模型

### 核心實體

| 實體 | 說明 | 關聯 |
|------|------|------|
| `User` | 用戶 | - |
| `Category` | 分類 | 一對多 → 所有實體 |
| `Tag` | 標籤 | 多對多 ↔ 所有實體 |

### 內容實體（都繼承自 Info）

| 實體 | 說明 | 特殊字段 |
|------|------|----------|
| `Article` | 文章 | status, visibility, views |
| `Memo` | 備忘錄 | - |
| `StudyCheckIn` | 學習打卡 | hours, date |
| `Audio` | 音頻 | audioUrl, duration |
| `Website` | 網站收藏 | url |
| `Expense` | 支出記錄 | amount, date |
| `TravelPlan` | 旅行計劃 | destination, startDate, endDate, budget |
| `Video` | 視頻 | videoUrl, duration |

### Info 基類

所有內容實體的公共字段：
- `id`: 主鍵
- `title`: 標題
- `content`: 內容
- `createdTime`: 創建時間
- `updatedTime`: 更新時間
- `category`: 分類（ManyToOne）
- `tags`: 標籤列表（ManyToMany）

## 🔌 API 端點速查

### 認證 API

```http
# 註冊
POST /api/auth/register
Content-Type: application/json
{
  "username": "admin",
  "password": "admin123",
  "email": "admin@example.com"
}

# 登錄
POST /api/auth/login
Content-Type: application/json
{
  "username": "admin",
  "password": "admin123"
}

# 響應
{
  "success": true,
  "code": 200,
  "message": "登錄成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
    "username": "admin",
    "role": "ADMIN"
  }
}
```

### CRUD API 模板

```http
# 獲取列表
GET /api/{entity}?page=0&size=10

# 獲取詳情
GET /api/{entity}/{id}

# 創建
POST /api/{entity}
Authorization: Bearer {token}
Content-Type: application/json
{
  "title": "標題",
  "content": "內容",
  ...
}

# 更新
PUT /api/{entity}/{id}
Authorization: Bearer {token}
Content-Type: application/json
{
  "title": "新標題",
  ...
}

# 刪除
DELETE /api/{entity}/{id}
Authorization: Bearer {token}
```

### 實體端點列表

| 實體 | 端點 |
|------|------|
| 分類 | `/api/categories` |
| 標籤 | `/api/tags` |
| 文章 | `/api/articles` |
| 備忘錄 | `/api/memos` |
| 學習打卡 | `/api/study-check-ins` |
| 音頻 | `/api/audios` |
| 網站 | `/api/websites` |
| 支出 | `/api/expenses` |
| 旅行計劃 | `/api/travel-plans` |
| 視頻 | `/api/videos` |

## 🛠️ 常用命令

### 後端（Maven）

```bash
# 清理並安裝
cd backend
./mvnw clean install

# 運行應用
./mvnw spring-boot:run

# 跳過測試運行
./mvnw spring-boot:run -DskipTests

# 打包
./mvnw package

# 運行打包後的 JAR
java -jar target/PersonalInfoManagement-0.0.1-SNAPSHOT.jar
```

### 前端（npm）

```bash
# 安裝依賴
cd frontend
npm install

# 開發模式運行
npm run dev

# 構建生產版本
npm run build

# 預覽生產構建
npm run preview

# 類型檢查
npm run type-check
```

### 數據庫（MySQL）

```bash
# 連接
mysql -u root -p

# 創建數據庫
CREATE DATABASE backwork CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 查看數據庫
SHOW DATABASES;

# 使用數據庫
USE backwork;

# 查看表
SHOW TABLES;

# 查看用戶
SELECT * FROM users;

# 升級用戶為管理員
UPDATE users SET role = 'ADMIN' WHERE username = 'admin';

# 備份數據庫
mysqldump -u root -p backwork > backup.sql

# 恢復數據庫
mysql -u root -p backwork < backup.sql

# 刪除數據庫（危險！）
DROP DATABASE backwork;
```

## 🔍 故障排查速查

### 後端問題

| 問題 | 檢查 | 解決 |
|------|------|------|
| 啟動失敗 | MySQL 連接 | 檢查 `application.properties` |
| 端口被占用 | 8080 端口 | 找到並終止進程 |
| 數據庫錯誤 | 表結構 | 重置數據庫（見 DATABASE_RESET_GUIDE.md） |
| JAVA_HOME 錯誤 | Java 環境 | 設置環境變量 |

### 前端問題

| 問題 | 檢查 | 解決 |
|------|------|------|
| 無法連接後端 | CORS 配置 | 檢查 `CorsConfig.java` |
| 登錄失敗 | Token 保存 | 清除 localStorage |
| 401 錯誤 | Token 過期 | 重新登錄 |
| 依賴錯誤 | node_modules | 刪除後重新 `npm install` |

## 📚 文檔速查

| 文檔 | 內容 |
|------|------|
| `README.md` | 項目概述 |
| `QUICK_START.md` | 5 分鐘快速開始 |
| `DEPLOYMENT_GUIDE.md` | 完整部署指南 |
| `DATABASE_RESET_GUIDE.md` | 數據庫重置 |
| `TROUBLESHOOTING.md` | 故障排除 |
| `FRONTEND_UPDATE_SUMMARY.md` | 前端更新詳情 |
| `IMPLEMENTATION_COMPLETE.md` | 實現完成總結 |
| `QUICK_REFERENCE.md` | 本文檔 |

## ⚙️ 配置速查

### 後端配置（application.properties）

```properties
# 應用名稱
spring.application.name=PersonalInfoManagement

# 數據庫配置
spring.datasource.url=jdbc:mysql://localhost:3306/backwork
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

# JPA 配置
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# 服務器端口
server.port=8080
```

### 前端配置

```typescript
// frontend/src/api/utils/apiClient.ts
export const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 5000
});
```

## 🎯 開發工作流

```
1. 創建分支
   ↓
2. 開發功能
   ├─ 後端：Entity → Repository → Service → Controller
   └─ 前端：Type → API → Component → Page
   ↓
3. 本地測試
   ├─ 後端：單元測試
   └─ 前端：手動測試
   ↓
4. 提交代碼
   ↓
5. 合併到主分支
   ↓
6. 部署
```

## 📞 獲取幫助

1. 查看文檔（優先）
2. 檢查錯誤日誌
3. 搜索相關問題
4. 提交 Issue

---

**提示**：將此文檔保存為書籤，方便隨時查閱！

