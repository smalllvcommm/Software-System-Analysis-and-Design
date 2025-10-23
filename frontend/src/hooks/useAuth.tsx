import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

// 定义系统支持的合法角色（核心：将string收窄为具体选项）
export type ValidRole = 'ADMIN' | 'USER'; 

interface StoredUser {
  username: string;
  role: string;
}

// 认证上下文接口
interface AuthContextType {
  user: StoredUser | null;
  username: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (requiredRole: ValidRole) => boolean;
  clearError: () => void;
}


// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 初始化：从localStorage加载用户信息
  useEffect(() => {
    const initAuth = () => {
      try {
        const username = authService.getUsername();
        const role = authService.getRole();
        
        if (username && role && isValidRole(role)) {
          setUser({ username, role });
        }
      } catch (err) {
        console.error('用户数据无效，已清除', err);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // 辅助函数：校验角色是否合法
  const isValidRole = (role: string): role is ValidRole => {
    return ['ADMIN', 'USER'].includes(role);
  };


  // 登录方法
  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login({ username, password });
      
      // 校验API返回的role是否合法
      if (!isValidRole(response.role)) {
        throw new Error(`后端返回无效角色: ${response.role}`);
      }

      setUser({ username: response.username, role: response.role });
      
      // 登录成功后，跳转逻辑由Login组件的useEffect处理，这里不再导航

    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请重试');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);


  // 权限检查
  const hasRole = useCallback((requiredRole: ValidRole) => {
    if (!user) return false;
    return (user.role as ValidRole) === requiredRole || (user.role as ValidRole) === 'ADMIN'; 
  }, [user]);

  // 注销方法
  const logout = useCallback(() => {
    setUser(null);
    authService.logout();
    navigate('/login', { replace: true });
  }, [navigate]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{
      user,
      username: user?.username || null,
      role: user?.role || null,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      logout,
      hasRole,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};


// 导出useAuth Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider中使用');
  }
  return context;
};