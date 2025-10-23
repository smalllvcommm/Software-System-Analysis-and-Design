// components/StudySidebar.tsx
import { NavLink, useLocation } from 'react-router-dom';
import './css/StudySidebar.css';

const StudySidebar = () => {
  const location = useLocation();
  
  // 侧边栏导航项配置
  const sidebarItems = [
    { path: '/study', label: '学习首页' },
    { path: '/study/articles', label: '文章列表' },
    { path: '/study/subjects', label: '学科分类' },
  ];

  return (
    <aside className="study-sidebar">
      <div className="sidebar-header">
        <h3>学习中心</h3>
      </div>
      <nav className="sidebar-nav">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={`sidebar-link ${
              location.pathname === item.path || 
              location.pathname.startsWith(item.path + '/')
                ? 'active' 
                : ''
            }`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default StudySidebar;