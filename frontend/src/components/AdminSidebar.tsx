// components/AdminSidebar.tsx
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDashboard, 
  faFileAlt, 
  faFolder, 
  faTag,
  faStickyNote,
  faClipboardCheck,
  faMusic,
  faGlobe,
  faMoneyBill,
  faPlane,
  faVideo
} from '@fortawesome/free-solid-svg-icons';
import './css/AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();
  
  // 管理后台导航项配置
  const sidebarItems = [
    { path: '/admin/dashboard', icon: faDashboard, label: '仪表盘' },
    { path: '/admin/list/articles', icon: faFileAlt, label: '文章管理' },
    { path: '/admin/list/memos', icon: faStickyNote, label: '备忘录' },
    { path: '/admin/list/studyCheckIns', icon: faClipboardCheck, label: '学习打卡' },
    { path: '/admin/list/audios', icon: faMusic, label: '音频管理' },
    { path: '/admin/list/videos', icon: faVideo, label: '视频管理' },
    { path: '/admin/list/websites', icon: faGlobe, label: '网站收藏' },
    { path: '/admin/list/expenses', icon: faMoneyBill, label: '支出记录' },
    { path: '/admin/list/travelPlans', icon: faPlane, label: '旅行计划' },
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