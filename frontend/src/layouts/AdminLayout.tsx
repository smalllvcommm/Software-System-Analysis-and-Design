// layouts/AdminLayout.tsx
import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';
import AdminSidebar from '../components/AdminSidebar';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* 顶部导航栏 */}
      <Navigation />
      
      {/* 侧边栏 */}
      <AdminSidebar />
      
      {/* 主体内容区 */}
      <main className="admin-main">
        <div className="content-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;