import { Link } from 'react-router-dom';
import './css/About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Header */}
      <div className="about-hero">
        <div className="container">
          <h1>关于我们</h1>
          <p>了解个人信息管理系统的愿景与使命</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="about-content">
        <div className="container">
          {/* Mission Section */}
          <section className="about-section">
            <div className="section-icon">🎯</div>
            <h2>我们的使命</h2>
            <p className="lead-text">
              为每个人提供一个简单、高效、强大的信息管理平台，
              帮助用户整合分散的信息资源，构建个性化的知识体系。
            </p>
            <p>
              在这个信息爆炸的时代，我们相信每个人都需要一个属于自己的信息中心，
              来管理学习资料、工作文档、生活规划等各类信息。个人信息管理系统正是为此而生。
            </p>
          </section>

          {/* Features Section */}
          <section className="about-section">
            <div className="section-icon">✨</div>
            <h2>核心特色</h2>
            
            <div className="features-list">
              <div className="feature-row">
                <div className="feature-icon">🎨</div>
                <div className="feature-content">
                  <h3>现代化设计</h3>
                  <p>简洁优雅的用户界面，流畅的交互体验，让信息管理成为一种享受</p>
                </div>
              </div>

              <div className="feature-row">
                <div className="feature-icon">🔒</div>
                <div className="feature-content">
                  <h3>安全可靠</h3>
                  <p>采用JWT身份认证，数据加密传输，确保您的信息安全</p>
                </div>
              </div>

              <div className="feature-row">
                <div className="feature-icon">📱</div>
                <div className="feature-content">
                  <h3>响应式设计</h3>
                  <p>完美适配桌面、平板和移动设备，随时随地访问您的信息</p>
                </div>
              </div>

              <div className="feature-row">
                <div className="feature-icon">⚡</div>
                <div className="feature-content">
                  <h3>高效便捷</h3>
                  <p>统一的分类标签系统，强大的搜索功能，让您快速找到所需信息</p>
                </div>
              </div>

              <div className="feature-row">
                <div className="feature-icon">🔧</div>
                <div className="feature-content">
                  <h3>功能完善</h3>
                  <p>10+个管理模块，覆盖学习、工作、生活的方方面面</p>
                </div>
              </div>

              <div className="feature-row">
                <div className="feature-icon">🚀</div>
                <div className="feature-content">
                  <h3>持续更新</h3>
                  <p>我们不断优化系统性能，添加新功能，提升用户体验</p>
                </div>
              </div>
            </div>
          </section>

          {/* Technology Section */}
          <section className="about-section tech-section">
            <div className="section-icon">💻</div>
            <h2>技术架构</h2>
            <p className="lead-text">
              采用现代化的全栈开发技术，确保系统的稳定性和可扩展性
            </p>

            <div className="tech-grid">
              <div className="tech-card">
                <h3>前端技术</h3>
                <ul>
                  <li><strong>React 19</strong> - 现代化的UI框架</li>
                  <li><strong>TypeScript</strong> - 类型安全的开发体验</li>
                  <li><strong>Vite</strong> - 快速的构建工具</li>
                  <li><strong>React Router</strong> - 强大的路由管理</li>
                </ul>
              </div>

              <div className="tech-card">
                <h3>后端技术</h3>
                <ul>
                  <li><strong>Spring Boot 3</strong> - 企业级Java框架</li>
                  <li><strong>Spring Security</strong> - 安全认证</li>
                  <li><strong>JWT</strong> - 无状态身份验证</li>
                  <li><strong>JPA/Hibernate</strong> - 对象关系映射</li>
                </ul>
              </div>

              <div className="tech-card">
                <h3>数据存储</h3>
                <ul>
                  <li><strong>MySQL 8</strong> - 可靠的关系型数据库</li>
                  <li><strong>RESTful API</strong> - 标准化接口设计</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="about-section values-section">
            <div className="section-icon">💡</div>
            <h2>我们的价值观</h2>
            
            <div className="values-grid">
              <div className="value-card">
                <div className="value-number">01</div>
                <h3>用户至上</h3>
                <p>始终将用户需求放在首位，打造最佳的使用体验</p>
              </div>

              <div className="value-card">
                <div className="value-number">02</div>
                <h3>简单高效</h3>
                <p>追求简洁的设计和高效的功能，让复杂的事情变简单</p>
              </div>

              <div className="value-card">
                <div className="value-number">03</div>
                <h3>持续创新</h3>
                <p>不断探索新技术，优化产品功能，保持竞争力</p>
              </div>

              <div className="value-card">
                <div className="value-number">04</div>
                <h3>开放共享</h3>
                <p>开源精神，与社区共同成长，分享知识和经验</p>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="about-section">
            <div className="section-icon">👥</div>
            <h2>关于项目</h2>
            <p className="lead-text">
              本项目是一个个人信息管理系统，旨在帮助用户整合分散的信息资源，
              提升工作和学习效率。
            </p>
            <p>
              项目采用前后端分离架构，使用React + TypeScript构建前端界面，
              Spring Boot构建后端服务，为用户提供稳定、安全、高效的信息管理服务。
            </p>
            <p>
              如果您有任何建议或问题，欢迎通过邮箱或其他方式联系我们。
            </p>
          </section>

          {/* Contact Section */}
          <section className="about-section contact-section">
            <div className="section-icon">📧</div>
            <h2>联系我们</h2>
            
            <div className="contact-grid">
              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <h4>邮箱</h4>
                <p>info@example.com</p>
              </div>

              <div className="contact-item">
                <div className="contact-icon">💬</div>
                <h4>微信</h4>
                <p>PIM2024</p>
              </div>

              <div className="contact-item">
                <div className="contact-icon">🌐</div>
                <h4>网站</h4>
                <p>www.example.com</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* CTA Section */}
      <div className="about-cta">
        <div className="container">
          <h2>准备好开始了吗？</h2>
          <p>立即注册，体验高效的信息管理</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">
              立即注册
            </Link>
            <Link to="/" className="btn btn-secondary">
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );  
};

export default About;
