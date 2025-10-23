// components/Navigation.tsx
import { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useOutsideClick } from '../hooks/useOutsideClick';
import logo from '../assets/logo.png';
import './css/Navigation.css';

const Navigation = () => {
  const { isAuthenticated, username, role, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 点击外部关闭菜单
  useOutsideClick(menuRef, () => setShowUserMenu(false));

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const isAdmin = role === 'ADMIN';

  // 获取用户名首字母作为头像
  const getAvatarText = () => {
    if (!username) return '?';
    return username.charAt(0).toUpperCase();
  };

  return (
    <nav className='nav-bar'>
      <div className="nav-left">
        <NavLink to={isAuthenticated ? "/workspace" : "/"} className="logo-link">
          <img src={logo} alt="Logo" className="logo" />
          <span className="logo-text">微云记</span>
        </NavLink>
      </div>

      <div className="nav-right">
        
        {/* 功能链接 - 仅登录用户可见 */}
        {isAuthenticated && (
          <>
            <div className="nav-group">
              <NavLink to="/articles" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                文章列表
              </NavLink> |
              <NavLink to="/study" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                学习中心
              </NavLink> |
              <NavLink to='/todoList' className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                待办事项
              </NavLink> |
            </div>
          </>
        )}
        
        {/* 管理后台链接 - 仅管理员可见 */}
        {isAdmin && (
          <>
            <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link admin-link ${isActive ? 'active' : ''}`}>
              管理后台
            </NavLink> |
          </>
        )}
        
        {/* 用户菜单 */}
        {isAuthenticated ? (
          <div className="user-menu-container" ref={menuRef}>
            <button 
              className="user-avatar-btn" 
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="用户菜单"
            >
              <div className="user-avatar">
                {getAvatarText()}
              </div>
              <span className="username-text">{username}</span>
            </button>

            {showUserMenu && (
              <div className="user-dropdown-menu">
                <div className="user-menu-header">
                  <div className="user-avatar-large">
                    {getAvatarText()}
                  </div>
                  <div className="user-info">
                    <div className="user-name">{username}</div>
                    <div className="user-role">{isAdmin ? '管理员' : '普通用户'}</div>
                  </div>
                </div>
                
                <div className="user-menu-divider"></div>
                
                <NavLink 
                  to="/profile" 
                  className="user-menu-item"
                  onClick={() => setShowUserMenu(false)}
                >
                  <span className="menu-icon">👤</span>
                  个人资料
                </NavLink>
                
                {isAdmin && (
                  <NavLink 
                    to="/admin/dashboard" 
                    className="user-menu-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <span className="menu-icon">⚙️</span>
                    管理后台
                  </NavLink>
                )}
                
                <div className="user-menu-divider"></div>
                
                <button 
                  className="user-menu-item logout-btn"
                  onClick={handleLogout}
                >
                  <span className="menu-icon">🚪</span>
                  退出登录
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              登录
            </NavLink> |
            <NavLink to="/register" className={({ isActive }) => `nav-link register-link ${isActive ? 'active' : ''}`}>
              注册
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;