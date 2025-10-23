import { Link } from 'react-router-dom';
import '../css/RecentArticles.css';

interface RecentArticlesProps {
  title: React.ReactNode;
}

// 实际项目中可以通过API获取数据
const mockRecentArticles = [
  { id: '1', title: 'TypeScript高级类型技巧', date: '2024-06-18', link: '/articles/ts-advanced' },
  { id: '2', title: '英语阅读理解高分策略', date: '2024-06-16', link: '/articles/english-reading' },
  { id: '3', title: '数据结构：二叉树遍历详解', date: '2024-06-14', link: '/articles/binary-tree' },
];

export default function RecentArticles({ title }: RecentArticlesProps) {
  return (
    <div className="sidebar-widget recent-articles">
      <h3 className="widget-title">{title}</h3>
      <ul className="recent-articles-list">
        {mockRecentArticles.map(article => (
          <li key={article.id}>
            <Link to={article.link} className="article-link">
              <span className="article-title">{article.title}</span>
              <span className="article-date">{article.date}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}