import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './public/css/Workspace.css';

export default function Workspace() {
  const { user } = useAuth();

  return (
    <div className="workspace-container">
      <div className="workspace-content">
        {/* 欢迎区域 */}
        <div className="welcome-section">
          <h1 className="welcome-title">欢迎回来，{user?.username || '用户'}！</h1>
          <p className="welcome-subtitle">这是您的个人工作空间</p>
        </div>

        {/* 快速入口 */}
        <div className="quick-access-grid">
          <Link to="/admin/dashboard" className="access-card admin-card">
            <div className="card-icon">🎯</div>
            <h3>管理后台</h3>
            <p>管理您的所有数据和内容</p>
            <div className="card-arrow">→</div>
          </Link>

          <Link to="/study" className="access-card study-card">
            <div className="card-icon">📚</div>
            <h3>学习中心</h3>
            <p>查看学习资源和进度</p>
            <div className="card-arrow">→</div>
          </Link>

          <Link to="/profile" className="access-card profile-card">
            <div className="card-icon">👤</div>
            <h3>个人资料</h3>
            <p>管理您的账号信息</p>
            <div className="card-arrow">→</div>
          </Link>
        </div>

        {/* 统计信息 */}
        <div className="stats-section">
          <h2>数据概览</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-info">
                <div className="stat-number">--</div>
                <div className="stat-label">文章总数</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📌</div>
              <div className="stat-info">
                <div className="stat-number">--</div>
                <div className="stat-label">备忘录</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <div className="stat-number">--</div>
                <div className="stat-label">学习记录</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <div className="stat-number">--</div>
                <div className="stat-label">支出记录</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

