import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Article, Tag } from '../../types/index';
import { fetchArticleById } from '../../api/index';
import './css/ArticleDetail.css';
import ProfileWidget from '../../components/Home/ProfileWidget';
import ArticleWithToc from '../../components/ArticleWithToc';

const ArticleDetail = () => {
  const { id } = useParams<{ id: number }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载文章详情
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchArticleDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: Article = await fetchArticleById(id);
        setArticle(response);
      } catch (err) {
        // 忽略中止请求的错误
        if (err instanceof Error && err.name!== 'AbortError') {
          console.error('文章详情请求失败:', err);
          setError('网络错误，无法加载文章详情');
        }
      } finally {
        // 只有在组件未卸载时才更新状态
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchArticleDetail();

    // 清理函数：组件卸载时取消请求
    return () => {
      controller.abort();
    };
  }, [id, navigate]);

  // 处理返回列表
  const handleBack = () => {
    navigate(-1);
  };

  // 加载状态
  if (loading) {
    return (
      <div className="article-detail-loading">
        <div className="spinner"></div>
        <p>加载文章中...</p>
      </div>
    );
  }

  // 错误状态
  if (error ||!article) {
    return (
      <div className="article-detail-error">
        <h2>😢 加载失败</h2>
        <p>{error || '文章不存在或已被删除'}</p>
        <button 
          onClick={() => navigate('/articles')} 
          className="btn-back"
          aria-label="返回文章列表"
        >
          返回文章列表
        </button>
      </div>
    );
  }

  return (
    <div className="article-detail-container">
      {/* 半屏 banner 区域，左右铺满 */}
      <div className="article-banner">
        <div className="banner-inner">
          {/* 分类和标签区域 */}
          <div className="article-cate-tag-section">
            
            
            {/* 分类小块 */}
            {article.subject && (
              <div className="subject-block">
                <span className="subject-tag">
                  📁 {article.subject.name}
                </span>
              </div>
            )}
            {/* 标签 */}
            <div className="article-tags">
              {article.tags?.length? (
                article.tags.map((tag: Tag) => (
                  <span key={tag.id} className="tag-item">
                    🏷️ {tag.name}
                  </span>
                ))
              ) : (
                <span className="no-tags">无标签</span>
              )}
            </div>
          </div>

          {/* 标题区域 */}
          <div className="article-title-section">
            <h1 className="article-title">{article.title}</h1>
          </div>

          {/* 时间等元信息区域 */}
          <div className="article-meta">
            <span className="meta-item">
              发布时间: {new Date(article.createdTime).toLocaleString()}
            </span>
            <span className="meta-item">
              最后更新: {new Date(article.updatedTime).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 文章内容和侧边栏容器，与 banner 拉开间距 */}
      <div className="content-sidebar-container">
        {/* 文章内容区域 */}
        <div className="article-content">
          {article.content? (
            <div 
              className="article-html-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <div className="empty-content">
              <p>本文暂无内容</p>
            </div>
          )}
        </div>

        {/* 侧边栏区域，可在这里添加组件 */}
        <div className="sidebar">
          {/* 示例：可以放一些推荐文章、作者信息等组件 */}
          <div className="sidebar-component">
            < ProfileWidget/>
            < ArticleWithToc
              title="文章导航"
              headingTags={['h1', 'h2']}
              containerSelector=".article-html-content"
            />
          </div>
        </div>
      </div>

      {/* 文章头部的返回按钮，可根据需求调整位置 */}
      <div className="article-header">
        <button 
          onClick={handleBack} 
          className="btn-back"
          aria-label="返回上一页"
        >
          ← 返回
        </button>
        <div className="article-status">
          <span 
            className={`status-badge ${article.status === 'PUBLISHED'? 'published' : 'unpublished'}`}
            aria-label={article.status === 'PUBLISHED'? '已发布' : '未发布'}
          >
            {article.status === 'PUBLISHED'? '已发布' : '未发布'}
          </span>
          <span 
            className={`visibility-badge ${article.visibility === 'PUBLIC'? 'public' : 'private'}`}
            aria-label={article.visibility === 'PUBLIC'? '公开' : '私有'}
          >
            {article.visibility === 'PUBLIC'? '公开' : '私有'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;