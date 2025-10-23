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
  Subject, 
  SubjectFilterParams,
  Tag, 
  TagFilterParams,
  Todo, 
  TodoFilterParams
} from '../types/index'; // 所有类型均从 index 导出

// ------------------------------
// 文章相关API
// ------------------------------
export const articleService = createCRUDService<Article, ArticleFilterParams>('/admin/articles');

export const {
  create: createArticle,
  delete: deleteArticle,
  update: updateArticle,
  fetchList: fetchArticles,
  fetchById: fetchArticleById,
} = articleService;

export const fetchAllArticles = async () => {
  const response = await apiClient.get<ApiResponse<Article[]>>(`/admin/articles/all`);
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
export const knowledgeCardService = createCRUDService<KnowledgeCard, CardFilterParams>('/admin/knowledgeCards');

export const {
  create: createKnowledgeCard,
  delete: deleteKnowledgeCard,
  update: updateKnowledgeCard,
  fetchList: fetchKnowledgeCards,
  fetchById: fetchKnowledgeCardById,
} = knowledgeCardService;

// ------------------------------
// 学科相关API
// ------------------------------
export const subjectService = createCRUDService<Subject, SubjectFilterParams>('/admin/subjects');

export const {
  create: createSubject,
  delete: deleteSubject,
  update: updateSubject,
  fetchList: fetchSubjects,
  fetchById: fetchSubjectById,
} = subjectService;

export const fetchAllSubjects = async () => {
  const response = await apiClient.get<ApiResponse<Subject[]>>(`/admin/subjects/all`);
  return response.data;
};

// ------------------------------
// 标签相关API
// ------------------------------
export const tagService = createCRUDService<Tag, TagFilterParams>('/admin/tags');

export const {
  create: createTag,
  delete: deleteTag,
  update: updateTag,
  fetchList: fetchTags,
  fetchById: fetchTagById,
} = tagService;

export const fetchAllTags = async () => {
  const response = await apiClient.get<ApiResponse<Tag[]>>(`/admin/tags/all`);
  return response.data;
};

// ------------------------------
// 待办事项相关API
// ------------------------------
export const todoService = createCRUDService<Todo, TodoFilterParams>('/admin/todos');

export const {
  create: createTodo,
  delete: deleteTodo,
  update: updateTodo,
  fetchList: fetchTodos,
  fetchById: fetchTodoById,
} = todoService;