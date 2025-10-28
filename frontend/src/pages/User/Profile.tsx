import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './css/Profile.css';

const Profile = () => {
  const { isAuthenticated, username, role } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: username || '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const getAvatarText = () => {
    if (!username) return '?';
    return username.charAt(0).toUpperCase();
  };

  const getRoleName = () => {
    return role === 'ADMIN' ? '管理员' : '普通用户';
  };

  const getRoleColor = () => {
    return role === 'ADMIN' ? '#d9363e' : '#667eea';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // 验证密码
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: '两次输入的新密码不一致' });
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: '新密码长度至少为6位' });
      return;
    }

    try {
      // TODO: 调用API更新个人信息
      // await updateProfile(formData);
      
      setMessage({ type: 'success', text: '个人信息更新成功！' });
      setIsEditing(false);
      
      // 清空密码字段
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || '更新失败，请重试' });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      username: username || '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setMessage(null);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-large" style={{ background: `linear-gradient(135deg, ${getRoleColor()} 0%, #764ba2 100%)` }}>
            {getAvatarText()}
          </div>
          <div className="profile-header-info">
            <h1 className="profile-username">{username}</h1>
            <span className="profile-role" style={{ background: getRoleColor() }}>
              {getRoleName()}
            </span>
          </div>
        </div>

        <div className="profile-content">
          {/* 消息提示 */}
          {message && (
            <div className={`profile-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="profile-section">
            <div className="section-header">
              <h2>基本信息</h2>
              {!isEditing && (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  ✏️ 编辑
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="profile-info-display">
                <div className="info-item">
                  <span className="info-label">用户名：</span>
                  <span className="info-value">{username}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">邮箱：</span>
                  <span className="info-value">{formData.email || '未设置'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">角色：</span>
                  <span className="info-value">{getRoleName()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">注册时间：</span>
                  <span className="info-value">2024-10-23</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="profile-edit-form">
                <div className="form-group">
                  <label htmlFor="username">用户名</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled
                    className="form-input"
                  />
                  <span className="form-help">用户名不可修改</span>
                </div>

                <div className="form-group">
                  <label htmlFor="email">邮箱</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="请输入邮箱地址"
                  />
                </div>

                <div className="form-divider">
                  <span>修改密码（选填）</span>
                </div>

                <div className="form-group">
                  <label htmlFor="currentPassword">当前密码</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="如需修改密码，请输入当前密码"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">新密码</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="请输入新密码（至少6位）"
                    minLength={6}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">确认新密码</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="请再次输入新密码"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    💾 保存更改
                  </button>
                  <button type="button" className="cancel-btn" onClick={handleCancel}>
                    ❌ 取消
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* 统计信息 */}
          <div className="profile-section">
            <h2>我的数据</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-content">
                  <div className="stat-label">文章总数</div>
                  <div className="stat-value">0</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                  <div className="stat-label">学习笔记</div>
                  <div className="stat-value">0</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-label">待办事项</div>
                  <div className="stat-value">0</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏷️</div>
                <div className="stat-content">
                  <div className="stat-label">标签数量</div>
                  <div className="stat-value">0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
