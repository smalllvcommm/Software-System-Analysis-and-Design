import logo from '../../assets/logo.png';
import banner from '../../assets/banner.jpg';
import './css/Home.css';

export default function Home() {

  // 平滑滚动到指定section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-home">
      {/* Hero Section - 首屏 */}
      <section className="hero-section-fullscreen" style={{ backgroundImage: `url(${banner})` }}>
        <div className="hero-container-center">
          {/* Logo和标题 - 横向 */}
          <div className="hero-branding-horizontal">
            <img src={logo} alt="Logo" className="hero-logo" />
            <h1 className="hero-title">微云记</h1>
          </div>
          
          {/* 介绍 */}
          <p className="hero-description">
            一站式管理您的学习资源、备忘录、多媒体文件和个人计划
          </p>

          {/* 快速导航卡片 */}
          <div className="quick-nav-grid">
            <div className="nav-card-small" onClick={() => scrollToSection('features')}>
              <span className="nav-icon-small">🎯</span>
              <div className="nav-text">
                <h4>核心功能</h4>
                <p>探索强大的管理工具</p>
              </div>
            </div>

            <div className="nav-card-small" onClick={() => scrollToSection('tech')}>
              <span className="nav-icon-small">⚙️</span>
              <div className="nav-text">
                <h4>技术架构</h4>
                <p>了解我们的技术栈</p>
              </div>
            </div>

            <div className="nav-card-small" onClick={() => scrollToSection('about')}>
              <span className="nav-icon-small">💡</span>
              <div className="nav-text">
                <h4>关于我们</h4>
                <p>认识微云记团队</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 核心功能 - 全屏 */}
      <section id="features" className="fullscreen-section features-section-full">
        <div className="section-content">
          <div className="section-header-center">
            <h2 className="section-title-large">核心功能</h2>
            <p className="section-subtitle-large">强大而完整的信息管理工具集</p>
          </div>

          <div className="features-grid-large">
            <div className="feature-card-large">
              <span className="feature-icon-large">📝</span>
              <h3>文章管理</h3>
              <p>富文本编辑与Markdown支持</p>
            </div>

            <div className="feature-card-large">
              <span className="feature-icon-large">📌</span>
              <h3>备忘录</h3>
              <p>快速记录灵感和待办</p>
            </div>

            <div className="feature-card-large">
              <span className="feature-icon-large">🎵</span>
              <h3>多媒体</h3>
              <p>音视频文件整理管理</p>
            </div>

            <div className="feature-card-large">
              <span className="feature-icon-large">🔖</span>
              <h3>网站收藏</h3>
              <p>分类管理常用链接</p>
            </div>

            <div className="feature-card-large">
              <span className="feature-icon-large">💰</span>
              <h3>支出记录</h3>
              <p>记录消费统计分析</p>
            </div>

            <div className="feature-card-large">
              <span className="feature-icon-large">✈️</span>
              <h3>旅行计划</h3>
              <p>规划行程记录旅途</p>
            </div>

            <div className="feature-card-large">
              <span className="feature-icon-large">📚</span>
              <h3>学习打卡</h3>
              <p>记录进度养成习惯</p>
            </div>

            <div className="feature-card-large">
              <span className="feature-icon-large">🏷️</span>
              <h3>分类标签</h3>
              <p>统一分类井井有条</p>
            </div>
          </div>

          <div className="scroll-hint" onClick={() => scrollToSection('tech')}>
            <span>继续探索</span>
            <div className="scroll-arrow">↓</div>
          </div>
        </div>
      </section>

      {/* 技术架构 - 全屏 */}
      <section id="tech" className="fullscreen-section tech-section-full">
        <div className="section-content">
          <div className="section-header-center">
            <h2 className="section-title-large">技术架构</h2>
            <p className="section-subtitle-large">采用现代化的全栈技术</p>
          </div>

          <div className="tech-grid-large">
            <div className="tech-card-large">
              <h3>前端技术</h3>
              <div className="tech-stack-group">
                <div className="tech-item">
                  <span className="tech-icon">⚛️</span>
                  <div>
                    <h4>React 19</h4>
                    <p>现代化UI框架</p>
                  </div>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">📘</span>
                  <div>
                    <h4>TypeScript</h4>
                    <p>类型安全的JavaScript</p>
                  </div>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">⚡</span>
                  <div>
                    <h4>Vite</h4>
                    <p>极速开发构建工具</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="tech-card-large">
              <h3>后端技术</h3>
              <div className="tech-stack-group">
                <div className="tech-item">
                  <span className="tech-icon">🍃</span>
                  <div>
                    <h4>Spring Boot 3</h4>
                    <p>企业级Java框架</p>
                  </div>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">🔒</span>
                  <div>
                    <h4>Spring Security</h4>
                    <p>安全认证授权</p>
                  </div>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">🎫</span>
                  <div>
                    <h4>JWT</h4>
                    <p>无状态身份验证</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="tech-card-large">
              <h3>数据存储</h3>
              <div className="tech-stack-group">
                <div className="tech-item">
                  <span className="tech-icon">🗄️</span>
                  <div>
                    <h4>MySQL 8</h4>
                    <p>关系型数据库</p>
                  </div>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">📊</span>
                  <div>
                    <h4>JPA/Hibernate</h4>
                    <p>对象关系映射</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="scroll-hint" onClick={() => scrollToSection('about')}>
            <span>了解更多</span>
            <div className="scroll-arrow">↓</div>
          </div>
        </div>
      </section>

      {/* 关于我们 - 全屏 */}
      <section id="about" className="fullscreen-section about-section-full">
        <div className="section-content">
          <div className="section-header-center">
            <h2 className="section-title-large">关于我们</h2>
            <p className="section-subtitle-large">让信息管理变得简单而高效</p>
          </div>

          <div className="about-content-large">
            <div className="about-text-large">
              <p>
                微云记致力于为每个人提供一个简单、高效、强大的信息管理平台，
                帮助用户整合分散的信息资源，构建个性化的知识体系。
              </p>
              <p>
                在这个信息爆炸的时代，我们相信每个人都需要一个属于自己的信息中心。
                本系统采用现代化的前后端分离架构，为用户提供稳定、安全、高效的服务。
              </p>
            </div>

            <div className="about-stats-large">
              <div className="stat-card-large">
                <div className="stat-number-large">10+</div>
                <div className="stat-label-large">管理模块</div>
              </div>
              <div className="stat-card-large">
                <div className="stat-number-large">100%</div>
                <div className="stat-label-large">数据掌控</div>
              </div>
              <div className="stat-card-large">
                <div className="stat-number-large">24/7</div>
                <div className="stat-label-large">随时访问</div>
              </div>
            </div>

            <div className="contact-info-large">
              <h3>联系我们</h3>
              <div className="contact-methods">
                <div className="contact-method">
                  <span className="contact-icon-large">📧</span>
                  <div>
                    <h4>邮箱</h4>
                    <p>smallvnb@163.com</p>
                  </div>
                </div>
                <div className="contact-method">
                  <span className="contact-icon-large">💬</span>
                  <div>
                    <h4>微信</h4>
                    <p>19862205683</p>
                  </div>
                </div>
                <div className="contact-method">
                  <span className="contact-icon-large">🐧</span>
                  <div>
                    <h4>QQ</h4>
                    <p>3124944261</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 页脚 */}
        <div className="simple-footer">
          <p>© {new Date().getFullYear()} 微云记. 保留所有权利.</p>
        </div>
      </section>
    </div>
  );
}
