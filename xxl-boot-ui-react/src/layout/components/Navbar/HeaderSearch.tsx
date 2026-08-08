/**
 * 组件：HeaderSearch（菜单搜索）
 * 功能：顶部导航栏搜索图标，点击弹出搜索弹窗，支持按菜单标题/路径模糊搜索并跳转
 */
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Modal } from 'antd'
import type { InputRef } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Fuse from 'fuse.js'
import SvgIcon from '@/components/SvgIcon'
import { getNormalPath } from '@/utils/common'
import { isHttp } from '@/utils/validate'
import { useRoutesStore } from '@/stores'
import type { RouteData } from '@/stores/routes'
import './navbar.scss'

/** 搜索项：可搜索菜单节点 */
interface SearchItem {
  path: string
  title: string[]
  icon: string
  query?: string
}

/**
 * 菜单搜索
 */
export default function HeaderSearch() {
  const navigate = useNavigate()
  const routesStore = useRoutesStore()
  const [search, setSearch] = useState('')
  const [options, setOptions] = useState<SearchItem[]>([])
  const [searchPool, setSearchPool] = useState<SearchItem[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [show, setShow] = useState(false)
  const fuseRef = useRef<Fuse<SearchItem> | undefined>(undefined)
  const inputRef = useRef<InputRef>(null)

  // 生成搜索池 + 初始化 Fuse
  useEffect(() => {
    const pool = generateRoutes(routesStore.fullRoutes)
    setSearchPool(pool)
    fuseRef.current = new Fuse(pool, {
      shouldSort: true,
      threshold: 0.2,
      distance: 100,
      minMatchCharLength: 1,
      keys: [
        { name: 'title', weight: 0.7 },
        { name: 'path', weight: 0.3 }
      ]
    })
     
  }, [routesStore.fullRoutes])

  /*
   * 切换搜索弹窗显隐
   */
  const click = () => {
    const nextShow = !show
    setShow(nextShow)
    if (nextShow) {
      setOptions(searchPool)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  /*
   * 关闭弹窗：重置搜索状态
   */
  const close = () => {
    setSearch('')
    setOptions(searchPool)
    setShow(false)
    setActiveIndex(-1)
  }

  /*
   * 选中搜索结果：外部链接新窗口打开，内部路由跳转
   */
  const change = (val: SearchItem) => {
    const p = val.path
    if (isHttp(p)) {
      // 外部链接分支：新窗口打开
      window.open(p, '_blank')
    } else {
      // 内部路由分支：跳转
      navigate(p)
    }
    setSearch('')
    setOptions(searchPool)
    setShow(false)
  }

  /*
   * 输入关键词实时搜索：路径匹配 + Fuse 模糊匹配，合并去重
   */
  const querySearch = (query: string) => {
    setActiveIndex(-1)
    if (query !== '') {
      const q = query.toLowerCase()
      // 路径前缀匹配
      const pathMatches = searchPool.filter((item) => item.path.toLowerCase().includes(q))
      // Fuse 模糊匹配
      const fuseMatches = fuseRef.current ? fuseRef.current.search(query).map((item) => item.item) : []
      // 合并去重
      const merged = [...pathMatches]
      fuseMatches.forEach((item) => {
        if (!merged.find((m) => m.path === item.path)) {
          merged.push(item)
        }
      })
      setOptions(merged)
    } else {
      setOptions(searchPool)
    }
  }

  /*
   * 键盘上下键切换选中项
   */
  const navigateResult = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      setActiveIndex((prev) => (prev <= 0 ? options.length - 1 : prev - 1))
    } else if (direction === 'down') {
      setActiveIndex((prev) => (prev >= options.length - 1 ? 0 : prev + 1))
    }
  }

  /*
   * 回车确认选中项
   */
  const selectActiveResult = () => {
    if (options.length > 0 && activeIndex >= 0) {
      change(options[activeIndex])
    }
  }

  return (
    <div className="header-search">
      {/* 图标：搜索触发 */}
      <SvgIcon iconClass="search" className="search-icon" onClick={click} />
      {/* 搜索弹窗 */}
      <Modal open={show} width={600} closable={false} footer={null} onCancel={close} wrapClassName="header-search-modal">
        <Input
          ref={inputRef}
          size="large"
          prefix={<SearchOutlined />}
          placeholder="菜单搜索，支持标题、URL模糊查询"
          allowClear
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            querySearch(e.target.value)
          }}
          onPressEnter={selectActiveResult}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp') {
              e.preventDefault()
              navigateResult('up')
            } else if (e.key === 'ArrowDown') {
              e.preventDefault()
              navigateResult('down')
            }
          }}
        />

        {/* 搜索结果：计数 */}
        {search && options.length > 0 && (
          <div className="result-count">
            找到 <strong>{options.length}</strong> 个结果
          </div>
        )}

        {/* 搜索结果：结果列表 / 空状态 */}
        <div className="result-wrap">
          {options.length > 0 ? (
            options.map((item, index) => (
              <div
                key={item.path}
                className={`search-item ${index === activeIndex ? 'is-active' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(-1)}
                onClick={() => change(item)}
              >
                <div className="left">
                  <SvgIcon iconClass={item.icon} className="menu-icon" />
                </div>
                <div className="search-info">
                  <div className="menu-title" dangerouslySetInnerHTML={{ __html: highlightText(item.title.join(' / '), search) }} />
                  <div className="menu-path" dangerouslySetInnerHTML={{ __html: highlightText(item.path, search) }} />
                </div>
                {index === activeIndex && <SvgIcon iconClass="enter" />}
              </div>
            ))
          ) : (
            search &&
            options.length === 0 && (
              <div className="empty-state">
                <SearchOutlined className="empty-icon" />
                <p className="empty-text">
                  未找到 "<strong>{search}</strong>" 相关菜单
                </p>
                <p className="empty-tip">试试其他关键词或路径</p>
              </div>
            )
          )}
        </div>

        {/* 快捷键说明 */}
        <div className="search-footer">
          <span className="shortcut-item">
            <kbd>↑</kbd>
            <kbd>↓</kbd> 切换
          </span>
          <span className="shortcut-item">
            <kbd>↵</kbd> 选择
          </span>
          <span className="shortcut-item">
            <kbd>Esc</kbd> 关闭
          </span>
        </div>
      </Modal>
    </div>
  )
}

/**
 * 递归遍历路由树，生成可搜索列表
 */
function generateRoutes(routes: RouteData[], basePath = '', prefixTitle: string[] = []): SearchItem[] {
  let res: SearchItem[] = []
  for (const r of routes) {
    // 跳过隐藏路由
    if (r.hidden) {
      continue
    }
    const p = r.path ? (r.path.length > 0 && r.path[0] === '/' ? r.path : '/' + r.path) : ''
    const data: SearchItem = {
      path: !isHttp(r.path as string) ? getNormalPath(p) : (r.path as string),
      title: [...prefixTitle],
      icon: ''
    }
    if (r.meta && r.meta.title) {
      data.title = [...data.title, r.meta.title]
      data.icon = (r.meta.icon as string) || ''
      // 叶节点：加入搜索结果
      if (!r.children || r.children.length === 0) {
        res.push(data)
      }
    }
    if (r.query) {
      data.query = r.query as string
    }
    if (r.children) {
      const tempRoutes = generateRoutes(r.children, data.path, data.title)
      if (tempRoutes.length >= 1) {
        res = [...res, ...tempRoutes]
      }
    }
  }
  return res
}

/**
 * 高亮搜索结果中的匹配关键词
 */
function highlightText(text: string, search: string): string {
  if (!text) return ''
  if (!search) return text
  const keyword = escapeRegExp(search)
  const reg = new RegExp(`(${keyword})`, 'gi')
  return text.replace(reg, '<span class="highlight">$1</span>')
}

/**
 * 转义正则特殊字符
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
