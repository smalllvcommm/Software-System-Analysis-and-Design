import avatarImg from '../../assets/head.png';
import '../css/ProfileWidget.css';

export default function ProfileWidget() {
  return (
    <div className="sidebar-widget profile-widget">

      <div className="profile-header">
        <img src={avatarImg} alt="站长头像" className="profile-avatar" />
        <h3 className="profile-name">静默</h3>
        <p className="profile-bio">专注于学习资源分享与知识体系构建</p>
      </div>

      <div className="profile-stats">

        <div className="stat-item">
          <span className="stat-value">126</span>
          <span className="stat-label">文章</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">32</span>
          <span className="stat-label">学科</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">2.4k</span>
          <span className="stat-label">标签</span>
        </div>

      </div>
    </div>
  );
}