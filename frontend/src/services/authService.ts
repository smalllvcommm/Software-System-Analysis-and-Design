import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post<ApiResponse<AuthResponse>>(
      `${API_BASE_URL}/auth/login`,
      credentials
    );
    
    if (response.data.success && response.data.data) {
      // 保存 Token 到 localStorage
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('username', response.data.data.username);
      localStorage.setItem('role', response.data.data.role);
      
      return response.data.data;
    }
    
    throw new Error(response.data.message || '登錄失敗');
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await axios.post<ApiResponse<AuthResponse>>(
      `${API_BASE_URL}/auth/register`,
      userData
    );
    
    if (response.data.success && response.data.data) {
      // 保存 Token 到 localStorage
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('username', response.data.data.username);
      localStorage.setItem('role', response.data.data.role);
      
      return response.data.data;
    }
    
    throw new Error(response.data.message || '註冊失敗');
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUsername(): string | null {
    return localStorage.getItem('username');
  },

  getRole(): string | null {
    return localStorage.getItem('role');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }
};

export default authService;

