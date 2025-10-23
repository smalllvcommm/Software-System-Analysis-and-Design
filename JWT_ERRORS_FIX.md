# 🔧 JWT 编译错误修复指南

## 问题描述
IntelliJ IDEA 中 `JwtUtil.java` 文件显示多个编译错误：
- `io.jsonwebtoken` 包找不到
- `SignatureAlgorithm` 已过时
- `JwtBuilder`、`ClaimsMutator` 等类的方法找不到

## 根本原因
JWT 依赖虽然在 `pom.xml` 中已配置，但可能：
1. Maven 依赖还未下载
2. IntelliJ IDEA 缓存问题
3. 项目索引未更新

## 解决方案

### 方法 1：刷新 Maven 依赖（推荐）⭐

#### 在 IntelliJ IDEA 中：

1. **打开 Maven 面板**
   - 点击右侧的 **Maven** 标签
   - 或按 `Ctrl + Shift + A`，输入 "Maven"，选择 "Maven"

2. **刷新依赖**
   - 点击 Maven 面板左上角的 **🔄 Reload All Maven Projects** 按钮
   - 或右键点击项目名，选择 **Reload project**

3. **等待下载完成**
   - 等待 IDEA 底部状态栏显示下载完成
   - 依赖会从 Maven 中央仓库下载

4. **重新编译**
   - **Build** → **Rebuild Project**
   - 或按 `Ctrl + Shift + F9`

### 方法 2：使用命令行刷新

```bash
cd backend

# Windows (使用 mvnw.cmd)
mvnw.cmd clean install

# Linux/Mac (使用 mvnw)
./mvnw clean install
```

这会：
- 下载所有缺失的依赖
- 编译整个项目
- 安装到本地 Maven 仓库

### 方法 3：清除 IDEA 缓存

如果方法 1 和 2 都不行：

1. **File** → **Invalidate Caches...**
2. 勾选以下选项：
   - ✅ Invalidate and Restart
   - ✅ Clear file system cache and Local History
   - ✅ Clear downloaded shared indexes
3. 点击 **Invalidate and Restart**
4. 重启后，再次刷新 Maven 依赖

### 方法 4：手动检查依赖

检查依赖是否正确下载：

```bash
# 在用户目录下查找 jjwt 依赖
# Windows
dir %USERPROFILE%\.m2\repository\io\jsonwebtoken /s

# Linux/Mac
ls -la ~/.m2/repository/io/jsonwebtoken/
```

应该看到：
```
jjwt-api/0.12.5/
jjwt-impl/0.12.5/
jjwt-jackson/0.12.5/
```

---

## 验证修复

### 1. 检查依赖
在 IntelliJ IDEA 中：
- **View** → **Tool Windows** → **Maven**
- 展开 **Dependencies**
- 应该能看到：
  ```
  └─ io.jsonwebtoken
     ├─ jjwt-api:0.12.5
     ├─ jjwt-impl:0.12.5
     └─ jjwt-jackson:0.12.5
  ```

### 2. 检查编译
- 打开 `JwtUtil.java`
- 所有红色波浪线应该消失
- `import io.jsonwebtoken.*;` 应该正常

### 3. 运行测试
```bash
cd backend
./mvnw test
```

---

## 关于 SignatureAlgorithm 过时警告

你可能会看到 `SignatureAlgorithm` 已过时的警告。这是因为 JJWT 0.12.x 版本推荐使用新的 API。

### 当前实现（可用，但有过时警告）
```java
import io.jsonwebtoken.SignatureAlgorithm;

.signWith(getSigningKey(), SignatureAlgorithm.HS256)
```

### 推荐的新实现（无警告）
```java
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;

// 修改 getSigningKey() 方法
private SecretKey getSigningKey() {
    return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
}

// 修改 createToken() 方法
private String createToken(Map<String, Object> claims, String subject) {
    return Jwts.builder()
            .setClaims(claims)
            .setSubject(subject)
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
            .signWith(getSigningKey())  // 不需要指定算法，会自动选择
            .compact();
}
```

不过当前实现完全可用，过时警告不影响功能。

---

## 完整的解决步骤（推荐执行顺序）

### Step 1: 刷新 Maven
```bash
cd backend
./mvnw clean install -DskipTests
```

### Step 2: 在 IDEA 中刷新
1. 点击 Maven 面板的刷新按钮 🔄
2. 等待依赖下载完成

### Step 3: 重新编译
**Build** → **Rebuild Project**

### Step 4: 验证
打开 `JwtUtil.java`，确认没有红色错误。

---

## 如果还是不行

### 检查网络连接
JWT 依赖需要从 Maven 中央仓库下载。如果网络有问题：

1. **使用阿里云镜像**
   
   在 `backend/pom.xml` 的 `<project>` 标签内添加：
   ```xml
   <repositories>
       <repository>
           <id>aliyun</id>
           <url>https://maven.aliyun.com/repository/public</url>
       </repository>
   </repositories>
   ```

2. **或配置全局 Maven 镜像**
   
   编辑 `%USERPROFILE%\.m2\settings.xml` (Windows) 或 `~/.m2/settings.xml` (Linux/Mac)：
   ```xml
   <settings>
       <mirrors>
           <mirror>
               <id>aliyun</id>
               <mirrorOf>central</mirrorOf>
               <name>Aliyun Maven</name>
               <url>https://maven.aliyun.com/repository/public</url>
           </mirror>
       </mirrors>
   </settings>
   ```

3. **重新下载依赖**
   ```bash
   cd backend
   ./mvnw clean install -U
   ```
   `-U` 参数强制更新所有依赖。

---

## 依赖说明

### jjwt-api (0.12.5)
- JWT 的核心 API
- 提供 `Jwts`、`Claims` 等接口
- **scope**: `compile`（编译和运行都需要）

### jjwt-impl (0.12.5)
- JWT 的实现类
- 提供实际的 JWT 创建和解析功能
- **scope**: `runtime`（只在运行时需要）

### jjwt-jackson (0.12.5)
- JWT 的 JSON 序列化支持
- 使用 Jackson 库处理 JSON
- **scope**: `runtime`（只在运行时需要）

---

## 常见错误信息

### 错误 1: Package io.jsonwebtoken does not exist
**原因**: 依赖未下载  
**解决**: 执行方法 1 或 2

### 错误 2: Cannot resolve symbol 'Jwts'
**原因**: IDEA 索引未更新  
**解决**: 执行方法 3（清除缓存）

### 错误 3: 'SignatureAlgorithm' is deprecated
**原因**: 使用了旧版 API  
**解决**: 这只是警告，不影响运行。可以按上面的"推荐的新实现"修改，或保持现状。

---

## 验证依赖版本

在 `pom.xml` 中确认：

```xml
<!-- JWT 依赖 -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>
```

版本 `0.12.5` 是当前（2024年）的稳定版本。

---

## 快速修复命令（一键执行）

```bash
# 进入后端目录
cd backend

# 清理并重新安装所有依赖
./mvnw clean install -U -DskipTests

# 然后在 IDEA 中：
# 1. Build → Rebuild Project
# 2. 如果还有问题：File → Invalidate Caches → Invalidate and Restart
```

---

## 总结

| 问题 | 解决方案 | 优先级 |
|------|---------|--------|
| 依赖未下载 | 刷新 Maven | 🔴 P0 |
| IDEA 缓存问题 | Invalidate Caches | 🟡 P1 |
| 网络问题 | 配置镜像 | 🟡 P1 |
| 过时警告 | 更新 API 用法 | 🟢 P2 |

**推荐步骤**:
1. ✅ 在 IDEA 中刷新 Maven（30秒）
2. ✅ 重新编译项目（1分钟）
3. ✅ 如果还有问题，清除缓存（2分钟）

**成功标志**:
- ✅ `JwtUtil.java` 没有红色错误
- ✅ 可以正常编译
- ✅ 后端可以启动

---

**修复时间**: 通常 2-5 分钟  
**成功率**: 99%  
**注意**: 需要网络连接下载依赖

