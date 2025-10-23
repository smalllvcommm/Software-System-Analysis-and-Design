import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../hooks/useAuth.tsx';
import './css/Login.css';


const Login = () => {
  // 状态管理
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 路由工具
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, error: authError, clearError } = useAuth();

  // 监听authError变化（来自useAuth的全局错误）
  useEffect(() => {
    setError(authError);
  }, [authError]);

  // 如果已登录，重定向到工作空间
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: string })?.from || '/workspace';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  // 表单提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    clearError(); // 清除之前的错误

    try {
      // 调用useAuth提供的login方法
      await login(username, password);
      // 登录成功后会触发isAuthenticated变化，由上面的useEffect处理重定向
    } catch (err) {
      // 错误已由useAuth捕获并设置authError，这里无需额外处理
    } finally {
      setIsSubmitting(false);
    }  
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>账户登录</h2>
            <p>登录后访问你的学习资源与个人数据</p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faUser} className="input-icon" />
                <input
                  type="text"
                  placeholder="用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="form-input with-icon"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="form-input with-icon"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                  aria-label={showPassword ? "隐藏密码" : "显示密码"}
                >
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="login-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? '登录中...' : '登录'}
            </button>
          </form>

          <div className="login-footer">
            <p>还没有账号？联系管理员创建</p>
            <Link to="/" className="back-link">
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;