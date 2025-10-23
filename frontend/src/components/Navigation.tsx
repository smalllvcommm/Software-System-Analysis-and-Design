// components/Navigation.tsx
import { NavLink } from 'react-router-dom';
import './css/Navigation.css';

const Navigation = () => {
  return (
    <nav className='nav-bar'>
      <div className="nav-left">
        <span className="logo">📚</span>
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-link home-link ${isActive ? 'active' : ''}`}
          end
        >
          我的
        </NavLink>
      </div>

      <div className="nav-right">
        <div className="nav-group">
          <NavLink to="/study" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            学习首页
          </NavLink> |
          <NavLink to="/study/articles" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            文章列表
          </NavLink> |
          <NavLink to="/study/subjects" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            学科分类
          </NavLink> |
        </div>

        <NavLink to='/todoList' className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="link-icon">📖</span> 待办事项
        </NavLink> |
        <NavLink to='/about' className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="link-icon">📞</span> 关于我
        </NavLink> |
        
        <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link admin-link ${isActive ? 'active' : ''}`}>
          管理后台
        </NavLink> |
        
        <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          登录
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;