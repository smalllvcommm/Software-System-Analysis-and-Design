import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchTags } from '../../api/apiServices';
import type { Tag } from '../../types/dataTypes';
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
    const loadTags = async () => {
      try {
        setLoading(true);
        const response = await fetchTags({ 
          page: 0,
          size: limit 
        });
        
        if (response.success) {
          setTags(response.data.content || []);
        } else {
          // 降级方案：使用默认标签数据
          setTags([
            { id: 1, name: '前端开发', Articles: [] },
            { id: 2, name: '编程学习', Articles: [] },
            { id: 3, name: '技术分享', Articles: [] },
            { id: 4, name: '学习笔记', Articles: [] },
          ]);
        }
      } catch (error) {
        console.error('加载标签失败:', error);
        // 错误处理：使用默认标签数据
        setTags([
          { id: 1, name: '前端开发', Articles: [] },
          { id: 2, name: '编程学习', Articles: [] },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadTags();
  }, [limit]);

  // 计算每个标签的文章数量
  const tagsWithCount = tags.map(tag => ({
    ...tag,
    count: tag.Articles?.length || 0
  }));

  // 获取最大文章数用于计算标签大小
  const maxCount = tagsWithCount.reduce((max, tag) => Math.max(max, tag.count), 0);

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

  if (tagsWithCount.length === 0) {
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
        {tagsWithCount.map(tag => (
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
