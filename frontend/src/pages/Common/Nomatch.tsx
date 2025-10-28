import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import './css/Nomatch.css';

const Nomatch = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-icon">
          <FontAwesomeIcon icon={faExclamationTriangle} size="5x" />
        </div>
        <h1 className="error-code">404</h1>
        <h2 className="error-message">页面未找到</h2>
        <p className="error-description">
          抱歉，你访问的页面不存在或已被移动
        </p>

        <div className="error-actions">
          <Link to="/" className="error-btn primary-btn">
            <FontAwesomeIcon icon={faHome} className="btn-icon" />
            返回首页
          </Link>
          <Link to="/articles" className="error-btn secondary-btn">
            <FontAwesomeIcon icon={faSearch} className="btn-icon" />
            浏览文章
          </Link>
        </div>
      </div>

      <footer className="error-footer">
        <p>检查URL是否正确，或联系管理员获取帮助</p>
      </footer>
    </div>
  );
};

export default Nomatch;
