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
  user: {
    username: string;
    role: string; // 后续会校验为 ValidRole
  };
}

export type StoredUser = Omit<User, 'password'>;

// 学科相关类型
export interface Subject {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
}

export interface SubjectFilterParams {
  searchText?: string;
  page?: number;
  size?: number;
}

export interface SubjectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject;
  onSave: (subject: Partial<Subject>) => void;
}

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
  subject: Subject | null;
  tags: Tag[];
}

export interface ArticleFilterParams {
  searchText?: string;
  status?: 'ALL' | 'PUBLISHED' | 'UNPUBLISHED';
  subjectId?: number;
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
  description: string;
  content: string;
  priority: number;
  deadline: string;
  createdDate: string;
  status: boolean;
}

export interface TodoFilterParams {
  searchText?: string;
  status?: boolean;
  priority?: number;
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
    