# 項目整合完成說明

## ✅ 已完成的工作

### 1. 項目結構重組

原始結構：
```
Software-System-Analysis-and-Design/
├── Info/          (後端項目)
└── FrontWork/     (前端項目)
```

新結構：
```
Software-System-Analysis-and-Design/
├── backend/       (後端項目 - 原 Info)
├── frontend/      (前端項目 - 原 FrontWork/React-Vite)
├── .gitignore     (統一的 Git 忽略配置)
├── README.md      (統一的項目說明文檔)
└── start-all.bat  (一鍵啟動腳本)
```

### 2. 更新的配置文件

#### 後端配置更新

**backend/pom.xml**
- `artifactId`: `Info` → `personal-info-backend`
- `name`: `Info` → `Personal Info Management System - Backend`
- `description`: `Info` → `個人信息管理系統後端服務`

**backend/src/main/resources/application.properties**
- `spring.application.name`: `Info` → `PersonalInfoManagement`

#### 前端配置更新

**frontend/package.json**
- `name`: `my-vite-react-app` → `personal-info-frontend`
- `version`: `0.0.0` → `1.0.0`

**frontend/index.html**
- `title`: `Smallv` → `個人信息管理系統`

### 3. Git 配置

創建了統一的 `.gitignore` 文件，包含：
- 後端 Maven 構建文件忽略
- 前端 Node.js 依賴和構建文件忽略
- IDE 配置文件忽略
- 操作系統相關文件忽略

### 4. 啟動腳本

創建了 `start-all.bat` 一鍵啟動腳本：
- 自動檢查 Java 和 Node.js 環境
- 自動啟動後端服務（8080端口）
- 自動啟動前端服務（5173端口）
- 自動安裝前端依賴（如果需要）

## 🚀 如何使用

### 方法一：使用一鍵啟動腳本（推薦）

```bash
# Windows
start-all.bat

# Linux/macOS
chmod +x start-all.sh
./start-all.sh
```

### 方法二：手動啟動

**啟動後端：**
```bash
cd backend
./mvnw spring-boot:run
```

**啟動前端：**
```bash
cd frontend
npm install  # 首次運行需要安裝依賴
npm run dev
```

## 📝 Git 使用建議

### 初始化 Git 倉庫（如果還沒有）

```bash
# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "feat: 重構項目結構，整合前後端為統一項目"
```

### 添加遠程倉庫

```bash
# 添加遠程倉庫
git remote add origin <你的倉庫地址>

# 推送到遠程倉庫
git push -u origin main
```

### 日常開發流程

```bash
# 查看當前狀態
git status

# 添加更改的文件
git add .

# 提交更改
git commit -m "feat: 添加新功能"

# 推送到遠程倉庫
git push
```

### 分支管理

```bash
# 創建並切換到新分支
git checkout -b feature/新功能名稱

# 查看所有分支
git branch -a

# 切換分支
git checkout 分支名

# 合併分支
git merge 分支名

# 刪除分支
git branch -d 分支名
```

## 🔧 常見問題

### Q: 後端啟動失敗，提示數據庫連接錯誤

**A:** 請確保：
1. MySQL 服務已啟動
2. 已創建 `backwork` 數據庫
3. `backend/src/main/resources/application.properties` 中的數據庫用戶名和密碼正確

```sql
CREATE DATABASE backwork CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Q: 前端啟動失敗，提示端口被佔用

**A:** 修改 `frontend/vite.config.ts`，更改端口號：
```typescript
export default defineConfig({
  server: {
    port: 5174  // 改為其他端口
  }
})
```

### Q: 前端無法訪問後端 API

**A:** 檢查：
1. 後端服務是否正常啟動（http://localhost:8080）
2. `frontend/src/api/utils/apiClient.ts` 中的 `BASE_URL` 是否正確
3. 後端 CORS 配置是否允許前端域名

### Q: Git 提交時包含了不該提交的文件

**A:** 
```bash
# 移除已追蹤的文件
git rm --cached 文件名

# 或移除整個目錄
git rm -r --cached 目錄名

# 確保 .gitignore 中有相應的規則
```

## 📦 項目部署

### 後端打包

```bash
cd backend
./mvnw clean package
```

生成的 JAR 文件位於 `backend/target/personal-info-backend-0.0.1-SNAPSHOT.jar`

### 前端打包

```bash
cd frontend
npm run build
```

生成的靜態文件位於 `frontend/dist/`

### 部署建議

1. **開發環境**: 使用 `start-all.bat` 腳本
2. **測試環境**: 使用 Docker Compose 部署
3. **生產環境**: 
   - 後端：部署 JAR 文件到服務器
   - 前端：將 dist 目錄部署到 Nginx
   - 數據庫：使用獨立的 MySQL 服務器

## 📚 相關文檔

- [README.md](README.md) - 項目總體說明
- [backend/HELP.md](backend/HELP.md) - Spring Boot 參考文檔
- [frontend/README.md](frontend/README.md) - 前端項目說明

## 🎉 完成！

項目整合完成，現在您有了一個統一的全棧項目結構，便於：
- ✅ 版本控制管理
- ✅ 團隊協作開發
- ✅ 項目部署
- ✅ 文檔維護

祝您開發順利！🚀

