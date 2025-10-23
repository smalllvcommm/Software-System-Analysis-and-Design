import { useState, useEffect, useRef } from 'react';
import { fetchArticles, fetchAllSubjects } from '../../api/index.ts';
import type { Article, Subject } from '../../types/index';

// 导入拆分后的组件
import Banner from '../../components/Home/Banner';
import ArticleList from '../../components/Home/ArticleList';
import Sidebar from '../../components/Home/Sidebar';
import Pagination from '../../components/Pagination';
import './css/Home.css';

export default function Home() {
  // 核心数据状态
  const [articles, setArticles] = useState<Article[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeSubjectId, setActiveSubjectId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 分页状态
  const sizeOptions = [10, 20, 50, 100];
  const initialSize = 10;
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(initialSize);
  const [total, setTotal] = useState(0);

  // 滚动位置记录
  const scrollPositionRef = useRef<number>(0);

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        scrollPositionRef.current = window.scrollY;
        
        // 并行请求数据
        const [articlesResponse, subjectsResponse] = await Promise.all([
          fetchArticles({ 
            page,
            size,
            subjectId: activeSubjectId || undefined
          }),
          fetchAllSubjects()
        ]);
        
        setArticles(articlesResponse.content || []);
        setTotal(articlesResponse.totalElements || 0);
        setSubjects(subjectsResponse.data || []);
      } catch (err) {
        console.error('加载数据失败:', err);
      } finally {
        setLoading(false);
        window.scrollTo(0, scrollPositionRef.current);
      }
    };

    loadData();
  }, [page, size, activeSubjectId]);

  // 处理分页变更
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // 处理每页条数变更
  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(0);
  };

  if (loading && articles.length === 0) {
    return <div className="loading-container">加载中...</div>;
  }

  return (
    <div className="home-container">
      {/* 轮播Banner组件 */}
      <Banner />

      {/* 主内容区 */}
      <main className="main-content container">
        <div className="content-wrapper">
          {/* 左侧文章列表区域 */}
          <section className="articles-section">
            {/* 文章列表组件 */}
            <ArticleList 
              articles={articles}
              subjects={subjects}
              activeSubjectId={activeSubjectId}
              setActiveSubjectId={setActiveSubjectId}
              setPage={setPage}
              loading={loading}
            />

            {/* 分页组件 */}
            {total > 0 && (
              <Pagination 
                page={page}
                size={size}
                total={total}
                sizeOptions={sizeOptions}
                onPageChange={handlePageChange}
                onSizeChange={handleSizeChange}
                loading={loading}
              />
            )}
          </section>

          {/* 右侧边栏组件 */}
          <Sidebar />
        </div>
      </main>

      {/* 页脚组件 */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-col">
              <h3>学知堂</h3>
              <p>构建你的知识体系，让学习更高效</p>
            </div>
            <div className="footer-col">
              <h4>快速链接</h4>
              <ul>
                <li><a href="/">首页</a></li>
                <li><a href="/study">学习资源</a></li>
                <li><a href="/articles">文章</a></li>
                <li><a href="/about">关于我们</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>联系我们</h4>
              <ul>
                <li>邮箱：contact@xuezhitang.com</li>
                <li>微信：xuezhitang2024</li>
              </ul>
            </div>
          </div>
          <div className="copyright">
            © {new Date().getFullYear()} 学知堂 版权所有
          </div>
        </div>
      </footer>
    </div>
  );
}