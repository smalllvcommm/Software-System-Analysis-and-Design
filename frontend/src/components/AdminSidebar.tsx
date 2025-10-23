// components/AdminSidebar.tsx
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDashboard, 
  faFileAlt, 
  faFolder, 
  faTag, 
  faCheckSquare 
} from '@fortawesome/free-solid-svg-icons';
import './css/AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();
  
  // 管理后台导航项配置
  const sidebarItems = [
    { path: '/admin/dashboard', icon: faDashboard, label: '仪表盘' },
    { path: '/admin/list/articles', icon: faFileAlt, label: '管理' },

  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>管理后台</h2>
      </div>
      <nav className="sidebar-nav">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={`sidebar-link ${
              location.pathname === item.path || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path))
                ? 'active' 
                : ''
            }`}
          >
            <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;