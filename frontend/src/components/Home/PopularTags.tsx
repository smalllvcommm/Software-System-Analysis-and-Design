import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { tagService } from '../../api'; // 导入标签服务
import type { Tag } from '../../types'; // 导入标签类型
import '../css/PopularTags.css';

interface PopularTagsProps {
  title: React.ReactNode;
  limit?: number; // 可选：限制显示数量
  showCount?: boolean; // 可选：是否显示文章数量
}

// 根据文章数量计算标签大小级别（1-5级）
const getTagSizeLevel = (count: number, maxCount: number) => {
  if (maxCount === 0) return 1;
  const ratio = count / maxCount;
  if (ratio >= 0.8) return 5;
  if (ratio >= 0.6) return 4;
  if (ratio >= 0.4) return 3;
  if (ratio >= 0.2) return 2;
  return 1;
};

export default function PopularTags({ 
  title, 
  limit = 8, 
  showCount = true 
}: PopularTagsProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 加载热门标签数据
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        // 实际项目中使用API获取数据，这里保留mock数据作为降级方案
        const response = await tagService.getList({ 
          sortBy: 'count-desc', // 按文章数量降序
          size: limit 
        });
        
        // 优先使用接口数据，失败时使用mock数据
        const tagData = response.success ? response.data.content : [
          { id: 1, name: '前端开发', count: 42, Articles: [] },
          { id: 2, name: '数据结构', count: 36, Articles: [] },
          { id: 3, name: '英语学习', count: 28, Articles: [] },
          { id: 4, name: '考研', count: 25, Articles: [] },
          { id: 5, name: 'TypeScript', count: 21, Articles: [] },
          { id: 6, name: '算法', count: 18, Articles: [] },
          { id: 7, name: '机器学习', count: 15, Articles: [] },
          { id: 8, name: '计算机网络', count: 12, Articles: [] },
        ];
        
        setTags(tagData);
      } catch (error) {
        console.error('加载标签失败:', error);
        // 错误处理：使用默认标签数据
        setTags([
          { id: 1, name: '前端开发', count: 42, Articles: [] },
          { id: 2, name: '编程学习', count: 36, Articles: [] },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [limit]);

  // 获取最大文章数用于计算标签大小
  const maxCount = tags.reduce((max, tag) => Math.max(max, tag.count), 0);

  if (loading) {
    return (
      <div className="sidebar-widget popular-tags loading">
        <h3 className="widget-title">{title}</h3>
        <div className="tags-skeleton">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="tag-skeleton"></div>
          ))}
        </div>
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="sidebar-widget popular-tags empty">
        <h3 className="widget-title">{title}</h3>
        <p className="no-tags">暂无标签数据</p>
      </div>
    );
  }

  return (
    <div className="sidebar-widget popular-tags">
      <h3 className="widget-title">{title}</h3>
      <div className="tags-cloud">
        {tags.map(tag => (
          <Link 
            key={tag.id} 
            to={`/tags/${tag.id}`}
            className={`tag-item size-${getTagSizeLevel(tag.count, maxCount)}`}
            title={`包含 ${tag.count} 篇文章`}
            onClick={(e) => {
              // 可选：添加自定义跳转逻辑
              if (tag.id === -1) {
                e.preventDefault();
                navigate('/tags/new');
              }
            }}
          >
            {tag.name}
            {showCount && (
              <span className="tag-count">({tag.count})</span>
            )}
          </Link>
        ))}
      </div>
      <Link to="/tags" className="view-all-tags">
        查看全部标签 →
      </Link>
    </div>
  );
}
