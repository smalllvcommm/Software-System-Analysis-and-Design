import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchArticles } from '../../api/apiServices';
import type { Article } from '../../types/dataTypes';
import '../css/RecentArticles.css';

interface RecentArticlesProps {
  title: React.ReactNode;
  limit?: number;
}

export default function RecentArticles({ title, limit = 5 }: RecentArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecentArticles = async () => {
      try {
        setLoading(true);
        const response = await fetchArticles({
          page: 0,
          size: limit,
          sortBy: 'createdTime-desc'
        });
        
        if (response.success) {
          setArticles(response.data.content || []);
        } else {
          // 降级方案：使用模拟数据
          setArticles([
            { 
              id: 1, 
              title: 'TypeScript高级类型技巧', 
              createdTime: '2024-06-18T10:00:00',
              status: 'PUBLISHED',
              visibility: 'PUBLIC',
              views: 0,
              content: '',
              updatedTime: '',
              category: null,
              tags: []
            },
            { 
              id: 2, 
              title: '英语阅读理解高分策略', 
              createdTime: '2024-06-16T14:30:00',
              status: 'PUBLISHED',
              visibility: 'PUBLIC',
              views: 0,
              content: '',
              updatedTime: '',
              category: null,
              tags: []
            },
            { 
              id: 3, 
              title: '数据结构：二叉树遍历详解', 
              createdTime: '2024-06-14T09:15:00',
              status: 'PUBLISHED',
              visibility: 'PUBLIC',
              views: 0,
              content: '',
              updatedTime: '',
              category: null,
              tags: []
            },
          ]);
        }
      } catch (error) {
        console.error('加载最近文章失败:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecentArticles();
  }, [limit]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="sidebar-widget recent-articles loading">
        <h3 className="widget-title">{title}</h3>
        <div className="articles-skeleton">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="article-skeleton">
              <div className="title-skeleton"></div>
              <div className="date-skeleton"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="sidebar-widget recent-articles empty">
        <h3 className="widget-title">{title}</h3>
        <p className="no-articles">暂无文章数据</p>
      </div>
    );
  }

  return (
    <div className="sidebar-widget recent-articles">
      <h3 className="widget-title">{title}</h3>
      <ul className="recent-articles-list">
        {articles.map(article => (
          <li key={article.id}>
            <Link to={`/articles/${article.id}`} className="article-link">
              <span className="article-title" title={article.title}>
                {article.title.length > 30 
                  ? `${article.title.slice(0, 30)}...` 
                  : article.title}
              </span>
              <span className="article-date">{formatDate(article.createdTime)}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/articles" className="view-all-articles">
        查看全部文章 →
      </Link>
    </div>
  );
}
