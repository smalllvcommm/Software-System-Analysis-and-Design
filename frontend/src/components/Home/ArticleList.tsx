import { Link } from 'react-router-dom';
import type { Article, Subject } from '../../types/index';
import ArticleCard from './ArticleCard';
import '../css/ArticleList.css';

interface ArticleListProps {
  articles: Article[];
  subjects: Subject[];
  activeSubjectId: number | null;
  setActiveSubjectId: (id: number | null) => void;
  setPage: (page: number) => void;
  loading: boolean;
}

export default function ArticleList({ 
  articles, 
  subjects, 
  activeSubjectId, 
  setActiveSubjectId,
  setPage,
  loading
}: ArticleListProps) {
  // 处理分类切换
  const handleCategoryChange = (subjectId: number | null) => {
    setActiveSubjectId(subjectId);
    setPage(0);
  };

  if (articles.length === 0 && !loading) {
    return (
      <>
        {/* 分类筛选栏 */}
        <div className="section-header categories-container">
          <button 
            className={`category-item ${activeSubjectId === null ? 'active' : ''}`}
            onClick={() => handleCategoryChange(null)}
            disabled={loading}
          >
            全部
          </button>
          
          {subjects.map(subject => (
            <button 
              key={subject.id} 
              className={`category-item ${activeSubjectId === subject.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(activeSubjectId === subject.id ? null : subject.id)}
              disabled={loading}
            >
              {subject.name}
            </button>
          ))}
          
          <Link to="/subjects" className="view-all more-link">
            更多
          </Link>
        </div>
        <div className="no-articles">
          <p>暂无推荐文章</p>
          <Link to="/articles" className="btn secondary-btn">查看所有文章</Link>
        </div>
      </>
    );
  }

  return (
    <>
      {/* 分类筛选栏 */}
      <div className="section-header categories-container">
        <button 
          className={`category-item ${activeSubjectId === null ? 'active' : ''}`}
          onClick={() => handleCategoryChange(null)}
          disabled={loading}
        >
          全部
        </button>
        
        {subjects.map(subject => (
          <button 
            key={subject.id} 
            className={`category-item ${activeSubjectId === subject.id ? 'active' : ''}`}
            onClick={() => handleCategoryChange(activeSubjectId === subject.id ? null : subject.id)}
            disabled={loading}
          >
            {subject.name}
          </button>
        ))}
        
        <Link to="/subjects" className="view-all more-link">
          更多
        </Link>
      </div>

      {/* 文章网格 */}
      <div className="articles-grid">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </>
  );
}