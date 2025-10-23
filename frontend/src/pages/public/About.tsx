import { Link } from 'react-router-dom';
import './css/About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>关于学习资源管理平台</h1>
        <p>一站式个人知识管理与学习辅助工具</p>
      </div>

      <div className="about-content">
        {/* 平台功能介绍 */}
        <section className="feature-section">
          <h2>核心功能</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>学科知识体系</h3>
              <p>按学科分类整理知识点，构建结构化知识框架，支持层级化浏览</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>知识卡片</h3>
              <p>碎片化记录核心概念，支持快速复习与关联查阅，强化记忆效果</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <p>详细文章内容，支持代码块、公式与图表，深入讲解知识点</p>
              <h3>深度文章</h3>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>学习计划</h3>
              <p>待办事项与学习计划管理，追踪任务完成情况，提升学习效率</p>
            </div>
          </div>
        </section>

        {/* 覆盖学科 */}
        <section className="subjects-section">
          <h2>覆盖领域</h2>
          <div className="subjects-chips">
            <span className="subject-chip">前端开发</span>
            <span className="subject-chip">后端技术</span>
            <span className="subject-chip">数据结构与算法</span>
            <span className="subject-chip">高等数学</span>
            <span className="subject-chip">线性代数</span>
            <span className="subject-chip">计算机组成原理</span>
            <span className="subject-chip">操作系统</span>
            <span className="subject-chip">计算机网络</span>
            <span className="subject-chip">考研英语</span>
            <span className="subject-chip">政治理论</span>
          </div>
        </section>

        {/* 关于作者 */}
        <section className="author-section">
          <h2>关于项目</h2>
          <div className="author-info">
            <p>
              本平台旨在打造个人化的学习资源管理系统，帮助用户整合分散的学习资料，
              构建结构化的知识体系。所有内容均为个人学习笔记整理，仅供学习参考。
            </p>
            <p>
              项目采用 React + TypeScript 开发，前端使用 React Router 进行路由管理，
              状态管理基于 Context API 与自定义 Hooks，后端采用 RESTful API 架构。
            </p>
          </div>
        </section>
      </div>

      <div className="about-footer">
        <p>© {new Date().getFullYear()} 学习资源管理平台 | 用技术记录学习，用知识武装自己</p>
        
        <div className="about-links">
          <Link to="/" className="about-link">返回首页</Link>
          <Link to="/study" className="about-link">浏览学习资源</Link>
          <Link to="/about#contact" className="about-link">联系我们</Link>
        </div>
      </div>
    </div>
  );  
};

export default About;