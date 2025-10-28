import { Link } from 'react-router-dom';
import type { Article, Category } from '../../types/dataTypes';
import ArticleCard from './ArticleCard';
import '../css/ArticleList.css';

interface ArticleListProps {
  articles: Article[];
  categories: Category[];
  activeCategoryId: number | null;
  setActiveCategoryId: (id: number | null) => void;
  setPage: (page: number) => void;
  loading: boolean;
}

export default function ArticleList({ 
  articles, 
  categories, 
  activeCategoryId, 
  setActiveCategoryId,
  setPage,
  loading
}: ArticleListProps) {
  // 处理分类切换
  const handleCategoryChange = (categoryId: number | null) => {
    setActiveCategoryId(categoryId);
    setPage(0);
  };

  if (articles.length === 0 && !loading) {
    return (
      <>
        {/* 分类筛选栏 */}
        <div className="section-header categories-container">
          <button 
            className={`category-item ${activeCategoryId === null ? 'active' : ''}`}
            onClick={() => handleCategoryChange(null)}
            disabled={loading}
          >
            全部
          </button>
          
          {categories.map(category => (
            <button 
              key={category.id} 
              className={`category-item ${activeCategoryId === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(activeCategoryId === category.id ? null : category.id)}
              disabled={loading}
            >
              {category.name}
            </button>
          ))}
          
          <Link to="/categories" className="view-all more-link">
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
          className={`category-item ${activeCategoryId === null ? 'active' : ''}`}
          onClick={() => handleCategoryChange(null)}
          disabled={loading}
        >
          全部
        </button>
        
        {categories.map(category => (
          <button 
            key={category.id} 
            className={`category-item ${activeCategoryId === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryChange(activeCategoryId === category.id ? null : category.id)}
            disabled={loading}
          >
            {category.name}
          </button>
        ))}
        
        <Link to="/categories" className="view-all more-link">
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
