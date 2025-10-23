# 快速開始指南

> 5 分鐘快速啟動個人信息管理系統

## 前提條件

確保已安裝：
- ✅ Java 17+
- ✅ Maven 3.6+
- ✅ MySQL 8.0+
- ✅ Node.js 18+

快速檢查：
```bash
java -version && mvn -version && mysql --version && node -v
```

## 三步啟動

### 步驟 1：創建數據庫

```bash
# 登錄 MySQL
mysql -u root -p

# 創建數據庫
CREATE DATABASE backwork CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 步驟 2：配置數據庫密碼

編輯 `backend/src/main/resources/application.properties`：

```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 步驟 3：啟動項目

#### Windows：
```bash
start-all.bat
```

#### Linux/macOS：
```bash
chmod +x start-all.sh
./start-all.sh
```

## 訪問系統

- **前端**: http://localhost:5173
- **後端 API**: http://localhost:8080/api

## 初次登錄

系統需要先註冊帳號：

1. 訪問 http://localhost:5173/register
2. 填寫註冊信息：
   - 用戶名：`admin`
   - 密碼：`admin123`
   - 郵箱（可選）：`admin@example.com`
3. 註冊成功後自動跳轉到管理後台

## 升級為管理員

新註冊的用戶默認是普通用戶（USER），需要手動升級為管理員：

```sql
mysql -u root -p
USE backwork;
UPDATE users SET role = 'ADMIN' WHERE username = 'admin';
EXIT;
```

然後重新登錄即可。

## 常見問題

### Q: 後端啟動失敗？

**A**: 檢查以下項：
1. MySQL 是否運行？
2. 數據庫密碼是否正確？
3. 端口 8080 是否被占用？

詳見 `TROUBLESHOOTING.md`

### Q: 前端無法連接後端？

**A**: 確保：
1. 後端已成功啟動（看到 "Started InfoApplication" 日誌）
2. 訪問 http://localhost:8080/api/categories 測試 API

### Q: 數據庫表沒有創建？

**A**: 首次啟動時 Hibernate 會自動創建表。如果沒有創建，檢查：
1. `spring.jpa.hibernate.ddl-auto=update` 配置是否正確
2. 查看後端啟動日誌，是否有錯誤

### Q: 登錄後提示 401 錯誤？

**A**: 
1. 清除瀏覽器 localStorage
2. 重新登錄

## 下一步

✅ 已啟動系統後，可以：

1. **創建分類**：後台 > 分類管理
2. **創建標籤**：後台 > 標籤管理  
3. **發布文章**：後台 > 文章管理
4. **查看其他實體**：備忘錄、學習打卡、音頻等

## 詳細文檔

- 📖 [README.md](README.md) - 項目概述
- 🚀 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - 完整部署指南
- 🔧 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - 故障排除
- 💾 [DATABASE_RESET_GUIDE.md](DATABASE_RESET_GUIDE.md) - 數據庫重置

## 技術棧

**後端**：Spring Boot 3 + Spring Data JPA + MySQL + Spring Security + JWT

**前端**：React 18 + TypeScript + Vite + React Router + Axios

## 項目結構

```
Software-System-Analysis-and-Design/
├── backend/              # Spring Boot 後端
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/    # Java 源代碼
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
├── frontend/            # React 前端
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── package.json
└── start-all.bat/sh    # 啟動腳本
```

## 獲取幫助

遇到問題？
1. 查閱文檔：`TROUBLESHOOTING.md`
2. 查看日誌：後端控制台輸出
3. 提交 Issue

---

**祝您使用愉快！** 🎉

