/**
 * 组件：ScrollPane（标签页滚动容器）
 * 功能：水平滚动容器，支持滚轮/按钮滚动、平滑滚动到指定标签、自动定位目标标签完整可见
 */
import { forwardRef, useEffect, useImperativeHandle, useRef, type ReactNode } from 'react'
import { useTagsViewStore } from '@/stores'
import type { TagView } from '@/stores/tagsView'
import './tagsView.scss'

export interface ScrollPaneHandle {
  /** 滚动到目标标签使其完整可见 */
  moveToTarget: (tag: TagView) => void
  /** 滚动到最左 */
  scrollToStart: () => void
  /** 滚动到最右 */
  scrollToEnd: () => void
  /** 返回左右箭头是否可用 */
  getScrollState: () => { canLeft: boolean; canRight: boolean }
}

interface ScrollPaneProps {
  /** 内容（标签列表） */
  children?: ReactNode
  /** 额外类名 */
  className?: string
  /** 滚动事件回调 */
  onScroll?: () => void
  /** 箭头状态更新回调 */
  onUpdateArrows?: () => void
}

// 标签与相邻标签之间的间隔（px）
const tagAndTagSpacing = 4

/**
 * 标签页滚动容器
 */
const ScrollPane = forwardRef<ScrollPaneHandle, ScrollPaneProps>(function ScrollPane(
  { children, className = '', onScroll, onUpdateArrows },
  ref
) {
  const scrollWrapperRef = useRef<HTMLDivElement>(null)
  const visitedViews = useTagsViewStore((state) => state.visitedViews)

  /*
   * 滚动事件：通知父组件更新箭头状态
   */
  useEffect(() => {
    const wrap = scrollWrapperRef.current
    if (!wrap) return
    const emitScroll = () => {
      onScroll && onScroll()
      onUpdateArrows && onUpdateArrows()
    }
    wrap.addEventListener('scroll', emitScroll, true)
    return () => {
      wrap.removeEventListener('scroll', emitScroll)
    }
     
  }, [])

  /*
   * 平滑滚动到指定位置，300ms 动画
   */
  const smoothScrollTo = (target: number) => {
    const $scrollWrapper = scrollWrapperRef.current
    if (!$scrollWrapper) return
    const start = $scrollWrapper.scrollLeft
    const distance = target - start
    const duration = 300
    let startTime: number | null = null

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      $scrollWrapper.scrollLeft = ease(elapsed, start, distance, duration)
      if (elapsed < duration) {
        requestAnimationFrame(step)
      } else {
        $scrollWrapper.scrollLeft = target
        onUpdateArrows && onUpdateArrows()
      }
    }
    requestAnimationFrame(step)
  }

  /*
   * 缓动函数：easeInOutQuad
   */
  const ease = (t: number, b: number, c: number, d: number) => {
    let tt = t
    tt /= d / 2
    if (tt < 1) return (c / 2) * tt * tt + b
    tt--
    return (-c / 2) * (tt * (tt - 2) - 1) + b
  }

  /*
   * 滚轮事件：累积 scrollLeft
   */
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const eventDelta = (e as any).wheelDelta || -e.deltaY * 40
    if (scrollWrapperRef.current) {
      scrollWrapperRef.current.scrollLeft += eventDelta / 4
    }
    onUpdateArrows && onUpdateArrows()
  }

  /*
   * 将目标标签滚动到可视区域
   */
  const moveToTarget = (currentTag: TagView) => {
    const $container = scrollWrapperRef.current?.parentElement as HTMLElement
    const $scrollWrapper = scrollWrapperRef.current
    if (!$container || !$scrollWrapper) return
    const $containerWidth = $container.offsetWidth

    if (visitedViews.length === 0) return
    const firstTag = visitedViews[0]
    const lastTag = visitedViews[visitedViews.length - 1]

    /* 首尾标签直接滚动到起点/终点 */
    if (firstTag.path === currentTag.path) {
      smoothScrollTo(0)
    } else if (lastTag.path === currentTag.path) {
      smoothScrollTo($scrollWrapper.scrollWidth - $containerWidth)
    } else {
      /* 中间标签：计算前后相邻标签位置，确保目标完整可见 */
      const tagListDom = Array.from(document.getElementsByClassName('tags-view-item') as HTMLCollectionOf<HTMLElement>)
      const currentIndex = visitedViews.findIndex((item) => item.path === currentTag.path)
      let prevTag: HTMLElement | null = null
      let nextTag: HTMLElement | null = null
      for (const el of tagListDom) {
        if (el.dataset.path === visitedViews[currentIndex - 1]?.path) prevTag = el
        if (el.dataset.path === visitedViews[currentIndex + 1]?.path) nextTag = el
      }
      /* 目标超出右侧可见区 -> 向右滚；超出左侧 -> 向左滚 */
      if (nextTag && prevTag) {
        const afterNext = nextTag.offsetLeft + nextTag.offsetWidth + tagAndTagSpacing
        const beforePrev = prevTag.offsetLeft - tagAndTagSpacing
        if (afterNext > $scrollWrapper.scrollLeft + $containerWidth) {
          smoothScrollTo(afterNext - $containerWidth)
        } else if (beforePrev < $scrollWrapper.scrollLeft) {
          smoothScrollTo(beforePrev)
        }
      }
    }
  }

  /*
   * 滚动到最左 / 最右
   */
  const scrollToStart = () => {
    smoothScrollTo(0)
  }
  const scrollToEnd = () => {
    const $scrollWrapper = scrollWrapperRef.current
    if (!$scrollWrapper) return
    smoothScrollTo($scrollWrapper.scrollWidth - $scrollWrapper.clientWidth)
  }

  /*
   * 返回左右箭头是否可用
   */
  const getScrollState = () => {
    const $scrollWrapper = scrollWrapperRef.current
    if (!$scrollWrapper) {
      return { canLeft: false, canRight: false }
    }
    return {
      canLeft: $scrollWrapper.scrollLeft > 0,
      canRight: $scrollWrapper.scrollLeft < $scrollWrapper.scrollWidth - $scrollWrapper.clientWidth - 1
    }
  }

  // 暴露命令式方法
  useImperativeHandle(ref, () => ({
    moveToTarget,
    scrollToStart,
    scrollToEnd,
    getScrollState
  }))

  return (
    <div className={`tags-scroll-container ${className}`} onWheel={handleWheel}>
      <div ref={scrollWrapperRef} className="tags-scroll-wrap">
        {children}
      </div>
    </div>
  )
})

export default ScrollPane
