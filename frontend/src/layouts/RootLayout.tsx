// src/pages/RootLayout.tsx
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth.tsx';

export default function RootLayout() {
  return (
    // 用 AuthProvider 包裹 Outlet，确保所有子路由组件都能使用 useAuth
    <AuthProvider>
      <Outlet /> {/* 子路由（public/study/admin）的内容会在这里渲染 */}
    </AuthProvider>
  );
}