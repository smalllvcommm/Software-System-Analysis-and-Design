import React, { useState, useEffect, useRef, useCallback } from 'react';
import './css/ArticleWithToc.css';

// 定义标题的类型接口
interface Heading {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
  top: number;
}

// 定义组件属性的类型接口
interface ArticleWithTocProps {
  title?: string;
  headingTags?: Array<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>;
  containerSelector?: string;
  navHeight?: number;
  sidebarSelector?: string;
  fixedThreshold?: number; // 触发固定的阈值
}

// 防抖函数，减少事件触发频率
const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
      timeout = null;
    }, wait);
  };
};

const ArticleWithToc: React.FC<ArticleWithTocProps> = ({
  title = '文章目录',
  headingTags = ['h1', 'h2', 'h3'],
  containerSelector = '',
  navHeight = 60,
  sidebarSelector = '.sidebar',
  fixedThreshold = 90 // 默认定阈值
}) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [isFixed, setIsFixed] = useState(false);
  const tocRef = useRef<HTMLDivElement>(null);
  const headingRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const originalPosition = useRef<{ top: number; width: number; left: number } | null>(null);
  const lastFixedState = useRef<boolean>(false); // 记录上一次的固定状态，防止频繁切换

  // 提取标题
  useEffect(() => {
    const container = containerSelector 
      ? document.querySelector(containerSelector) 
      : document;

    if (!container) return;

    const selector = headingTags.join(', ');
    const headingElements = container.querySelectorAll<HTMLElement>(selector);
    
    const extractedHeadings: Heading[] = Array.from(headingElements).map((heading, index) => {
      const cleanText = heading.textContent?.trim() || `Heading ${index + 1}`;
      const id = heading.id || `heading-${index}-${cleanText.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
      heading.id = id;
      
      return {
        id,
        text: cleanText,
        level: parseInt(heading.tagName.substring(1)),
        element: heading,
        top: heading.offsetTop
      };
    });

    extractedHeadings.sort((a, b) => a.top - b.top);
    setHeadings(extractedHeadings);

    if (extractedHeadings.length > 0) {
      setActiveHeadingId(extractedHeadings[0].id);
    }
  }, [headingTags, containerSelector]);

  // 记录初始位置
  useEffect(() => {
    const tocElement = tocRef.current;
    if (tocElement) {
      const rect = tocElement.getBoundingClientRect();
      originalPosition.current = {
        top: rect.top + window.scrollY, // 相对于文档顶部的位置
        width: rect.width,
        left: rect.left + window.scrollX
      };
    }
  }, []);

  // 监听滚动，更新活跃标题
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + navHeight + 100;
      
      for (let i = headings.length - 1; i >= 0; i--) {
        if (headings[i].top <= scrollPosition) {
          setActiveHeadingId(headings[i].id);
          break;
        }
      }
    };

    // 使用防抖减少触发频率
    const debouncedHandleScroll = debounce(handleScroll, 10);
    window.addEventListener('scroll', debouncedHandleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, [headings, navHeight]);

  // 处理目录固定状态
  useEffect(() => {
    if (!originalPosition.current) return;

    // 防抖处理固定状态切换，减少闪烁
    const handleFixedState = debounce(() => {
      const scrollY = window.scrollY;
      const shouldBeFixed = scrollY > (originalPosition.current!.top - fixedThreshold);
      
      // 添加微小阈值，防止在临界点频繁切换
      if (shouldBeFixed !== lastFixedState.current) {
        // 使用requestAnimationFrame确保渲染平滑
        requestAnimationFrame(() => {
          setIsFixed(shouldBeFixed);
          lastFixedState.current = shouldBeFixed;
          updateTocPosition();
        });
      }
    }, 15); // 15ms的防抖，足够减少闪烁且不影响响应性

    window.addEventListener('scroll', handleFixedState);
    window.addEventListener('resize', handleFixedState);
    
    // 初始化检查
    handleFixedState();

    return () => {
      window.removeEventListener('scroll', handleFixedState);
      window.removeEventListener('resize', handleFixedState);
    };
  }, [sidebarSelector, fixedThreshold]);

  // 更新目录位置
  const updateTocPosition = useCallback(() => {
    const tocElement = tocRef.current;
    if (!tocElement || !originalPosition.current) return;

    if (isFixed) {
      const sidebarElement = document.querySelector(sidebarSelector);
      if (sidebarElement) {
        const sidebarRect = sidebarElement.getBoundingClientRect();
        tocElement.style.left = `${sidebarRect.left + 10}px`;
        tocElement.style.width = `${sidebarRect.width - 20}px`;
      }
    } else {
      // 重置为原始位置
      tocElement.style.left = 'auto';
      tocElement.style.width = `${originalPosition.current.width}px`;
    }
  }, [isFixed, sidebarSelector]);

  // 当活跃标题变化时，自动滚动目录到可见位置
  useEffect(() => {
    if (activeHeadingId && headingRefs.current[activeHeadingId]) {
      const activeElement = headingRefs.current[activeHeadingId];
      if (activeElement && tocRef.current) {
        // 使用requestAnimationFrame确保平滑滚动
        requestAnimationFrame(() => {
          tocRef.current!.scrollTop = activeElement.offsetTop - tocRef.current!.offsetTop - 40;
        });
      }
    }
  }, [activeHeadingId]);

  // 跳转到指定标题
  const scrollToHeading = useCallback((id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const heading = headings.find(h => h.id === id);
    if (heading) {
      window.scrollTo({
        top: heading.top - navHeight,
        behavior: 'smooth'
      });
      setActiveHeadingId(id);
    }
  }, [headings, navHeight]);

  // 渲染目录项
  const renderTocItem = (heading: Heading) => {
    const indent = (heading.level - 1) * 1.2;
    
    return (
      <li key={heading.id} style={{ marginLeft: `${indent}rem` }}>
        <a
          ref={el => headingRefs.current[heading.id] = el}
          href={`#${heading.id}`}
          onClick={(e) => scrollToHeading(heading.id, e)}
          className={`toc-link ${activeHeadingId === heading.id ? 'toc-link-active' : ''}`}
        >
          {heading.text}
        </a>
      </li>
    );
  };

  return (
    <div 
      ref={tocRef} 
      className={`toc-container ${isFixed ? 'toc-fixed' : ''}`}
    >
      <div className="toc-header">
        <h2>{title}</h2>
      </div>
      
      {headings.length > 0 ? (
        <ul className="toc-list">
          {headings.map(renderTocItem)}
        </ul>
      ) : (
        <div className="toc-empty-container">
          <p className="toc-empty">未检测到标题内容</p>
        </div>
      )}
    </div>
  );
};

export default ArticleWithToc;
