// src/api/index.ts
import { apiClient } from './utils/apiClient';
import type { ApiResponse } from './utils/apiClient';
import { createCRUDService } from './utils/createCRUDService';

// 统一从 index 导入所有类型定义
import type { 
  Article, 
  ArticleFilterParams,
  User,
  LoginResponseData,
  KnowledgeCard, 
  CardFilterParams,
  Category, 
  CategoryFilterParams,
  Tag, 
  TagFilterParams,
  Todo, 
  TodoFilterParams,
  Memo,
  MemoFilterParams,
  StudyCheckIn,
  StudyCheckInFilterParams,
  Audio,
  AudioFilterParams,
  Website,
  WebsiteFilterParams,
  Expense,
  ExpenseFilterParams,
  TravelPlan,
  TravelPlanFilterParams,
  Video,
  VideoFilterParams
} from '../types/index'; // 所有类型均从 index 导出

// ------------------------------
// 文章相关API
// ------------------------------
export const articleService = createCRUDService<Article, ArticleFilterParams>('/articles');

export const {
  create: createArticle,
  delete: deleteArticle,
  update: updateArticle,
  fetchList: fetchArticles,
  fetchById: fetchArticleById,
} = articleService;

export const fetchAllArticles = async () => {
  const response = await apiClient.get<ApiResponse<Article[]>>(`/articles/all`);
  return response.data;
};

// ------------------------------
// 用户认证相关API
// ------------------------------
export const login = async (username: string, password: string) => {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>('/auth/login', { username, password });
    return response.data;
};

// ------------------------------
// 知识卡片相关API
// ------------------------------
export const knowledgeCardService = createCRUDService<KnowledgeCard, CardFilterParams>('/knowledgeCards');

export const {
  create: createKnowledgeCard,
  delete: deleteKnowledgeCard,
  update: updateKnowledgeCard,
  fetchList: fetchKnowledgeCards,
  fetchById: fetchKnowledgeCardById,
} = knowledgeCardService;

// ------------------------------
// 分類相关API（原學科，現改為Category）
// ------------------------------
export const categoryService = createCRUDService<Category, CategoryFilterParams>('/categories');

export const {
  create: createCategory,
  delete: deleteCategory,
  update: updateCategory,
  fetchList: fetchCategories,
  fetchById: fetchCategoryById,
} = categoryService;

export const fetchAllCategories = async () => {
  const response = await apiClient.get<ApiResponse<Category[]>>(`/categories/all`);
  return response.data;
};

// 向後兼容：保留 Subject 相關導出
export const subjectService = categoryService;
export const createSubject = createCategory;
export const deleteSubject = deleteCategory;
export const updateSubject = updateCategory;
export const fetchSubjects = fetchCategories;
export const fetchSubjectById = fetchCategoryById;
export const fetchAllSubjects = fetchAllCategories;

// ------------------------------
// 标签相关API
// ------------------------------
export const tagService = createCRUDService<Tag, TagFilterParams>('/tags');

export const {
  create: createTag,
  delete: deleteTag,
  update: updateTag,
  fetchList: fetchTags,
  fetchById: fetchTagById,
} = tagService;

export const fetchAllTags = async () => {
  const response = await apiClient.get<ApiResponse<Tag[]>>(`/tags/all`);
  return response.data;
};

// ------------------------------
// 待办事项相关API
// ------------------------------
export const todoService = createCRUDService<Todo, TodoFilterParams>('/todos');

export const {
  create: createTodo,
  delete: deleteTodo,
  update: updateTodo,
  fetchList: fetchTodos,
  fetchById: fetchTodoById,
} = todoService;

// ------------------------------
// 備忘錄相关API
// ------------------------------
export const memoService = createCRUDService<Memo, MemoFilterParams>('/memos');

export const {
  create: createMemo,
  delete: deleteMemo,
  update: updateMemo,
  fetchList: fetchMemos,
  fetchById: fetchMemoById,
} = memoService;

// ------------------------------
// 學習打卡相关API
// ------------------------------
export const studyCheckInService = createCRUDService<StudyCheckIn, StudyCheckInFilterParams>('/study-check-ins');

export const {
  create: createStudyCheckIn,
  delete: deleteStudyCheckIn,
  update: updateStudyCheckIn,
  fetchList: fetchStudyCheckIns,
  fetchById: fetchStudyCheckInById,
} = studyCheckInService;

// ------------------------------
// 音頻相关API
// ------------------------------
export const audioService = createCRUDService<Audio, AudioFilterParams>('/audios');

export const {
  create: createAudio,
  delete: deleteAudio,
  update: updateAudio,
  fetchList: fetchAudios,
  fetchById: fetchAudioById,
} = audioService;

// ------------------------------
// 網站收藏相关API
// ------------------------------
export const websiteService = createCRUDService<Website, WebsiteFilterParams>('/websites');

export const {
  create: createWebsite,
  delete: deleteWebsite,
  update: updateWebsite,
  fetchList: fetchWebsites,
  fetchById: fetchWebsiteById,
} = websiteService;

// ------------------------------
// 支出記錄相关API
// ------------------------------
export const expenseService = createCRUDService<Expense, ExpenseFilterParams>('/expenses');

export const {
  create: createExpense,
  delete: deleteExpense,
  update: updateExpense,
  fetchList: fetchExpenses,
  fetchById: fetchExpenseById,
} = expenseService;

// ------------------------------
// 旅行計劃相关API
// ------------------------------
export const travelPlanService = createCRUDService<TravelPlan, TravelPlanFilterParams>('/travel-plans');

export const {
  create: createTravelPlan,
  delete: deleteTravelPlan,
  update: updateTravelPlan,
  fetchList: fetchTravelPlans,
  fetchById: fetchTravelPlanById,
} = travelPlanService;

// ------------------------------
// 視頻相关API
// ------------------------------
export const videoService = createCRUDService<Video, VideoFilterParams>('/videos');

export const {
  create: createVideo,
  delete: deleteVideo,
  update: updateVideo,
  fetchList: fetchVideos,
  fetchById: fetchVideoById,
} = videoService;