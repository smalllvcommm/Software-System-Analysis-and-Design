import { apiClient } from './apiClient';
import type { Page } from '../../types/index';
import type { ApiResponse } from './apiClient';

export function createCRUDService<T, FilterParams = any>(baseUrl: string) {
  return {
    create: async (item: Omit<T, 'id'>): Promise<T> => {
      const response = await apiClient.post<ApiResponse<T>>(`${baseUrl}`, item);
      return response.data.data; 
    },

    delete: async (id: number): Promise<void> => {
      await apiClient.delete<ApiResponse<void>>(`${baseUrl}/${id}`);

    },

    update: async (item: T): Promise<T> => {
      const id = (item as any).id;
      const response = await apiClient.put<ApiResponse<T>>(`${baseUrl}/${id}`, item);
      return response.data.data; // 同上，需两层 .data
    },

    fetchList: async (params?: FilterParams): Promise<Page<T>> => {
      const response = await apiClient.get<ApiResponse<Page<T>>>(`${baseUrl}`, { params });
      return response.data.data;
    },

    fetchById: async (id: number): Promise<T> => {
      const response = await apiClient.get<ApiResponse<T>>(`${baseUrl}/${id}`);
      return response.data.data;
    },
  };
}