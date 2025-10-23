import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { ValidRole } from '../hooks/useAuth'; // 👈 导入ValidRole类型（原Role已改为ValidRole）


interface AuthGuardProps {
  requiredRole: ValidRole; // 👈 明确类型为ValidRole（'admin' | 'user' | 'guest'）
  children: ReactNode;
}


export function AuthGuard({ requiredRole, children }: AuthGuardProps) {
  const location = useLocation();
  const { isAuthenticated, hasRole, isLoading } = useAuth();


  // 1. 加载状态处理（避免页面闪烁）
  if (isLoading) {
    return <div className="auth-guard-loading">加载中...</div>;
  }


  // 2. 未登录状态：重定向到登录页并记录来源
  if (!isAuthenticated) {
    return <Navigate 
      to="/login" 
      state={{ from: location.pathname }} // 登录后可跳转回原页面
      replace 
    />;
  }


  // 3. 权限不足：重定向到403页，提示具体所需角色
  if (!hasRole(requiredRole)) {
    // 角色名称映射（确保覆盖所有ValidRole情况）
    const roleNameMap: Record<ValidRole, string> = {
      admin: '管理员',
      user: '用户',
      guest: '访客'
    };

    return <Navigate 
      to="/403" 
      state={{ 
        message: `需要${roleNameMap[requiredRole]}权限`, // 动态显示所需角色名称
        from: location.pathname 
      }} 
      replace 
    />;
  }


  // 4. 验证通过：渲染受保护的子组件
  return <>{children}</>;
}