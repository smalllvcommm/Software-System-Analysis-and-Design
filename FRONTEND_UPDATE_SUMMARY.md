# 前端更新摘要

## 已完成的工作

### 1. 類型定義更新 (`frontend/src/types/index.ts`)

✅ **已完成**：
- 將 `Subject` 改為 `Category`（保留 `Subject` 作為別名以向後兼容）
- 將 `Article.subject` 改為 `Article.category`
- 將 `ArticleFilterParams.subjectId` 改為 `categoryId`
- 添加新實體類型：
  - `Memo`（備忘錄）
  - `StudyCheckIn`（學習打卡）
  - `Audio`（音頻）
  - `Website`（網站收藏）
  - `Expense`（支出記錄）
  - `TravelPlan`（旅行計劃）
  - `Video`（視頻）

### 2. API 服務更新 (`frontend/src/api/index.ts`)

✅ **已完成**：
- 將 `subjectService` 端點從 `/admin/subjects` 改為 `/categories`
- 將 `tagService` 端點從 `/admin/tags` 改為 `/tags`
- 添加新實體的 API 服務：
  - `memoService` → `/memos`
  - `studyCheckInService` → `/study-check-ins`
  - `audioService` → `/audios`
  - `websiteService` → `/websites`
  - `expenseService` → `/expenses`
  - `travelPlanService` → `/travel-plans`
  - `videoService` → `/videos`
- 保留向後兼容的 `subjectService` 導出

### 3. 認證系統 (`frontend/src/services`, `frontend/src/hooks`, `frontend/src/pages`)

✅ **已完成**：
- 創建新的 `authService.ts`（使用新的後端 JWT API）
- 更新 `useAuth.tsx` 以使用新的認證服務
- 創建獨立的 `Login.tsx` 和 `Register.tsx` 頁面
- 創建 `Auth.css` 樣式
- 更新 `AuthGuard.tsx` 的角色為 `ADMIN` 和 `USER`
- 更新路由配置以支持註冊頁面

### 4. API 配置 (`frontend/src/services/api.ts`)

✅ **已完成**：
- 創建統一的 API 客戶端（帶請求/響應攔截器）
- 自動添加 JWT Token 到請求頭
- 處理 401 錯誤並自動跳轉到登錄頁

### 5. 新實體服務 (`frontend/src/services`)

✅ **已完成**：
- `categoryService.ts`
- `tagService.ts`

## 需要手動完成的工作

### 1. 更新 ListConfig (`frontend/src/configs/listConfigs.ts`)

由於該文件較複雜，需要手動更新：

#### 需要修改：
1. **文章配置** (`articleListConfig`)：
   ```typescript
   {
       key: 'categoryId',  // 改為 categoryId
       type: 'select',
       label: '分類',      // 改為分類
       defaultValue: 0,
       options: []
   }
   ```
   
   並更新 API 調用：
   ```typescript
   fetchAllCategories: fetchAllCategories,  // 改為 fetchAllCategories
   ```

2. **知識卡片配置** (`knowledgeCardListConfig`)：
   ```typescript
   {
       key: 'categoryId',  // 改為 categoryId
       type: 'select',
       label: '分類',      // 改為分類
       defaultValue: 0,
       options: []
   }
   ```
   
   並更新 API 調用：
   ```typescript
   fetchAllCategories: fetchAllCategories,  // 改為 fetchAllCategories
   ```

3. **分類配置** (`subjectListConfig`)：
   重命名為 `categoryListConfig`：
   ```typescript
   export const categoryListConfig: ListConfig<Category> = {
       title: '分類',
       itemIdKey: 'id',
       createLink: '/admin/categories/edit',
       api: {
           createItem: createCategory,
           deleteItem: deleteCategory,
           updateItem: updateCategory,
           fetchList: fetchCategories,
       },
       columns: [
           { key: 'name', title: '名稱', width: '70%' },
           { key: 'description', title: '描述', width: '30%' }
       ],
       filters: [],
       actions: [
           {
               key: 'edit',
               label: '編輯',
               onClick: (item: Category): void => console.log('編輯分類:', item),
               className: 'edit-btn'
           }
       ],
       type: 'other'
   };
   
   // 向後兼容
   export const subjectListConfig = categoryListConfig;
   ```

4. **添加新實體配置**：

   ```typescript
   // 備忘錄配置
   export const memoListConfig: ListConfig<Memo> = {
       title: '備忘錄',
       itemIdKey: 'id',
       createLink: '/admin/memos/edit',
       api: {
           createItem: createMemo,
           deleteItem: deleteMemo,
           updateItem: updateMemo,
           fetchList: fetchMemos,
           fetchAllCategories: fetchAllCategories,
           fetchAllTags: fetchAllTags
       },
       columns: [
           { key: 'title', title: '標題', width: '40%' },
           { key: 'createdTime', title: '創建時間', width: '30%' },
           { key: 'category', title: '分類', width: '15%' },
           { key: 'tags', title: '標籤', width: '15%' }
       ],
       filters: [
           {
               key: 'categoryId',
               type: 'select',
               label: '分類',
               defaultValue: 0,
               options: []
           },
           {
               key: 'tagId',
               type: 'select',
               label: '標籤',
               defaultValue: 0,
               options: []
           }
       ],
       actions: [
           {
               key: 'edit',
               label: '編輯',
               isLink: true,
               linkGenerator: (item: Memo) => `/admin/memos/edit/${item.id}`,
               className: 'edit-btn'
           }
       ],
       type: 'other'
   };
   
   // 學習打卡配置（類似）
   export const studyCheckInListConfig: ListConfig<StudyCheckIn> = { /* ... */ };
   
   // 音頻配置（類似）
   export const audioListConfig: ListConfig<Audio> = { /* ... */ };
   
   // 網站收藏配置（類似）
   export const websiteListConfig: ListConfig<Website> = { /* ... */ };
   
   // 支出記錄配置（類似）
   export const expenseListConfig: ListConfig<Expense> = { /* ... */ };
   
   // 旅行計劃配置（類似）
   export const travelPlanListConfig: ListConfig<TravelPlan> = { /* ... */ };
   
   // 視頻配置（類似）
   export const videoListConfig: ListConfig<Video> = { /* ... */ };
   ```

5. **更新 `listConfigMap`**：
   ```typescript
   export const listConfigMap = {
       articles: articleListConfig,
       cards: knowledgeCardListConfig,
       categories: categoryListConfig,  // 添加
       subjects: subjectListConfig,     // 向後兼容
       tags: tagListConfig,
       todos: todoListConfig,
       memos: memoListConfig,           // 新增
       studyCheckIns: studyCheckInListConfig,  // 新增
       audios: audioListConfig,         // 新增
       websites: websiteListConfig,     // 新增
       expenses: expenseListConfig,     // 新增
       travelPlans: travelPlanListConfig,  // 新增
       videos: videoListConfig          // 新增
   };
   ```

### 2. 更新路由配置 (`frontend/src/router/index.tsx`)

添加新實體的路由：

```typescript
const adminRoutes: RouteObject = {
  path: '/admin',
  element: <AuthGuard requiredRole="ADMIN"><AdminLayout /></AuthGuard>,
  children: [
    { index: true, element: <Dashboard /> },
    { path: 'dashboard', element: <Dashboard /> },
    
    // 資源管理列表頁
    { path: 'list/:type', element: <ListPage /> },
    
    // 編輯頁面
    { path: 'list/articles/edit/:id?', element: <ArticleEdit /> },
    { path: 'list/categories/edit/:id?', element: <CategoryEdit /> },
    { path: 'list/tags/edit/:id?', element: <TagEdit /> },
    { path: 'list/memos/edit/:id?', element: <MemoEdit /> },
    { path: 'list/studyCheckIns/edit/:id?', element: <StudyCheckInEdit /> },
    { path: 'list/audios/edit/:id?', element: <AudioEdit /> },
    { path: 'list/websites/edit/:id?', element: <WebsiteEdit /> },
    { path: 'list/expenses/edit/:id?', element: <ExpenseEdit /> },
    { path: 'list/travelPlans/edit/:id?', element: <TravelPlanEdit /> },
    { path: 'list/videos/edit/:id?', element: <VideoEdit /> },
  ]
};
```

### 3. 創建編輯頁面組件

需要為每個新實體創建編輯頁面（可以參考 `ArticleEdit.tsx` 的結構）：

- `frontend/src/pages/admin/CategoryEdit.tsx`
- `frontend/src/pages/admin/TagEdit.tsx`
- `frontend/src/pages/admin/MemoEdit.tsx`
- `frontend/src/pages/admin/StudyCheckInEdit.tsx`
- `frontend/src/pages/admin/AudioEdit.tsx`
- `frontend/src/pages/admin/WebsiteEdit.tsx`
- `frontend/src/pages/admin/ExpenseEdit.tsx`
- `frontend/src/pages/admin/TravelPlanEdit.tsx`
- `frontend/src/pages/admin/VideoEdit.tsx`

### 4. 更新 AdminSidebar

更新側邊欄菜單以包含新實體：

```typescript
const menuItems = [
  { icon: faHome, label: '儀表板', path: '/admin/dashboard' },
  { icon: faFileAlt, label: '文章管理', path: '/admin/list/articles' },
  { icon: faFolder, label: '分類管理', path: '/admin/list/categories' },
  { icon: faTags, label: '標籤管理', path: '/admin/list/tags' },
  { icon: faStickyNote, label: '備忘錄', path: '/admin/list/memos' },
  { icon: faClipboardCheck, label: '學習打卡', path: '/admin/list/studyCheckIns' },
  { icon: faMusic, label: '音頻管理', path: '/admin/list/audios' },
  { icon: faGlobe, label: '網站收藏', path: '/admin/list/websites' },
  { icon: faMoneyBill, label: '支出記錄', path: '/admin/list/expenses' },
  { icon: faPlane, label: '旅行計劃', path: '/admin/list/travelPlans' },
  { icon: faVideo, label: '視頻管理', path: '/admin/list/videos' },
];
```

## 向後兼容性

為了確保現有代碼繼續工作，以下別名已添加：

- `Subject` = `Category`
- `SubjectFilterParams` = `CategoryFilterParams`
- `subjectService` = `categoryService`
- `fetchSubjects` = `fetchCategories`
- `fetchAllSubjects` = `fetchAllCategories`

## 後端 API 端點映射

| 實體 | 前端服務 | 後端端點 |
|------|---------|---------|
| 文章 | `articleService` | `/articles` |
| 分類 | `categoryService` | `/categories` |
| 標籤 | `tagService` | `/tags` |
| 備忘錄 | `memoService` | `/memos` |
| 學習打卡 | `studyCheckInService` | `/study-check-ins` |
| 音頻 | `audioService` | `/audios` |
| 網站 | `websiteService` | `/websites` |
| 支出 | `expenseService` | `/expenses` |
| 旅行計劃 | `travelPlanService` | `/travel-plans` |
| 視頻 | `videoService` | `/videos` |
| 認證 | `authService` | `/auth` |

## 測試清單

啟動前後端後，測試以下功能：

- [ ] 用戶註冊
- [ ] 用戶登錄
- [ ] 文章列表顯示
- [ ] 文章創建/編輯/刪除
- [ ] 分類列表顯示
- [ ] 分類創建/編輯/刪除
- [ ] 標籤列表顯示
- [ ] 標籤創建/編輯/刪除
- [ ] 備忘錄 CRUD
- [ ] 學習打卡 CRUD
- [ ] 音頻 CRUD
- [ ] 網站收藏 CRUD
- [ ] 支出記錄 CRUD
- [ ] 旅行計劃 CRUD
- [ ] 視頻 CRUD
- [ ] Token 過期處理
- [ ] 權限控制（ADMIN vs USER）

## 數據庫注意事項

在第一次運行前端之前，確保：

1. 後端已成功啟動
2. 數據庫已創建（按照 `DATABASE_RESET_GUIDE.md`）
3. 已創建管理員帳號（按照 `QUICK_START.md`）

## 快速啟動步驟

1. **重置數據庫**（如果需要）：
   ```sql
   DROP DATABASE IF EXISTS backwork;
   CREATE DATABASE backwork CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **啟動後端**：
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

3. **啟動前端**：
   ```bash
   cd frontend
   npm install  # 首次運行
   npm run dev
   ```

4. **註冊管理員帳號**：
   - 訪問 http://localhost:5173/register
   - 註冊新帳號
   - 在數據庫中將角色升級為 ADMIN

5. **開始使用**！

## 下一步工作

1. 完成 `listConfigs.ts` 的手動更新
2. 創建所有新實體的編輯頁面
3. 更新 AdminSidebar 菜單
4. 添加路由配置
5. 測試所有功能
6. 優化 UI/UX
7. 添加更多驗證和錯誤處理

