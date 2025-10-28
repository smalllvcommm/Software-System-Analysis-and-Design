import { Link } from 'react-router-dom';
import type { Article } from '../../types/dataTypes';
import '../css/ArticleCard.css';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  // 获取分类名称
  const getCategoryName = () => {
    if (article.category) return article.category.name;
    return '未分类';
  };

  return (
    <article className="article-card">
      {/* 文章图片区域 */}
      <div className="article-image">
        <span className="article-category">{getCategoryName()}</span>
      </div>

      {/* 文章内容区域 */}
      <div className="article-content">
        <h3 className="article-title">
          <Link 
            to={`/articles/${article.id}`}
            title={article.title}
          >
            {article.title.length > 50 
              ? `${article.title.slice(0, 50)}...` 
              : article.title}
          </Link>
        </h3>

        {/* 标签显示 */}
        {article.tags && article.tags.length > 0 && (
          <div className="article-tags">
            {article.tags.slice(0, 3).map(tag => (
              <Link 
                key={tag.id || tag.name} 
                to={`/tags/${tag.id || tag.name}`}
                className="tag"
              >
                {tag.name}
              </Link>
            ))}
            {article.tags.length > 3 && (
              <span className="more-tags">+{article.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
