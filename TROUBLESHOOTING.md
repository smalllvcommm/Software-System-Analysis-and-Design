# 🔧 後端啟動問題排查指南

## 常見問題和解決方案

### 問題 1: 數據庫連接失敗 ❌

#### 錯誤信息示例
```
Communications link failure
Cannot create PoolableConnectionFactory
Access denied for user 'root'@'localhost'
```

#### 解決方案

**步驟 1: 檢查 MySQL 是否已啟動**

```bash
# Windows
# 1. 打開服務管理器 (services.msc)
# 2. 查找 MySQL 服務
# 3. 確保狀態為"正在運行"

# 或使用命令行
net start MySQL80
```

**步驟 2: 創建數據庫**

```sql
-- 登錄 MySQL
mysql -u root -p

-- 創建數據庫
CREATE DATABASE backwork CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 查看數據庫
SHOW DATABASES;

-- 退出
EXIT;
```

**步驟 3: 檢查數據庫配置**

編輯 `backend/src/main/resources/application.properties`:

```properties
# 數據庫連接 URL
spring.datasource.url=jdbc:mysql://localhost:3306/backwork?useSSL=false&serverTimezone=UTC

# 數據庫用戶名
spring.datasource.username=root

# 數據庫密碼（修改為您的實際密碼）
spring.datasource.password=您的MySQL密碼
```

**步驟 4: 測試數據庫連接**

```bash
# 使用命令行測試
mysql -u root -p -h localhost -P 3306

# 輸入密碼後，如果能登錄說明配置正確
```

---

### 問題 2: 端口被佔用 ❌

#### 錯誤信息示例
```
Port 8080 was already in use
Web server failed to start. Port 8080 was already in use.
```

#### 解決方案

**選項 A: 結束佔用端口的進程**

```bash
# Windows
# 查找佔用 8080 端口的進程
netstat -ano | findstr :8080

# 結束進程（PID 是上一步查到的進程ID）
taskkill /PID <進程ID> /F
```

**選項 B: 更改後端端口**

編輯 `backend/src/main/resources/application.properties`，添加：

```properties
# 修改為其他端口
server.port=8081
```

⚠️ **注意**: 如果修改了後端端口，也需要修改前端的 API 地址！

編輯 `frontend/src/api/utils/apiClient.ts`:

```typescript
const BASE_URL = 'http://localhost:8081/api';  // 改為新端口
```

---

### 問題 3: Java 版本不兼容 ❌

#### 錯誤信息示例
```
Unsupported class file major version
invalid target release: 21
```

#### 解決方案

**檢查 Java 版本**

```bash
java -version
```

要求: **JDK 21 或更高版本**

**如果版本過低**:
1. 下載並安裝 [JDK 21](https://www.oracle.com/java/technologies/downloads/#java21)
2. 設置 JAVA_HOME 環境變量
3. 重啟命令行

**如果有多個 Java 版本**:
```bash
# Windows - 設置環境變量
setx JAVA_HOME "C:\Program Files\Java\jdk-21"
```

---

### 問題 4: Maven 構建失敗 ❌

#### 錯誤信息示例
```
Failed to execute goal
Could not resolve dependencies
```

#### 解決方案

**清理並重新構建**

```bash
cd backend

# 清理舊的構建
./mvnw clean

# 重新編譯
./mvnw compile

# 運行
./mvnw spring-boot:run
```

**如果下載依賴很慢**，配置國內鏡像：

創建或編輯 `backend/.mvn/wrapper/maven-wrapper.properties`:

```properties
distributionUrl=https://maven.aliyun.com/repository/public
```

---

### 問題 5: 實體類找不到 ❌

#### 錯誤信息示例
```
Cannot find class: Article
Table 'backwork.articles' doesn't exist
```

#### 解決方案

這是因為數據庫表還沒有創建。檢查配置：

```properties
# 確保設置為 create 或 update
spring.jpa.hibernate.ddl-auto=create

# 第一次運行後，建議改為 update
# spring.jpa.hibernate.ddl-auto=update
```

**重要提示**:
- `create`: 每次啟動都會刪除並重新創建表（⚠️ 會丟失數據）
- `update`: 只更新表結構，不刪除數據（推薦）
- `validate`: 只驗證表結構
- `none`: 不做任何操作

---

### 問題 6: CORS 跨域問題 ❌

#### 錯誤信息（瀏覽器控制台）
```
Access to XMLHttpRequest has been blocked by CORS policy
```

#### 解決方案

檢查 `backend/src/main/java/com/example/info/config/CorsConfig.java`:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")  // 前端地址
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .maxAge(3600);
    }
}
```

---

## 🔍 完整的診斷流程

### 步驟 1: 檢查環境

```bash
# 檢查 Java 版本
java -version
# 應該顯示: openjdk version "21" 或更高

# 檢查 MySQL
mysql --version
# 應該顯示: mysql Ver 8.0.x

# 檢查 Node.js
node -v
# 應該顯示: v18.x.x 或更高
```

### 步驟 2: 檢查數據庫

```bash
# 登錄 MySQL
mysql -u root -p

# 檢查數據庫是否存在
SHOW DATABASES;

# 如果沒有，創建數據庫
CREATE DATABASE backwork CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 步驟 3: 檢查配置文件

確認 `backend/src/main/resources/application.properties` 中的：
- 數據庫 URL
- 用戶名
- 密碼

### 步驟 4: 啟動後端

```bash
cd backend

# 方法 1: 使用 Maven Wrapper
./mvnw spring-boot:run

# 方法 2: 使用 Maven
mvn spring-boot:run

# 方法 3: 先打包再運行
./mvnw clean package
java -jar target/personal-info-backend-0.0.1-SNAPSHOT.jar
```

### 步驟 5: 驗證後端是否啟動成功

**查看日誌**，應該看到類似信息：
```
Started InfoApplication in x.xxx seconds
Tomcat started on port(s): 8080 (http)
```

**測試 API**:
```bash
# 在瀏覽器或命令行訪問
curl http://localhost:8080/api/admin/articles

# 或在瀏覽器打開
http://localhost:8080
```

---

## 📝 啟動檢查清單

- [ ] Java 21 已安裝
- [ ] MySQL 8.x 已安裝並運行
- [ ] 已創建 `backwork` 數據庫
- [ ] `application.properties` 配置正確
- [ ] 端口 8080 未被佔用
- [ ] Maven 依賴下載完成
- [ ] 後端成功啟動（看到啟動日誌）
- [ ] 可以訪問 `http://localhost:8080`

---

## 🆘 仍然有問題？

### 查看完整日誌

啟動時添加詳細日誌：

```bash
cd backend
./mvnw spring-boot:run -X
```

### 常用日誌關鍵詞

- `ERROR`: 錯誤信息
- `Exception`: 異常
- `Cannot`: 無法執行某操作
- `Failed`: 失敗信息
- `Port`: 端口相關

### 檢查特定錯誤

**數據庫連接**:
```
grep -i "database\|connection\|mysql" logs.txt
```

**端口問題**:
```
grep -i "port\|address already in use" logs.txt
```

---

## 💡 快速測試方案

創建一個最小化的測試配置 `application-test.properties`:

```properties
spring.application.name=PersonalInfoManagement

# 使用 H2 內存數據庫（無需 MySQL）
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.h2.console.enabled=true

# JPA 配置
spring.jpa.hibernate.ddl-auto=create
spring.jpa.show-sql=true

# 使用不同端口
server.port=8081
```

使用測試配置啟動：
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=test
```

---

## 📞 獲取幫助

如果以上方法都不能解決問題，請提供以下信息：

1. **錯誤日誌**: 完整的錯誤信息
2. **環境信息**: Java 版本、MySQL 版本、操作系統
3. **配置文件**: application.properties 內容（隱藏密碼）
4. **啟動命令**: 您使用的啟動命令

---

**祝您順利啟動！** 🚀

