import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import avatarImg from '../../assets/head.png';
import '../css/ProfileWidget.css';

interface UserStats {
  articles: number;
  categories: number;
  tags: number;
}

export default function ProfileWidget() {
  const { username, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    articles: 0,
    categories: 0,
    tags: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserStats = async () => {
      try {
        setLoading(true);
        // 这里可以调用API获取用户统计数据
        // 暂时使用模拟数据
        setStats({
          articles: 126,
          categories: 32,
          tags: 2.4
        });
      } catch (error) {
        console.error('加载用户统计失败:', error);
        setStats({
          articles: 0,
          categories: 0,
          tags: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserStats();
  }, []);

  if (loading) {
    return (
      <div className="sidebar-widget profile-widget loading">
        <div className="profile-skeleton">
          <div className="avatar-skeleton"></div>
          <div className="name-skeleton"></div>
          <div className="bio-skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar-widget profile-widget">
      <div className="profile-header">
        <img src={avatarImg} alt="用户头像" className="profile-avatar" />
        <h3 className="profile-name">
          {isAuthenticated ? username : '微云记'}
        </h3>
        <p className="profile-bio">
          {isAuthenticated 
            ? '专注于个人信息管理与知识体系构建' 
            : '一站式管理您的学习资源、备忘录、多媒体文件和个人计划'
          }
        </p>
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-value">{stats.articles}</span>
          <span className="stat-label">文章</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.categories}</span>
          <span className="stat-label">分类</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.tags}k</span>
          <span className="stat-label">标签</span>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="profile-actions">
          <a href="/login" className="login-btn">立即登录</a>
          <a href="/register" className="register-btn">免费注册</a>
        </div>
      )}
    </div>
  );
}
