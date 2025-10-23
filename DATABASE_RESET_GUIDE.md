# 數據庫重置指南

## 問題說明

當您看到以下錯誤時：
```
Unknown column 'a1_0.category_id' in 'field list'
```

這表示數據庫架構（schema）與當前的實體類定義不匹配。

## 解決方案

### 方法 1：刪除並重建數據庫（推薦，最乾淨）

1. 打開 MySQL 客戶端（MySQL Workbench 或命令行）

2. 執行以下 SQL 命令：

```sql
-- 刪除舊數據庫
DROP DATABASE IF EXISTS backwork;

-- 重新創建數據庫
CREATE DATABASE backwork CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 查看數據庫
SHOW DATABASES;
```

3. 重啟後端應用程序

```bash
cd backend
./mvnw spring-boot:run
```

Hibernate 會自動創建所有表和正確的列。

### 方法 2：僅刪除有問題的表

如果您想保留部分數據，可以只刪除有問題的表：

```sql
USE backwork;

-- 刪除所有表（會自動處理外鍵約束）
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS article_tag;
DROP TABLE IF EXISTS memo_tag;
DROP TABLE IF EXISTS study_check_in_tag;
DROP TABLE IF EXISTS audio_tag;
DROP TABLE IF EXISTS website_tag;
DROP TABLE IF EXISTS expense_tag;
DROP TABLE IF EXISTS travel_plan_tag;
DROP TABLE IF EXISTS video_tag;

DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS memos;
DROP TABLE IF EXISTS study_check_ins;
DROP TABLE IF EXISTS audios;
DROP TABLE IF EXISTS websites;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS travel_plans;
DROP TABLE IF EXISTS videos;

DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;
```

然後重啟後端應用。

### 方法 3：更改 Hibernate DDL 策略（僅用於開發）

如果您經常修改實體類，可以臨時使用 `create` 策略：

1. 編輯 `backend/src/main/resources/application.properties`

```properties
# 改為 create（每次啟動都會重建表，會丟失所有數據）
spring.jpa.hibernate.ddl-auto=create

# 或改為 create-drop（啟動時創建，關閉時刪除）
# spring.jpa.hibernate.ddl-auto=create-drop
```

2. 重啟應用

3. **重要**：開發完成後，改回 `update`：

```properties
spring.jpa.hibernate.ddl-auto=update
```

## 驗證修復

重啟後端後，檢查日志，應該看到：

```
Hibernate: create table articles (...)
Hibernate: create table categories (...)
...
```

並且不再有 SQL 錯誤。

## 數據遷移建議

如果您有重要的數據需要保留：

1. 在刪除數據庫前，導出數據：

```bash
mysqldump -u root -p backwork > backwork_backup.sql
```

2. 重建數據庫後，手動編輯 SQL 文件以匹配新架構

3. 導入修改後的數據：

```bash
mysql -u root -p backwork < backwork_modified.sql
```

## 預防措施

1. **開發環境**：使用 `update` 策略，但在重大架構變更時手動重置數據庫

2. **生產環境**：使用 `validate` 策略，並通過數據庫遷移工具（如 Flyway 或 Liquibase）管理架構變更

3. **定期備份**：養成定期備份數據庫的習慣

