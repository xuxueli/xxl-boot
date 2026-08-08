/**
 * 组件：TagsView（多标签页）
 * 功能：顶部多标签页管理，支持标签切换、关闭、刷新、全屏显示，以及右键/下拉菜单操作。
 *       支持 card 和 chrome 两种标签样式。
 */
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { LeftOutlined, RightOutlined, DownOutlined, ReloadOutlined } from '@ant-design/icons'
import { useAliveController } from 'react-activation'
import ScrollPane, { type ScrollPaneHandle } from './ScrollPane'
import SvgIcon from '@/components/SvgIcon'
import { getNormalPath } from '@/utils/common'
import { useTagsViewStore, useRoutesStore, useSettingsStore } from '@/stores'
import type { TagView } from '@/stores/tagsView'
import type { RouteData } from '@/stores/routes'
import tab from '@/utils/tab'
import defaultSettings from '@/default-settings'
import './tagsView.scss'

/**
 * 多标签页
 */
export default function TagsView() {
  const location = useLocation()
  const navigate = useNavigate()
  const tagsViewStore = useTagsViewStore()
  const routesStore = useRoutesStore()
  const settingsStore = useSettingsStore()
  const { refresh } = useAliveController()

  // 右键上下文菜单
  const [visible, setVisible] = useState(false)
  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)
  const [selectedTag, setSelectedTag] = useState<Record<string, any>>({})
  // 持久化固定标签
  const affixTagsRef = useRef<any[]>([])
  const scrollPaneRef = useRef<ScrollPaneHandle>(null)
  // 左右箭头状态
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  // 页内全屏状态
  const [isFullscreen, setIsFullscreen] = useState(false)
  const hiddenElementsRef = useRef<{ el: HTMLElement | null; originalDisplay: string }[]>([])

  const visitedViews = tagsViewStore.visitedViews
  const theme = settingsStore.theme
  const tagsIcon = settingsStore.tagsIcon
  const tagsViewPersist = settingsStore.tagsViewPersist
  const tagsViewStyle = settingsStore.tagsViewStyle

  // 当前路由
  const route = {
    path: location.pathname,
    fullPath: location.pathname + location.search,
    name: location.pathname,
    query: Object.fromEntries(new URLSearchParams(location.search).entries())
  }

  // 下拉菜单针对当前激活的 tag
  const selectedDropdownTag = visitedViews.find((v) => isActive(v)) || ({} as TagView)

  /*
   * 路由变化时添加新标签并滚动到当前标签
   */
  useEffect(() => {
    addTags()
    moveToCurrentTag()
     
  }, [location.pathname, location.search])

  /*
   * 右键菜单显隐时切换 body 点击监听
   */
  useEffect(() => {
    const closeMenu = () => setVisible(false)
    if (visible) {
      document.body.addEventListener('click', closeMenu)
    } else {
      document.body.removeEventListener('click', closeMenu)
    }
    return () => {
      document.body.removeEventListener('click', closeMenu)
    }
  }, [visible])

  /*
   * visitedViews 变化后更新箭头状态
   */
  useEffect(() => {
    setTimeout(() => updateArrowState(), 0)
  }, [visitedViews])

  /*
   * 挂载：初始化固定标签 + 持久化恢复 + 监听窗口
   */
  useEffect(() => {
    initTags()
    window.addEventListener('resize', updateArrowState)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('resize', updateArrowState)
      window.removeEventListener('keydown', handleKeyDown)
    }
     
  }, [])

  /*
   * Esc 退出全屏
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isFullscreen) {
      toggleFullscreen()
    }
  }

  /*
   * 当前路由是否为标签页
   */
  function isActive(r: Record<string, any>) {
    return r.path === route.path
  }

  /*
   * 激活标签高亮样式（card 模式下）
   */
  function tagActiveStyle(tag: Record<string, any>): React.CSSProperties {
    if (!isActive(tag) || tagsViewStyle !== 'card') return {}
    return {
      backgroundColor: theme,
      borderColor: theme
    }
  }

  /*
   * 是否为固定标签（不可关闭）
   */
  function isAffix(tag: Record<string, any>) {
    return tag && tag.meta && tag.meta.affix
  }

  /*
   * 是否为最左标签
   */
  function isFirstView() {
    try {
      const tag = selectedTag && selectedTag.fullPath ? selectedTag : selectedDropdownTag
      return tag.fullPath === defaultSettings.homePath || tag.fullPath === visitedViews[1]?.fullPath
    } catch (err) {
      return false
    }
  }

  /*
   * 是否为最右标签
   */
  function isLastView() {
    try {
      const tag = selectedTag && selectedTag.fullPath ? selectedTag : selectedDropdownTag
      return tag.fullPath === visitedViews[visitedViews.length - 1]?.fullPath
    } catch (err) {
      return false
    }
  }

  /*
   * 递归收集带 affix 标记的固定标签（首页/特殊页面）
   */
  function filterAffixTags(routes: RouteData[], basePath = ''): TagView[] {
    let tags: TagView[] = []
    routes.forEach((route) => {
      if (route.meta && route.meta.affix) {
        const tagPath = route.path!.startsWith('/') ? getNormalPath(route.path!) : getNormalPath(basePath + '/' + route.path!)
        tags.push({
          fullPath: tagPath,
          path: tagPath,
          name: route.name,
          meta: { ...route.meta }
        })
      }
      if (route.children) {
        const tempTags = filterAffixTags(route.children, route.path)
        if (tempTags.length >= 1) {
          tags = [...tags, ...tempTags]
        }
      }
    })
    return tags
  }

  /*
   * 初始化：持久化恢复 + 固定标签注册
   */
  function initTags() {
    if (tagsViewPersist) {
      tagsViewStore.loadPersistedViews()
    }
    const res = filterAffixTags(routesStore.fullRoutes)
    affixTagsRef.current = res
    for (const tag of res) {
      if (tag.name) {
        tagsViewStore.addAffixView(tag)
      }
    }
  }

  /*
   * 当前路由加入标签页
   */
  function addTags() {
    const title = findTitle(route.path)
    if (route.path) {
      tagsViewStore.addView({ path: route.path, fullPath: route.fullPath, name: route.path, query: route.query, meta: { title } })
    }
  }

  /*
   * 滚动到当前标签，同步路由更新
   */
  function moveToCurrentTag() {
    setTimeout(() => {
      for (const r of visitedViews) {
        if (r.path === route.path) {
          scrollPaneRef.current?.moveToTarget(r)
          if (r.fullPath !== route.fullPath) {
            tagsViewStore.updateVisitedView({ ...route, meta: { title: r.title } })
          }
        }
      }
    }, 0)
  }

  /*
   * 左 / 右箭头滚动标签栏
   */
  const scrollLeft = () => {
    if (!canScrollLeft) return
    scrollPaneRef.current?.scrollToStart()
  }

  const scrollRight = () => {
    if (!canScrollRight) return
    scrollPaneRef.current?.scrollToEnd()
  }

  /*
   * 更新左右箭头可用状态
   */
  function updateArrowState() {
    setTimeout(() => {
      if (scrollPaneRef.current) {
        const state = scrollPaneRef.current.getScrollState()
        setCanScrollLeft(state.canLeft)
        setCanScrollRight(state.canRight)
      }
    }, 0)
  }

  /*
   * 全屏模式：隐藏 navbar/sidebar 使内容区占满视口
   */
  function toggleFullscreen() {
    const mainContainer = document.querySelector<HTMLElement>('.main-container')
    const navbar = document.querySelector<HTMLElement>('.navbar')
    const sidebar = document.querySelector<HTMLElement>('.sidebar-container')
    if (!mainContainer) return

    if (!isFullscreen) {
      mainContainer.classList.add('fullscreen-mode')
      document.body.style.overflow = 'hidden'
      const elementsToHide = [
        { el: navbar, originalDisplay: navbar?.style.display || '' },
        { el: sidebar, originalDisplay: sidebar?.style.display || '' }
      ]
      const hidden: { el: HTMLElement | null; originalDisplay: string }[] = []
      elementsToHide.forEach((item) => {
        if (item.el && item.el.style.display !== 'none') {
          item.originalDisplay = item.el.style.display
          item.el.style.display = 'none'
          hidden.push(item)
        }
      })
      hiddenElementsRef.current = hidden
      setIsFullscreen(true)
    } else {
      mainContainer.classList.remove('fullscreen-mode')
      document.body.style.overflow = ''
      hiddenElementsRef.current.forEach((item) => {
        if (item.el) {
          item.el.style.display = item.originalDisplay
        }
      })
      hiddenElementsRef.current = []
      setIsFullscreen(false)
    }
  }

  /*
   * 下拉菜单命令分发
   */
  const handleDropdownCommand = (command: string) => {
    const tag = selectedDropdownTag
    setSelectedTag(tag)
    switch (command) {
      case 'refresh':
        refreshSelectedTag(tag)
        break
      case 'fullscreen':
        toggleFullscreen()
        break
      case 'close':
        closeSelectedTag(tag)
        break
      case 'closeOthers':
        closeOthersTags()
        break
      case 'closeLeft':
        closeLeftTags()
        break
      case 'closeRight':
        closeRightTags()
        break
      case 'closeAll':
        closeAllTags(tag)
        break
    }
  }

  /*
   * 刷新指定标签页（react-activation refresh 重挂载）
   */
  const refreshSelectedTag = (view: Record<string, any>) => {
    if (view.path && view.path.startsWith('/redirect/')) return
    // 刷新：销毁并重建对应 KeepAlive 缓存节点
    refresh(view.path)
  }

  /*
   * 关闭标签：若关闭的是当前标签则跳转到最后标签
   */
  const closeSelectedTag = (view: Record<string, any>) => {
    tab.closePage(view).then(() => {
      if (isActive(view)) {
        toLastView(tagsViewStore.visitedViews, view)
      }
    })
  }

  /*
   * 关闭右侧标签，若当前标签被关则回退
   */
  const closeRightTags = () => {
    tab.closeRightPage(selectedTag).then(() => {
      if (!tagsViewStore.visitedViews.find((i) => i.fullPath === route.fullPath)) {
        toLastView(tagsViewStore.visitedViews)
      }
    })
  }

  /*
   * 关闭左侧标签，若当前标签被关则回退
   */
  const closeLeftTags = () => {
    tab.closeLeftPage(selectedTag).then(() => {
      if (!tagsViewStore.visitedViews.find((i) => i.fullPath === route.fullPath)) {
        toLastView(tagsViewStore.visitedViews)
      }
    })
  }

  /*
   * 关闭其他标签：先跳转到目标标签再关闭其他
   */
  const closeOthersTags = () => {
    navigate(selectedTag.path || '/')
    tab.closeOtherPage(selectedTag).then(() => {
      moveToCurrentTag()
    })
  }

  /*
   * 关闭全部标签（固定标签保留），若当前页被关则回退
   */
  const closeAllTags = (view: Record<string, any>) => {
    tab.closeAllPage().then(() => {
      if (affixTagsRef.current.some((tag) => tag.path === route.path)) {
        return
      }
      toLastView(tagsViewStore.visitedViews, view)
    })
  }

  /*
   * 跳转到最后标签。无标签时：Dashboard 走 redirect 刷新，其他跳首页
   */
  function toLastView(visited: TagView[], view?: Record<string, any>) {
    const latestView = visited.slice(-1)[0]
    if (latestView) {
      navigate(latestView.fullPath || '/')
    } else {
      if (view && view.name === 'Dashboard') {
        navigate('/redirect' + view.fullPath, { replace: true })
      } else {
        navigate('/')
      }
    }
  }

  /*
   * 右键菜单：记录位置和选中标签
   */
  const openMenu = (tag: Record<string, any>, e: React.MouseEvent) => {
    setLeft(e.clientX)
    setTop(e.clientY)
    setVisible(true)
    setSelectedTag(tag)
  }

  /*
   * 滚动时关闭右键菜单，更新箭头状态
   */
  const handleScroll = () => {
    setVisible(false)
    updateArrowState()
  }

  // 下拉菜单项
  const dropdownItems: MenuProps['items'] = [
    ...(!isAffix(selectedDropdownTag) ? [{ key: 'close', label: <span><SvgIcon iconClass="close" /> 关闭当前</span> }] : []),
    { key: 'closeOthers', label: <span>关闭其他</span> },
    { key: 'closeLeft', label: <span>关闭左侧</span>, disabled: isFirstView() },
    { key: 'closeRight', label: <span>关闭右侧</span>, disabled: isLastView() },
    { key: 'closeAll', label: <span>全部关闭</span> },
    { key: 'fullscreen', label: <span>{isFullscreen ? '退出全屏' : '全屏显示'}</span> }
  ]

  return (
    <div id="tags-view-container" className={`tags-view-container ${tagsViewStyle === 'chrome' ? 'tags-view-container--chrome' : ''}`}>
      {/* 左箭头 */}
      <span className={`tags-nav-btn tags-nav-btn--left ${canScrollLeft ? '' : 'disabled'}`} onClick={scrollLeft}>
        <LeftOutlined />
      </span>

      {/* scroll pane */}
      <ScrollPane ref={scrollPaneRef} className="tags-view-wrapper" onScroll={handleScroll} onUpdateArrows={updateArrowState}>
        {visitedViews.map((tag) => (
          <Link
            key={tag.path}
            to={{ pathname: tag.path, search: tag.query ? toSearchString(tag.query) : '' }}
            data-path={tag.path}
            className={`tags-view-item ${isActive(tag) ? 'active' : ''} ${tagsIcon ? 'has-icon' : ''}`}
            style={tagActiveStyle(tag)}
            onAuxClick={(e) => {
              if (e.button === 1 && !isAffix(tag)) {
                closeSelectedTag(tag)
              }
            }}
            onContextMenu={(e) => {
              e.preventDefault()
              openMenu(tag, e)
            }}
          >
            {/* icon */}
            {!!(tagsIcon && tag.meta && tag.meta.icon && tag.meta.icon !== '#') && (
              <SvgIcon iconClass={String(tag.meta.icon)} style={{ marginRight: 3 }} />
            )}
            {/* title */}
            {tag.title}
            {/* close */}
            {!isAffix(tag) && (
              <span
                className="tags-close-btn"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  closeSelectedTag(tag)
                }}
              >
                <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
                </svg>
              </span>
            )}
          </Link>
        ))}
      </ScrollPane>

      {/* 右箭头 */}
      <span className={`tags-nav-btn tags-nav-btn--right ${canScrollRight ? '' : 'disabled'}`} onClick={scrollRight}>
        <RightOutlined />
      </span>

      {/* 下拉操作菜单 */}
      <Dropdown menu={{ items: dropdownItems, onClick: ({ key }) => handleDropdownCommand(key) }} trigger={['click']} placement="bottomRight">
        <span className="tags-action-btn">
          <DownOutlined />
        </span>
      </Dropdown>

      {/* 刷新按钮 */}
      <span className="tags-action-btn tags-refresh-btn" title="刷新页面" onClick={() => refreshSelectedTag(selectedDropdownTag)}>
        <ReloadOutlined /> 刷新
      </span>

      {/* 右键上下文菜单 */}
      {visible && (
        <ul style={{ left: `${left}px`, top: `${top}px` }} className="contextmenu">
          <li onClick={() => refreshSelectedTag(selectedTag)}>
            <ReloadOutlined /> 刷新页面
          </li>
          {!isAffix(selectedTag) && (
            <li onClick={() => closeSelectedTag(selectedTag)}>
              <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
              </svg>{' '}
              关闭当前
            </li>
          )}
          <li onClick={closeOthersTags}>
            <span className="contextmenu-icon" />关闭其他
          </li>
          {!isFirstView() && <li onClick={closeLeftTags}>关闭左侧</li>}
          {!isLastView() && <li onClick={closeRightTags}>关闭右侧</li>}
          <li onClick={() => closeAllTags(selectedTag)}>全部关闭</li>
        </ul>
      )}
    </div>
  )
}

/**
 * 查询参数对象转 search 字符串
 */
function toSearchString(query: Record<string, unknown>): string {
  const searchParams = new URLSearchParams()
  Object.keys(query).forEach((key) => {
    const value = query[key]
    if (value != null && value !== '') {
      searchParams.set(key, String(value))
    }
  })
  const str = searchParams.toString()
  return str ? `?${str}` : ''
}

/**
 * 查找路由标题
 */
function findTitle(path: string): string {
  const routes = useRoutesStore.getState().fullRoutes
  const stack = [...routes]
  while (stack.length > 0) {
    const route = stack.pop()
    if (!route) continue
    if (route.children && route.children.length) {
      stack.push(...(route.children as RouteData[]))
    }
    if (route.path === path) {
      return route.meta?.title || ''
    }
  }
  return ''
}
