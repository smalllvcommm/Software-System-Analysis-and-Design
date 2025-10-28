import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../api/utils/apiClient';
import './css/Dashboard.css';

interface DashboardStats {
  articles: number;
  categories: number;
  tags: number;
  memos: number;
  audios: number;
  videos: number;
  websites: number;
  expenses: number;
  travelPlans: number;
  studyCheckIns: number;
}

const Dashboard: React.FC = () => {
  const { username, role } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    articles: 0,
    categories: 0,
    tags: 0,
    memos: 0,
    audios: 0,
    videos: 0,
    websites: 0,
    expenses: 0,
    travelPlans: 0,
    studyCheckIns: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 并行获取所有数据
      const [
        articlesRes,
        categoriesRes,
        tagsRes,
        memosRes,
        audiosRes,
        videosRes,
        websitesRes,
        expensesRes,
        travelPlansRes,
        studyCheckInsRes
      ] = await Promise.all([
        apiClient.get('/articles').catch(() => ({ data: { data: [] } })),
        apiClient.get('/categories').catch(() => ({ data: { data: [] } })),
        apiClient.get('/tags').catch(() => ({ data: { data: [] } })),
        apiClient.get('/memos').catch(() => ({ data: { data: [] } })),
        apiClient.get('/audios').catch(() => ({ data: { data: [] } })),
        apiClient.get('/videos').catch(() => ({ data: { data: [] } })),
        apiClient.get('/websites').catch(() => ({ data: { data: [] } })),
        apiClient.get('/expenses').catch(() => ({ data: { data: [] } })),
        apiClient.get('/travel-plans').catch(() => ({ data: { data: [] } })),
        apiClient.get('/study-check-ins').catch(() => ({ data: { data: [] } }))
      ]);

      setStats({
        articles: Array.isArray(articlesRes.data.data) ? articlesRes.data.data.length : 0,
        categories: Array.isArray(categoriesRes.data.data) ? categoriesRes.data.data.length : 0,
        tags: Array.isArray(tagsRes.data.data) ? tagsRes.data.data.length : 0,
        memos: Array.isArray(memosRes.data.data) ? memosRes.data.data.length : 0,
        audios: Array.isArray(audiosRes.data.data) ? audiosRes.data.data.length : 0,
        videos: Array.isArray(videosRes.data.data) ? videosRes.data.data.length : 0,
        websites: Array.isArray(websitesRes.data.data) ? websitesRes.data.data.length : 0,
        expenses: Array.isArray(expensesRes.data.data) ? expensesRes.data.data.length : 0,
        travelPlans: Array.isArray(travelPlansRes.data.data) ? travelPlansRes.data.data.length : 0,
        studyCheckIns: Array.isArray(studyCheckInsRes.data.data) ? studyCheckInsRes.data.data.length : 0
      });
      
      setLoading(false);
    } catch (error) {
      console.error('加载数据失败:', error);
      setError('加载数据失败，请稍后重试');
      setLoading(false);
    }
  };

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  // 快捷管理入口
  const managementModules = [
    {
      name: '文章管理',
      icon: '📝',
      link: '/admin/list/articles',
      count: stats.articles,
      color: '#2d7e5e'
    },
    {
      name: '备忘录',
      icon: '📋',
      link: '/admin/list/memos',
      count: stats.memos,
      color: '#4ca87e'
    },
    {
      name: '学习打卡',
      icon: '📚',
      link: '/admin/list/studyCheckIns',
      count: stats.studyCheckIns,
      color: '#7ec8a8'
    },
    {
      name: '音频管理',
      icon: '🎵',
      link: '/admin/list/audios',
      count: stats.audios,
      color: '#2d7e5e'
    },
    {
      name: '视频管理',
      icon: '🎬',
      link: '/admin/list/videos',
      count: stats.videos,
      color: '#4ca87e'
    },
    {
      name: '网站收藏',
      icon: '🔗',
      link: '/admin/list/websites',
      count: stats.websites,
      color: '#7ec8a8'
    },
    {
      name: '财务管理',
      icon: '💰',
      link: '/admin/list/expenses',
      count: stats.expenses,
      color: '#2d7e5e'
    },
    {
      name: '旅行计划',
      icon: '✈️',
      link: '/admin/list/travelPlans',
      count: stats.travelPlans,
      color: '#4ca87e'
    }
  ];

  // 快捷创建入口
  const quickActions = [
    {
      label: '新建文章',
      icon: '✏️',
      link: '/admin/list/articles/edit'
    },
    {
      label: '添加备忘',
      icon: '📝',
      link: '/admin/list/memos/edit'
    },
    {
      label: '记录支出',
      icon: '💸',
      link: '/admin/list/expenses/edit'
    },
    {
      label: '学习打卡',
      icon: '✅',
      link: '/admin/list/study-check-ins/edit'
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button className="btn-retry" onClick={loadDashboardData}>
          重新加载
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* 欢迎区域 */}
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <h1 className="welcome-title">
            {getCurrentGreeting()}，{username}！
          </h1>
          <p className="welcome-subtitle">
            {role === 'ADMIN' ? '管理后台' : '个人工作台'}
          </p>
        </div>
        <div className="welcome-actions">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link} className="quick-btn">
              <span className="quick-btn-icon">{action.icon}</span>
              <span className="quick-btn-text">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 数据统计模块 */}
      <div className="dashboard-modules">
        {managementModules.map((module, index) => (
          <Link
            key={index}
            to={module.link}
            className="module-card"
          >
            <div className="module-icon" style={{ color: module.color }}>
              {module.icon}
            </div>
            <div className="module-info">
              <div className="module-name">{module.name}</div>
              <div className="module-count">{module.count} 条</div>
            </div>
            <div className="module-arrow">→</div>
          </Link>
        ))}
      </div>

      {/* 系统信息 */}
      <div className="dashboard-footer">
        <div className="system-info-card">
          <div className="info-item">
            <span className="info-label">当前角色</span>
            <span className="info-value">
              {role === 'ADMIN' ? '👑 管理员' : '👤 普通用户'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">数据总量</span>
            <span className="info-value">
              {Object.values(stats).reduce((a, b) => a + b, 0)} 条
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">当前时间</span>
            <span className="info-value">
              {new Date().toLocaleString('zh-CN', { 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
