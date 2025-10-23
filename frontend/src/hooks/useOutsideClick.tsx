// src/hooks/useOutsideClick.ts
import { useEffect, useRef } from 'react';

/**
 * 点击外部关闭钩子
 * @param ref - 目标元素的 ref
 * @param handler - 点击外部时触发的回调
 * @param listenCapturing - 是否在捕获阶段监听事件（默认 true）
 */
export function useOutsideClick(
  ref: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent) => void,
  listenCapturing = true
) {
  useEffect(() => {
    const element = ref.current;
    
    if (!element) return;

    const listener = (event: MouseEvent) => {
      // 点击目标元素或其后代不触发
      if (!element.contains(event.target as Node)) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', listener, listenCapturing);
    document.addEventListener('touchstart', listener, listenCapturing);

    return () => {
      document.removeEventListener('mousedown', listener, listenCapturing);
      document.removeEventListener('touchstart', listener, listenCapturing);
    };
  }, [ref, handler, listenCapturing]);
}