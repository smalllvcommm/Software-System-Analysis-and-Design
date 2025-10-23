import { createContext, useContext, useState, useEffect, useCallback,  type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, StoredUser, ApiResponse, LoginResponseData } from '../types/index'; // 直接使用你的原始User接口（包含role: string）
import { login as apiLogin } from '../api/index'; // 你的登录API


// 定义系统支持的合法角色（核心：将string收窄为具体选项）
export type ValidRole = 'admin' | 'user' | 'guest'; 

// 认证上下文接口（保持与原始User兼容）
interface AuthContextType {
  user: StoredUser | null; // 直接使用原始User类型
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (requiredRole: ValidRole) => boolean; // 仅接受合法角色作为参数
  clearError: () => void;
}


// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<StoredUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();


	// 初始化：从localStorage加载用户信息并校验role合法性
	useEffect(() => {
		const initAuth = () => {
		try {
			const storedUserStr = localStorage.getItem('user');
			if (!storedUserStr) return setIsLoading(false);

			const storedUser: StoredUser = JSON.parse(storedUserStr);
			// 校验role是否为系统支持的合法角色
			if (!isValidRole(storedUser.role)) {
			throw new Error(`无效角色: ${storedUser.role}`);
			}
			setUser(storedUser);
		} catch (err) {
			console.error('用户数据无效，已清除', err);
			localStorage.removeItem('user');
		} finally {
			setIsLoading(false);
		}
		};

		initAuth();
	}, []);


	// 辅助函数：校验角色是否合法（核心：确保role是预期的字符串）
	const isValidRole = (role: string): role is ValidRole => {
		return ['admin', 'user', 'guest'].includes(role);
	};


  // 登录方法（使用你的原始API）
	const login = useCallback(async (username: string, password: string) => {
		setIsLoading(true);
		setError(null);

    try {
		// 调用你的登录API（返回ApiResponse<User>）
		const response: ApiResponse<LoginResponseData> = await apiLogin(username, password);
		
		if (response.code !== 200 || !response.data) {
			throw new Error(response.message || '登录失败');
		}

		const userData = response.data.user;
		// 校验API返回的role是否合法
		if (!isValidRole(userData.role)) {
			throw new Error(`后端返回无效角色: ${userData.role}`);
		}

		// 存储用户信息（排除password，保留原始User结构）
        const userToStore: StoredUser = { // 显式指定为StoredUser（与Omit<User, 'password'>等价）
        username: userData.username,
        role: userData.role 
        };

		setUser(userToStore);
		localStorage.setItem('user', JSON.stringify(userToStore));

		// 重定向到来源页
		const redirectPath = new URLSearchParams(window.location.search).get('redirect') || '/';
		navigate(redirectPath, { replace: true });

		} catch (err) {
		setError(err instanceof Error ? err.message : '登录失败，请重试');
		throw err; // 允许组件层捕获错误
		} finally {
		setIsLoading(false);
		}
  }, [navigate]);


	// 权限检查（仅接受合法角色作为参数）
	const hasRole = useCallback((requiredRole: ValidRole) => {
	if (!user) return false;
	// 此时user.role已被isValidRole校验为ValidRole，可安全断言
	return (user.role as ValidRole) === requiredRole || (user.role as ValidRole) === 'admin'; 
	}, [user]);


	// 其他方法（注销、清除错误等）
	const logout = useCallback(() => {
		setUser(null);
		localStorage.removeItem('user');
		navigate('/login', { replace: true });
	}, [navigate]);

	const clearError = useCallback(() => setError(null), []);


	return (
		<AuthContext.Provider value={{
		user,
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