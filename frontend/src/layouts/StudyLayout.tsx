// layouts/StudyLayout.tsx
import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';
import StudySidebar from '../components/StudySidebar';
import './StudyLayout.css';

const StudyLayout = () => {
  return (
    <div className="study-layout">
      {/* 顶部导航 */}
      <Navigation />
      
      <div className="study-container">
        {/* 侧边栏 */}
        <StudySidebar />
        
        {/* 主内容区 */}
        <main className="study-content">
          <Outlet />
        </main>
      </div>
      
      {/* 页脚 */}
      <footer className="page-footer">
        <p>© 2024 学习资源管理平台</p>
      </footer>
    </div>
  );
};

export default StudyLayout;