# 個人信息管理系統 - 完整部署指南

## 目錄
- [系統需求](#系統需求)
- [初次部署](#初次部署)
- [開發環境運行](#開發環境運行)
- [生產環境部署](#生產環境部署)
- [常見問題](#常見問題)

---

## 系統需求

### 必需軟件

1. **Java 17+**
   - [下載 OpenJDK](https://adoptium.net/)
   - 驗證安裝：`java -version`

2. **Maven 3.6+**
   - [下載 Maven](https://maven.apache.org/download.cgi)
   - 驗證安裝：`mvn -version`

3. **MySQL 8.0+**
   - [下載 MySQL](https://dev.mysql.com/downloads/mysql/)
   - 驗證安裝：`mysql --version`

4. **Node.js 18+**
   - [下載 Node.js](https://nodejs.org/)
   - 驗證安裝：`node -v` 和 `npm -v`

### 推薦工具

- **Git**: 版本控制
- **MySQL Workbench**: 數據庫管理
- **Postman**: API 測試
- **VS Code 或 IntelliJ IDEA**: 代碼編輯器

---

## 初次部署

### 1. 克隆項目

```bash
git clone https://github.com/your-repo/personal-info-management.git
cd personal-info-management
```

### 2. 配置數據庫

#### 2.1 創建數據庫

```sql
CREATE DATABASE backwork CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 2.2 配置數據庫連接

編輯 `backend/src/main/resources/application.properties`：

```properties
# 數據庫配置
spring.datasource.url=jdbc:mysql://localhost:3306/backwork?useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password

# JPA 配置
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

**重要**：修改 `spring.datasource.password` 為您的 MySQL 密碼。

### 3. 安裝依賴

#### 3.1 後端依賴

```bash
cd backend
./mvnw clean install
```

#### 3.2 前端依賴

```bash
cd frontend
npm install
```

### 4. 初始化數據庫

首次運行時，Hibernate 會自動創建表結構：

```bash
cd backend
./mvnw spring-boot:run
```

等待後端啟動成功（看到 "Started InfoApplication"），然後按 `Ctrl+C` 停止。

### 5. 創建管理員帳號

有兩種方式創建管理員帳號：

#### 方式 1：通過註冊接口（推薦）

1. 啟動後端
2. 使用 Postman 或 curl 發送請求：

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "email": "admin@example.com"
  }'
```

3. 手動修改數據庫中的角色：

```sql
UPDATE users SET role = 'ADMIN' WHERE username = 'admin';
```

#### 方式 2：直接插入數據庫

```sql
-- 密碼為 admin123 的 BCrypt 加密後的值
INSERT INTO users (username, password, email, role, created_time, updated_time) 
VALUES ('admin', '$2a$10$N0.kR8xgK3Y8BH6K6yH.JOqVZd5TqBDfY0LQj4MtZJ0FZVJQxZ5Iu', 'admin@example.com', 'ADMIN', NOW(), NOW());
```

---

## 開發環境運行

### 使用啟動腳本（推薦）

#### Windows:
```bash
start-all.bat
```

#### Linux/macOS:
```bash
chmod +x start-all.sh
./start-all.sh
```

### 手動啟動

#### 啟動後端（終端 1）

```bash
cd backend
./mvnw spring-boot:run
```

後端將在 http://localhost:8080 運行

#### 啟動前端（終端 2）

```bash
cd frontend
npm run dev
```

前端將在 http://localhost:5173 運行

### 驗證部署

1. 訪問前端：http://localhost:5173
2. 測試後端健康檢查：http://localhost:8080/actuator/health （如果配置了 actuator）
3. 測試 API：http://localhost:8080/api/categories

---

## 生產環境部署

### 1. 構建項目

#### 1.1 構建後端

```bash
cd backend
./mvnw clean package -DskipTests
```

生成的 JAR 文件位於 `backend/target/PersonalInfoManagement-0.0.1-SNAPSHOT.jar`

#### 1.2 構建前端

```bash
cd frontend
npm run build
```

生成的靜態文件位於 `frontend/dist/`

### 2. 配置生產環境

#### 2.1 創建生產配置文件

創建 `backend/src/main/resources/application-prod.properties`：

```properties
# 數據庫配置（使用環境變量）
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/backwork}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD}

# 生產環境配置
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
server.port=${PORT:8080}

# 安全配置
jwt.secret=${JWT_SECRET:YourProductionSecretKeyShouldBeLongerAndMoreComplex}
jwt.expiration=86400000

# 日誌配置
logging.level.root=WARN
logging.level.com.example.info=INFO
```

#### 2.2 設置環境變量

```bash
export DB_URL="jdbc:mysql://your-db-host:3306/backwork"
export DB_USERNAME="your_db_user"
export DB_PASSWORD="your_db_password"
export JWT_SECRET="YourVeryLongAndSecureRandomSecretKey"
export PORT=8080
```

### 3. 部署後端

#### 3.1 使用 systemd（Linux）

創建 `/etc/systemd/system/personal-info-backend.service`：

```ini
[Unit]
Description=Personal Info Management Backend
After=mysql.service

[Service]
User=your-user
WorkingDirectory=/path/to/backend
ExecStart=/usr/bin/java -jar target/PersonalInfoManagement-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
Restart=always
Environment="DB_URL=jdbc:mysql://localhost:3306/backwork"
Environment="DB_USERNAME=root"
Environment="DB_PASSWORD=your_password"
Environment="JWT_SECRET=your_secret"

[Install]
WantedBy=multi-user.target
```

啟動服務：

```bash
sudo systemctl daemon-reload
sudo systemctl start personal-info-backend
sudo systemctl enable personal-info-backend
```

#### 3.2 使用 Docker（推薦）

創建 `backend/Dockerfile`：

```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/PersonalInfoManagement-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]
```

構建並運行：

```bash
cd backend
docker build -t personal-info-backend .
docker run -d \
  -p 8080:8080 \
  -e DB_URL="jdbc:mysql://host.docker.internal:3306/backwork" \
  -e DB_USERNAME="root" \
  -e DB_PASSWORD="your_password" \
  -e JWT_SECRET="your_secret" \
  --name personal-info-backend \
  personal-info-backend
```

### 4. 部署前端

#### 4.1 使用 Nginx

1. 安裝 Nginx：
```bash
sudo apt install nginx  # Ubuntu/Debian
# 或
sudo yum install nginx  # CentOS/RHEL
```

2. 配置 Nginx（`/etc/nginx/sites-available/personal-info`）：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/frontend/dist;
    index index.html;

    # 前端路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 靜態資源緩存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

3. 啟用配置：

```bash
sudo ln -s /etc/nginx/sites-available/personal-info /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4.2 使用 Docker

創建 `frontend/Dockerfile`：

```dockerfile
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

創建 `frontend/nginx.conf`：

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8080;
    }
}
```

構建並運行：

```bash
cd frontend
docker build -t personal-info-frontend .
docker run -d -p 80:80 --name personal-info-frontend personal-info-frontend
```

### 5. 使用 Docker Compose（推薦）

創建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: backwork
    volumes:
      - mysql-data:/var/lib/mysql
    ports:
      - "3306:3306"

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      DB_URL: jdbc:mysql://db:3306/backwork
      DB_USERNAME: root
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql-data:
```

啟動所有服務：

```bash
export DB_PASSWORD="your_password"
export JWT_SECRET="your_secret"
docker-compose up -d
```

---

## 常見問題

### 1. 後端啟動失敗

**錯誤**：`Communications link failure`

**解決**：
- 檢查 MySQL 是否運行
- 驗證數據庫連接信息
- 確認防火牆設置

### 2. 前端無法連接後端

**錯誤**：`Network Error` 或 `CORS error`

**解決**：
- 檢查後端是否運行
- 確認 `CorsConfig` 配置正確
- 檢查前端 API URL 配置

### 3. 數據庫架構錯誤

**錯誤**：`Unknown column` 或 `Table doesn't exist`

**解決**：參考 `DATABASE_RESET_GUIDE.md`

### 4. 端口被占用

**錯誤**：`Port 8080 is already in use`

**解決**：
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:8080 | xargs kill -9
```

### 5. JWT Token 無效

**錯誤**：`401 Unauthorized`

**解決**：
- 檢查 Token 是否過期
- 清除瀏覽器 localStorage
- 重新登錄

---

## 性能優化建議

### 後端優化

1. **數據庫連接池**：
```properties
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
```

2. **JPA 批量操作**：
```properties
spring.jpa.properties.hibernate.jdbc.batch_size=20
```

3. **緩存配置**：添加 Redis 緩存

### 前端優化

1. **代碼分割**：已通過 Vite 自動處理
2. **圖片優化**：使用 WebP 格式
3. **CDN 加速**：靜態資源使用 CDN

---

## 監控和維護

### 日誌管理

後端日誌位置：
- 開發環境：控制台輸出
- 生產環境：`/var/log/personal-info/` 或 Docker 容器日誌

查看 Docker 日誌：
```bash
docker logs -f personal-info-backend
```

### 數據備份

每日自動備份腳本：

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u root -p backwork > /backup/backwork_$DATE.sql
find /backup -name "backwork_*.sql" -mtime +7 -delete
```

### 更新部署

```bash
# 1. 備份數據庫
mysqldump -u root -p backwork > backup.sql

# 2. 拉取最新代碼
git pull origin main

# 3. 重新構建和部署
./deploy.sh
```

---

## 安全建議

1. **更改默認密碼**：生產環境使用強密碼
2. **啟用 HTTPS**：使用 Let's Encrypt 免費證書
3. **定期更新依賴**：`npm audit` 和 `mvn versions:display-dependency-updates`
4. **限制 API 訪問**：配置 API 速率限制
5. **定期備份**：自動化備份策略

---

## 支持和反饋

如有問題，請查看：
- `README.md`：項目概述
- `TROUBLESHOOTING.md`：故障排除指南
- `DATABASE_RESET_GUIDE.md`：數據庫問題解決

或提交 Issue 到項目倉庫。

