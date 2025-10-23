# 個人信息管理系統

> 一個基於 Spring Boot + React 的全棧個人信息管理系統

## 📋 項目簡介

這是一個功能完整的個人信息管理系統，採用前後端分離架構開發。系統支持多種類型的信息管理，包括文章、備忘錄、學習打卡、音頻、視頻、網站收藏、支出記錄、旅行計劃等。

### 主要功能

- 📝 **文章管理**：支持文章的創建、編輯、發布、分類和標籤管理
- 📌 **備忘錄**：快速記錄日常備忘事項
- 📚 **學習打卡**：記錄學習進度和打卡記錄
- 🎵 **多媒體管理**：管理音頻和視頻資源
- 🔖 **網站收藏**：收藏和分類常用網站
- 💰 **支出記錄**：記錄和統計個人支出
- ✈️ **旅行計劃**：規劃和管理旅行安排
- 🏷️ **統一分類和標籤系統**：所有信息都支持分類和標籤

## 🏗️ 技術架構

### 後端技術棧

- **框架**: Spring Boot 3.5.6
- **語言**: Java 21
- **數據庫**: MySQL 8.x
- **ORM**: Spring Data JPA + Hibernate
- **構建工具**: Maven
- **工具類**: Lombok

### 前端技術棧

- **框架**: React 19.1.1
- **語言**: TypeScript 5.8.3
- **構建工具**: Vite 7.0.4
- **路由**: React Router DOM 7.7.0
- **HTTP 客戶端**: Axios 1.11.0
- **圖表**: Chart.js + React-ChartJS-2
- **編輯器**: CKEditor5, CodeMirror, MD Editor
- **UI 組件**: FontAwesome

## 📂 項目結構

```
Software-System-Analysis-and-Design/
├── backend/                 # 後端 Spring Boot 項目
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/example/info/
│   │   │   │       ├── common/        # 通用組件
│   │   │   │       ├── config/        # 配置類
│   │   │   │       ├── controller/    # 控制器層
│   │   │   │       ├── entity/        # 實體類
│   │   │   │       ├── repository/    # 數據訪問層
│   │   │   │       ├── service/       # 業務邏輯層
│   │   │   │       └── InfoApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/              # 測試代碼
│   ├── pom.xml               # Maven 配置
│   └── mvnw                  # Maven Wrapper
│
├── frontend/                # 前端 React 項目
│   ├── src/
│   │   ├── api/            # API 服務層
│   │   ├── assets/         # 靜態資源
│   │   ├── components/     # 通用組件
│   │   ├── configs/        # 配置文件
│   │   ├── hooks/          # 自定義 Hooks
│   │   ├── layouts/        # 布局組件
│   │   ├── pages/          # 頁面組件
│   │   ├── router/         # 路由配置
│   │   ├── types/          # TypeScript 類型定義
│   │   └── main.tsx        # 入口文件
│   ├── package.json        # npm 配置
│   └── vite.config.ts      # Vite 配置
│
├── .gitignore              # Git 忽略配置
└── README.md               # 項目說明文檔
```

## 🚀 快速開始

### 環境要求

- **Java**: JDK 21 或更高版本
- **Node.js**: 18.x 或更高版本
- **MySQL**: 8.0 或更高版本
- **Maven**: 3.6+ (可選，使用 mvnw)

### 後端啟動

1. **創建數據庫**
   ```sql
   CREATE DATABASE backwork CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **配置數據庫連接**
   
   編輯 `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/backwork?useSSL=false&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=你的密碼
   ```

3. **啟動後端服務**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   
   或使用 Maven:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

   後端服務將在 `http://localhost:8080` 啟動

### 前端啟動

1. **安裝依賴**
   ```bash
   cd frontend
   npm install
   ```

2. **啟動開發服務器**
   ```bash
   npm run dev
   ```

   前端應用將在 `http://localhost:5173` 啟動

3. **構建生產版本**
   ```bash
   npm run build
   ```

## 📡 API 接口

### 統一響應格式

```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

### 主要接口

| 模塊 | 接口路徑 | 說明 |
|------|---------|------|
| 文章管理 | `/api/admin/articles` | CRUD 操作 |
| 分類管理 | `/api/admin/categories` | CRUD 操作 |
| 標籤管理 | `/api/admin/tags` | CRUD 操作 |
| 備忘錄 | `/api/admin/memos` | CRUD 操作 |
| 學習打卡 | `/api/admin/study-checkins` | CRUD 操作 |
| 音頻管理 | `/api/admin/audios` | CRUD 操作 |
| 視頻管理 | `/api/admin/videos` | CRUD 操作 |
| 網站管理 | `/api/admin/websites` | CRUD 操作 |
| 支出記錄 | `/api/admin/expenses` | CRUD 操作 |
| 旅行計劃 | `/api/admin/travel-plans` | CRUD 操作 |

## 🗄️ 數據庫設計

### 核心實體

- **Info**: 抽象基類（id, title, content, createdTime, updatedTime）
- **Category**: 分類表（統一分類系統）
- **Tag**: 標籤表（公共標籤系統）
- **Article**: 文章表
- **Memo**: 備忘錄表
- **StudyCheckIn**: 學習打卡表
- **Audio**: 音頻表
- **Video**: 視頻表
- **Website**: 網站表
- **Expense**: 支出表
- **TravelPlan**: 旅行計劃表

### 關聯關係

- 所有實體都與 Category 是 **多對一** 關係
- 所有實體都與 Tag 是 **多對多** 關係

## 🎨 功能特色

### 統一的分類系統

所有類型的信息都可以使用統一的分類系統進行組織管理，便於信息的歸類和查找。

### 公共標籤系統

支持為所有信息添加標籤，實現跨類型的信息關聯和快速檢索。

### 配置化前端設計

前端採用高度配置化的設計，通過配置文件即可快速擴展新的實體管理功能。

### 響應式佈局

支持桌面端和移動端訪問，自適應不同屏幕尺寸。

## 🔧 開發指南

### 添加新實體

1. **後端**:
   - 在 `entity` 包中創建實體類（繼承 Info）
   - 在 `repository` 包中創建 Repository 接口
   - 在 `service` 包中創建 Service 類
   - 在 `controller` 包中創建 Controller 類

2. **前端**:
   - 在 `types/index.ts` 中添加類型定義
   - 在 `api/index.ts` 中添加 API 服務
   - 在 `configs/listConfigs.ts` 中添加列表配置
   - 在 `configs/modalConfigs.ts` 中添加表單配置

## 📝 Git 使用建議

### 初始化 Git 倉庫

```bash
# 初始化 Git（如果還沒有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "feat: 重構項目結構，整合前後端"
```

### 分支管理建議

```bash
# 主分支
main/master         # 生產環境代碼

# 開發分支
develop            # 開發環境代碼

# 功能分支
feature/xxx        # 新功能開發

# 修復分支
fix/xxx           # Bug 修復

# 發布分支
release/x.x.x     # 版本發布
```

### 提交規範

```bash
feat: 新功能
fix: 修復 bug
docs: 文檔更新
style: 代碼格式調整
refactor: 重構代碼
test: 測試相關
chore: 構建過程或輔助工具的變動
```

## 🤝 貢獻指南

1. Fork 本項目
2. 創建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 許可證

本項目採用 MIT 許可證

## 👨‍💻 開發者

軟件系統分析與設計課程項目

## 📮 聯繫方式

如有問題或建議，請提交 Issue

---

**祝您使用愉快！** 🎉
