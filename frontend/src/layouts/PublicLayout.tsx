// layouts/PublicLayout.tsx
import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';
import './PublicLayout.css';

const PublicLayout = () => {
  return (
    <div className="app-container">
      {/* 导航栏 */}
      <Navigation />
      
      {/* 主内容区 */}
      <main className="main-content">
        <Outlet />
      </main>
      
      {/* 页脚 */}
      <footer className="page-footer">
        <p>© 2024 学习资源管理平台</p>
      </footer>
    </div>
  );
};

export default PublicLayout;