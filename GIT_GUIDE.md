# Git 使用指南

## 關於換行符警告

您看到的警告信息是正常的：

```
warning: in the working copy of 'xxx', LF will be replaced by CRLF the next time Git touches it
```

### 這意味著什麼？

- **LF** (Line Feed): Unix/Linux/Mac 使用的換行符
- **CRLF** (Carriage Return + Line Feed): Windows 使用的換行符
- Git 會自動處理這些換行符的轉換

### 我們的解決方案

已經創建了 `.gitattributes` 文件來統一管理：
- **源代碼文件**：統一使用 LF
- **Windows 腳本**：使用 CRLF
- **二進制文件**：不進行轉換

這些警告**不會影響**您的代碼運行，可以安全地繼續提交。

## 📝 Git 初始化和提交

### 1. 查看當前狀態

```bash
git status
```

### 2. 添加所有文件

```bash
git add .
```

如果看到換行符警告，這是正常的，可以繼續。

### 3. 提交更改

```bash
git commit -m "feat: 重構項目結構，整合前後端為統一項目"
```

### 4. 查看提交歷史

```bash
git log --oneline
```

## 🌐 連接遠程倉庫

### 添加遠程倉庫

```bash
# GitHub
git remote add origin https://github.com/你的用戶名/你的倉庫名.git

# Gitee (國內)
git remote add origin https://gitee.com/你的用戶名/你的倉庫名.git
```

### 查看遠程倉庫

```bash
git remote -v
```

### 推送到遠程倉庫

```bash
# 首次推送
git push -u origin main

# 後續推送
git push
```

如果您的默認分支是 `master`：
```bash
git push -u origin master
```

## 🔀 分支管理

### 創建並切換到新分支

```bash
# 創建並切換
git checkout -b feature/新功能名稱

# 或使用新命令
git switch -c feature/新功能名稱
```

### 查看所有分支

```bash
# 本地分支
git branch

# 所有分支（包括遠程）
git branch -a
```

### 切換分支

```bash
git checkout 分支名

# 或使用新命令
git switch 分支名
```

### 合併分支

```bash
# 切換到目標分支（如 main）
git checkout main

# 合併其他分支
git merge feature/新功能名稱
```

### 刪除分支

```bash
# 刪除本地分支
git branch -d 分支名

# 強制刪除
git branch -D 分支名

# 刪除遠程分支
git push origin --delete 分支名
```

## 📋 提交規範

### Commit Message 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 類型

- `feat`: 新功能
- `fix`: 修復 bug
- `docs`: 文檔更新
- `style`: 代碼格式調整（不影響代碼運行）
- `refactor`: 重構代碼
- `test`: 測試相關
- `chore`: 構建過程或輔助工具的變動
- `perf`: 性能優化
- `ci`: CI/CD 相關

### 示例

```bash
# 簡單提交
git commit -m "feat: 添加用戶登錄功能"

# 詳細提交
git commit -m "feat(auth): 添加用戶登錄功能

- 實現用戶名密碼登錄
- 添加 JWT token 驗證
- 實現記住我功能

Closes #123"
```

## 🔄 常用操作

### 撤銷更改

```bash
# 撤銷工作區的修改
git checkout -- 文件名

# 撤銷暫存區的文件
git reset HEAD 文件名

# 撤銷最後一次提交（保留更改）
git reset --soft HEAD^

# 撤銷最後一次提交（不保留更改）
git reset --hard HEAD^
```

### 查看差異

```bash
# 查看工作區與暫存區的差異
git diff

# 查看暫存區與最後一次提交的差異
git diff --staged

# 查看兩次提交之間的差異
git diff commit1 commit2
```

### 暫存當前工作

```bash
# 暫存當前修改
git stash

# 查看暫存列表
git stash list

# 恢復最近的暫存
git stash pop

# 恢復指定的暫存
git stash apply stash@{0}
```

### 更新代碼

```bash
# 拉取遠程更新
git pull

# 等同於
git fetch
git merge origin/main
```

## 🚫 忽略已追蹤的文件

如果某些文件已經被 Git 追蹤，但您想要忽略它們：

```bash
# 停止追蹤文件但保留本地文件
git rm --cached 文件名

# 停止追蹤整個目錄
git rm -r --cached 目錄名

# 提交更改
git commit -m "chore: 更新 .gitignore"
```

## 🔍 常見問題

### Q: 如何查看當前 Git 配置？

```bash
# 查看所有配置
git config --list

# 查看用戶名
git config user.name

# 查看郵箱
git config user.email
```

### Q: 如何設置 Git 用戶信息？

```bash
# 全局設置
git config --global user.name "你的名字"
git config --global user.email "你的郵箱"

# 僅當前倉庫
git config user.name "你的名字"
git config user.email "你的郵箱"
```

### Q: 如何解決合併衝突？

1. 查看衝突文件：`git status`
2. 手動編輯衝突文件，解決衝突標記
3. 添加解決後的文件：`git add 文件名`
4. 完成合併：`git commit`

### Q: 如何撤銷已推送的提交？

```bash
# 方法1: 創建新的反向提交
git revert 提交ID

# 方法2: 重置並強制推送（慎用！）
git reset --hard 提交ID
git push -f origin 分支名
```

## 📚 推薦的 Git 工作流程

### 日常開發

```bash
1. 更新主分支
   git checkout main
   git pull

2. 創建功能分支
   git checkout -b feature/新功能

3. 開發並提交
   git add .
   git commit -m "feat: 實現新功能"

4. 推送到遠程
   git push -u origin feature/新功能

5. 創建 Pull Request 進行代碼審查

6. 合併到主分支後刪除功能分支
   git branch -d feature/新功能
```

### 團隊協作建議

- 經常拉取最新代碼
- 小步提交，頻繁推送
- 寫清晰的提交信息
- 使用分支進行功能開發
- 進行代碼審查後再合併

## 🛠️ 有用的 Git 命令別名

在 `.gitconfig` 中添加別名：

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.lg "log --graph --oneline --all"
```

使用別名：
```bash
git st    # 等同於 git status
git co main    # 等同於 git checkout main
git lg    # 美化的日誌顯示
```

## 📖 更多資源

- [Git 官方文檔](https://git-scm.com/doc)
- [Pro Git 中文版](https://git-scm.com/book/zh/v2)
- [GitHub 幫助文檔](https://docs.github.com)
- [廖雪峰的 Git 教程](https://www.liaoxuefeng.com/wiki/896043488029600)

---

**記住**: 這些換行符警告是正常的，不會影響您的項目！👍

