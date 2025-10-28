import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faTimes, 
  faChevronUp, 
  faSearch, 
  faFilter,
  faEye,
  faLock,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';

// 导入API服务
import { fetchArticles } from '../../api/apiServices';
import type { 
  Article, 
  ArticleFilterParams,
  Page,
  Category,
  Tag
 } from '../../types/dataTypes';
import './css/ArticleList.css';

const ArticleList: React.FC = () => {
  // 状态管理
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0); // API使用0-based索引
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalArticles, setTotalArticles] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  // 筛选条件 - 基于最新的ArticleFilterParams接口
  const [filters, setFilters] = useState<ArticleFilterParams>({
    status: 'ALL',
    visibility: 'ALL',
    sortBy: 'createdTime-desc',
    page: currentPage,
    size: pageSize
  });
  
  const navigate = useNavigate();

  // 滚动监听
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 获取文章列表数据
  const fetchArticleData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 构建查询参数 - 与最新的ArticleFilterParams匹配
      const params: ArticleFilterParams = {
        ...filters,
        page: currentPage,
        size: pageSize,
        // 只有当搜索文本存在时才添加，避免空字符串搜索
        ...(searchText.trim() && { searchText: searchText.trim() })
      };
      
      // 调用API获取文章列表
      const response = await fetchArticles(params);
      
      if (response.success) {
        const pageData = response.data;
        // 更新状态
        setArticles(pageData.content || []);
        setTotalArticles(pageData.totalElements || 0);
        setTotalPages(pageData.totalPages || 1);
      } else {
        setError('获取文章列表失败');
      }
    } catch (err) {
      console.error('获取文章列表失败:', err);
      setError('获取文章列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters, searchText]);

  // 初始加载和参数变化时重新加载
  useEffect(() => {
    fetchArticleData();
  }, [fetchArticleData]);

  // 处理分页 - 转换为0-based索引
  const handlePageChange = (page: number) => {
    const zeroBasedPage = page - 1;
    if (zeroBasedPage < 0 || zeroBasedPage >= totalPages) return;
    setCurrentPage(zeroBasedPage);
    setFilters(prev => ({ ...prev, page: zeroBasedPage }));
    window.scrollTo(0, 0);
  };

  // 处理每页显示数量变化
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setCurrentPage(0);
    setFilters(prev => ({ ...prev, page: 0, size: newSize }));
  };

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    setFilters(prev => ({ ...prev, page: 0 }));
  };

  // 处理筛选条件变化
  const handleFilterChange = (key: keyof ArticleFilterParams, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };

  // 返回顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 格式化日期 - 修复Invalid time value错误
  const formatDate = (dateString: string) => {
    // 检查日期字符串是否有效
    if (!dateString || typeof dateString !== 'string' || dateString.trim() === '') {
      return '日期未知';
    }
    
    try {
      const date = new Date(dateString);
      
      // 检查是否为有效日期
      if (isNaN(date.getTime())) {
        return '日期格式无效';
      }
      
      return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('日期格式化错误:', error, '日期字符串:', dateString);
      return '日期格式错误';
    }
  };

  // 获取文章状态文本
  const getStatusText = (status: Article['status']) => {
    switch (status) {
      case 'PUBLISHED': return '已发布';
      case 'UNPUBLISHED': return '草稿';
      default: return '未知';
    }
  };

  // 获取可见性文本和图标
  const getVisibilityInfo = (visibility: Article['visibility']) => {
    switch (visibility) {
      case 'PUBLIC':
        return { text: '公开', icon: <FontAwesomeIcon icon={faGlobe} /> };
      case 'PRIVATE':
        return { text: '私有', icon: <FontAwesomeIcon icon={faLock} /> };
      default:
        return { text: '未知', icon: null };
    }
  };

  // 渲染加载状态
  const renderLoading = () => (
    <div className="loading-state">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="article-card skeleton">
          <div className="skeleton-title"></div>
          <div className="skeleton-meta"></div>
          <div className="skeleton-excerpt"></div>
        </div>
      ))}
    </div>
  );

  // 渲染错误状态
  const renderError = () => (
    <div className="error-state">
      <p>{error}</p>
      <button onClick={fetchArticleData} className="retry-btn">重试</button>
    </div>
  );

  // 渲染文章列表
  const renderArticles = () => {
    if (articles.length === 0) {
      return (
        <div className="empty-state">
          <h3>没有找到相关文章</h3>
          <p>尝试调整筛选条件或搜索关键词</p>
        </div>
      );
    }

    return (
      <div className="articles-grid">
        {articles.map(article => (
          <Link 
            key={article.id} 
            to={`/articles/${article.id}`} 
            className="article-card"
          >
            <div className="article-content">
              {/* 文章状态和可见性 */}
              <div className="article-status-bar">
                <span className={`status-badge ${article.status === 'PUBLISHED' ? 'published' : 'unpublished'}`}>
                  {getStatusText(article.status)}
                </span>
                <span className="visibility-badge">
                  {getVisibilityInfo(article.visibility).icon}
                  <span>{getVisibilityInfo(article.visibility).text}</span>
                </span>
              </div>
              
              <h2 className="article-title">{article.title}</h2>
              
              {/* 文章摘要 */}
              <p className="article-excerpt">
                {article.content.length > 150 
                  ? `${article.content.substring(0, 150)}...` 
                  : article.content || '无内容'}
              </p>
              
              {/* 文章元数据 */}
              <div className="article-meta">
                <span className="article-date">{formatDate(article.createdTime)}</span>
                <span className="article-views">
                  <FontAwesomeIcon icon={faEye} /> {article.views}
                </span>
                {article.category && (
                  <span className="article-category">
                    {article.category.name}
                  </span>
                )}
              </div>
              
              {/* 标签 */}
              {article.tags && article.tags.length > 0 && (
                <div className="article-tags">
                  {article.tags.slice(0, 3).map(tag => (
                    <span key={tag.id} className="article-tag">{tag.name}</span>
                  ))}
                  {article.tags.length > 3 && (
                    <span className="more-tags">+{article.tags.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="article-list-page">
      {/* 主内容区 */}
      <main className="article-list-container">
        <div className="articles-section">
          <div className="section-header">
            <h1>文章列表</h1>
            <p>共有 {totalArticles} 篇文章</p>
          </div>

          {/* 搜索和筛选区域 */}
          <div className="filter-bar">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-group">
                <input
                  type="text"
                  placeholder="搜索文章..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
            </form>

            <div className="filter-controls">
              {/* 状态筛选 */}
              <div className="filter-group">
                <label htmlFor="status" className="filter-label">状态:</label>
                <select
                  id="status"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="filter-select"
                >
                  <option value="ALL">全部</option>
                  <option value="PUBLISHED">已发布</option>
                  <option value="UNPUBLISHED">未发布</option>
                </select>
              </div>

              {/* 可见性筛选 */}
              <div className="filter-group">
                <label htmlFor="visibility" className="filter-label">可见性:</label>
                <select
                  id="visibility"
                  value={filters.visibility}
                  onChange={(e) => handleFilterChange('visibility', e.target.value)}
                  className="filter-select"
                >
                  <option value="ALL">全部</option>
                  <option value="PUBLIC">公开</option>
                  <option value="PRIVATE">私有</option>
                </select>
              </div>

              {/* 排序方式 */}
              <div className="filter-group">
                <label htmlFor="sortBy" className="filter-label">排序:</label>
                <select
                  id="sortBy"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="filter-select"
                >
                  <option value="createdTime-desc">创建时间(新到旧)</option>
                  <option value="createdTime-asc">创建时间(旧到新)</option>
                  <option value="views-desc">浏览量(高到低)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 文章列表内容 */}
          <div className="articles-content">
            {loading ? renderLoading() : error ? renderError() : renderArticles()}
          </div>

          {/* 分页控件 */}
          {!loading && !error && totalPages > 1 && (
            <div className="pagination">
              <div className="pagination-info">
                显示 {Math.min(currentPage * pageSize + 1, totalArticles)} - 
                {Math.min((currentPage + 1) * pageSize, totalArticles)} 条，共 {totalArticles} 条
              </div>
              
              <div className="pagination-controls">
                <button
                  onClick={() => handlePageChange(currentPage)}
                  disabled={currentPage === 0}
                  className="pagination-btn"
                >
                  上一页
                </button>
                
                <div className="page-numbers">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 2) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 1 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`page-number ${(currentPage + 1) === pageNum ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 2)}
                  disabled={currentPage === totalPages - 1}
                  className="pagination-btn"
                >
                  下一页
                </button>
              </div>
              
              <div className="page-size-selector">
                <span>每页显示:</span>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="page-size-select"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 侧边栏 */}
        <aside className="sidebar">
          {/* 可以根据需要添加侧边栏内容 */}
        </aside>
      </main>

      {/* 返回顶部按钮 */}
      {showBackToTop && (
        <button
          className="back-to-top-btn"
          onClick={scrollToTop}
          aria-label="返回顶部"
        >
          <FontAwesomeIcon icon={faChevronUp} />
        </button>
      )}
    </div>
  );
};

export default ArticleList;
