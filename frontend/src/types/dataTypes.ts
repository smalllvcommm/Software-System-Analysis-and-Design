// src/types/dataTypes.ts
// 基础API配置和响应类型
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 分页通用类型
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// 用户相关类型
export interface User {
  username: string;
  password?: string;
  role: string;
}

export interface LoginResponseData {
  token: string;
  username: string;
  role: string;
  message: string;
}

export type StoredUser = Omit<User, 'password'>;

// 分類相关类型（原 Subject，現改為 Category）
export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface CategoryFilterParams {
  searchText?: string;
  page?: number;
  size?: number;
}

export interface CategoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
  onSave: (category: Partial<Category>) => void;
}

// 保留 Subject 作為 Category 的別名（向後兼容）
export type Subject = Category;
export type SubjectFilterParams = CategoryFilterParams;
export type SubjectEditModalProps = CategoryEditModalProps;

// 标签相关类型
export interface Tag {
  id: number;
  name: string;
  Articles: Article[];
}

export interface TagFilterParams {
  searchText?: string;
  page?: number;
  size?: number;
}

export interface TagEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag: Tag;
  onSave: (tag: Partial<Tag>) => void;
}

// 文章相关类型
export interface Article {
  id: number;
  title: string;
  content: string;
  status: 'PUBLISHED' | 'UNPUBLISHED';
  visibility: 'PUBLIC' | 'PRIVATE';
  createdTime: string;
  updatedTime: string;
  views: number;
  category: Category | null;  // 改為 category
  tags: Tag[];
}

export interface ArticleFilterParams {
  searchText?: string;
  status?: 'ALL' | 'PUBLISHED' | 'UNPUBLISHED';
  categoryId?: number;  // 改為 categoryId
  sortBy?: 'createdTime-desc' | 'createdTime-asc' | 'views-desc';
  visibility?: 'ALL' | 'PUBLIC' | 'PRIVATE';
  tagId?: number;
  page?: number;
  size?: number;
}

export interface ArticleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article;
  onSave: (updatedArticle: Partial<Article>) => void;
}

// 知识卡片相关类型
export interface KnowledgeCard {
  id?: number;
  title?: string;
  description?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  sortOrder?: number;
  subject?: Subject | null;
  article?: Article | null;
  content?: string[];
}

export interface CardFilterParams {
  searchText?: string;
  subjectId?: number;
  articleId?: number;
  difficulty?: 'ALL' | 'EASY' | 'MEDIUM' | 'HARD';
  page?: number;
  size?: number;
}

export interface KnowledgeCardEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  knowledgeCard: KnowledgeCard;
  onSave: (knowledgeCard: Partial<KnowledgeCard>) => void;
}

// 待办事项相关类型
export interface Todo {
  id: number;
  title: string;
  content: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  deadline: string;
  priority: number;
  createdTime: string;
  updatedTime: string;
  category: Category | null;
  tags: Tag[];
}

export interface TodoFilterParams {
  searchText?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  priority?: number;
  categoryId?: number;
  tagId?: number;
  sortBy?: 'createdTime-desc' | 'createdTime-asc' | 'deadline-asc' | 'deadline-desc' | 'priority-asc' | 'priority-desc';
  page?: number;
  size?: number;
}

export interface TodoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo;
  onSave: (todo: Partial<Todo>) => void;
}

// 備忘錄相关类型
export interface Memo {
  id: number;
  title: string;
  content: string;
  createdTime: string;
  updatedTime: string;
  category: Category | null;
  tags: Tag[];
}

export interface MemoFilterParams {
  searchText?: string;
  categoryId?: number;
  tagId?: number;
  page?: number;
  size?: number;
}

// 學習打卡相关类型
export interface StudyCheckIn {
  id: number;
  title: string;
  content: string;
  hours: number;
  date: string;
  createdTime: string;
  updatedTime: string;
  category: Category | null;
  tags: Tag[];
}

export interface StudyCheckInFilterParams {
  searchText?: string;
  categoryId?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

// 音頻相关类型
export interface Audio {
  id: number;
  title: string;
  content: string;
  audioUrl: string;
  duration: number;
  createdTime: string;
  updatedTime: string;
  category: Category | null;
  tags: Tag[];
}

export interface AudioFilterParams {
  searchText?: string;
  categoryId?: number;
  tagId?: number;
  page?: number;
  size?: number;
}

// 網站收藏相关类型
export interface Website {
  id: number;
  title: string;
  content: string;
  url: string;
  createdTime: string;
  updatedTime: string;
  category: Category | null;
  tags: Tag[];
}

export interface WebsiteFilterParams {
  searchText?: string;
  categoryId?: number;
  tagId?: number;
  page?: number;
  size?: number;
}

// 支出記錄相关类型
export interface Expense {
  id: number;
  title: string;
  content: string;
  amount: number;
  date: string;
  createdTime: string;
  updatedTime: string;
  category: Category | null;
  tags: Tag[];
}

export interface ExpenseFilterParams {
  searchText?: string;
  categoryId?: number;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  size?: number;
}

// 旅行計劃相关类型
export interface TravelPlan {
  id: number;
  title: string;
  content: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  createdTime: string;
  updatedTime: string;
  category: Category | null;
  tags: Tag[];
}

export interface TravelPlanFilterParams {
  searchText?: string;
  categoryId?: number;
  destination?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

// 視頻相关类型
export interface Video {
  id: number;
  title: string;
  content: string;
  videoUrl: string;
  duration: number;
  createdTime: string;
  updatedTime: string;
  category: Category | null;
  tags: Tag[];
}

export interface VideoFilterParams {
  searchText?: string;
  categoryId?: number;
  tagId?: number;
  page?: number;
  size?: number;
}

// 日記相关类型
export interface Diary {
  id: number;
  title: string;
  content: string;
  mood: 'HAPPY' | 'SAD' | 'EXCITED' | 'CALM' | 'ANGRY' | 'ANXIOUS';
  weather: 'SUNNY' | 'CLOUDY' | 'RAINY' | 'SNOWY' | 'WINDY';
  createdTime: string;
  updatedTime: string;
  category: Category | null;
  tags: Tag[];
}

export interface DiaryFilterParams {
  searchText?: string;
  categoryId?: number;
  tagId?: number;
  mood?: 'HAPPY' | 'SAD' | 'EXCITED' | 'CALM' | 'ANGRY' | 'ANXIOUS';
  weather?: 'SUNNY' | 'CLOUDY' | 'RAINY' | 'SNOWY' | 'WINDY';
  sortBy?: 'createdTime-desc' | 'createdTime-asc' | 'title-asc';
  page?: number;
  size?: number;
}

export interface DiaryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  diary: Diary;
  onSave: (diary: Partial<Diary>) => void;
}
