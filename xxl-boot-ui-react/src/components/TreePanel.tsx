/**
 * 组件：TreePanel（树形侧栏面板）
 * 功能：可折叠/拖拽调整宽度的树形侧栏，支持搜索过滤、展开/收起全部、自定义节点渲染、宽度持久化。
 * 用法：<TreePanel title="组织机构" treeData={deptOptions} onNodeClick={handleNodeClick} />
 */
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Input, Tree } from 'antd'
import type { DataNode } from 'antd/es/tree'
import { SearchOutlined, DownOutlined, UpOutlined, ReloadOutlined, FolderFilled, FileFilled } from '@ant-design/icons'
import type { ReactNode } from 'react'
import './treePanel.scss'

export interface TreePanelHandle {
  setCurrentKey: (key: any) => void
  getCurrentNode: () => any
  getCurrentKey: () => any
  setCheckedKeys: (keys: any[]) => void
  getCheckedKeys: () => any[]
  getCheckedNodes: () => any[]
  clearSearch: () => void
  filter: (value: any) => void
  resetWidth: () => void
  getCurrentWidth: () => number
  setWidth: (width: number) => void
  expandAllNodes: () => void
  collapseAllNodes: () => void
  toggleCollapsed: () => void
}

interface TreePanelProps {
  /** 树形数据 */
  treeData?: any[]
  /** 标题 */
  title?: string
  /** 标题图标 */
  titleIcon?: ReactNode
  /** 是否显示搜索框 */
  showSearch?: boolean
  /** 搜索框占位符 */
  searchPlaceholder?: string
  /** 是否默认收起侧边栏 */
  defaultCollapsed?: boolean
  /** 树配置项：children/label 字段 */
  treeProps?: Record<string, string>
  /** 节点唯一标识字段 */
  nodeKey?: string
  /** 是否在点击节点时展开或收起 */
  expandOnClickNode?: boolean
  /** 是否显示复选框 */
  showCheckbox?: boolean
  /** 是否严格的遵循父子不互相关联 */
  checkStrictly?: boolean
  /** 是否默认展开所有节点 */
  defaultExpandAll?: boolean
  /** 默认展开的节点的 key 数组 */
  defaultExpandedKeys?: Array<string | number>
  /** 默认宽度 */
  defaultWidth?: number
  /** 收起时的宽度 */
  collapsedWidth?: number
  /** 最小宽度 */
  minWidth?: number
  /** 最大宽度 */
  maxWidth?: number
  /** 本地存储的宽度 key */
  storageKey?: string
  /** 是否启用本地存储宽度 */
  enableStorage?: boolean
  /** 自定义过滤方法 */
  filterMethod?: ((value: string, data: any) => boolean) | null
  /** 自定义节点渲染 */
  renderNode?: (node: any, data: any) => ReactNode
  /** 折叠状态变化事件 */
  onCollapsedChange?: (collapsed: boolean) => void
  /** 展开全部状态变化事件 */
  onExpandedAllChange?: (expanded: boolean) => void
  /** 刷新事件 */
  onRefresh?: () => void
  /** 节点点击事件 */
  onNodeClick?: (data: any, node: any) => void
  /** 复选框选中事件 */
  onCheck?: (keys: any, checkedInfo: any) => void
  /** 节点展开事件 */
  onNodeExpand?: (data: any, node: any) => void
  /** 节点折叠事件 */
  onNodeCollapse?: (data: any, node: any) => void
  /** 搜索事件 */
  onSearch?: (value: string) => void
}

/**
 * 树形侧栏面板
 */
const TreePanel = forwardRef<TreePanelHandle, TreePanelProps>(function TreePanel(
  {
    treeData = [],
    title = '树形结构',
    titleIcon,
    showSearch = true,
    searchPlaceholder = '请输入名称',
    defaultCollapsed = false,
    treeProps = { children: 'children', label: 'label' },
    nodeKey = 'id',
    expandOnClickNode = false,
    showCheckbox = false,
    checkStrictly = false,
    defaultExpandAll = false,
    defaultExpandedKeys = [],
    defaultWidth = 220,
    collapsedWidth = 20,
    minWidth = 180,
    maxWidth = 400,
    storageKey = 'tree-sidebar-width',
    enableStorage = true,
    filterMethod = null,
    renderNode,
    onCollapsedChange,
    onExpandedAllChange,
    onRefresh,
    onNodeClick,
    onCheck,
    onNodeExpand,
    onNodeCollapse,
    onSearch
  },
  ref
) {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [sidebarWidth, setSidebarWidth] = useState(defaultCollapsed ? collapsedWidth : defaultWidth)
  const [isResizing, setIsResizing] = useState(false)
  const [expandedAll, setExpandedAll] = useState(defaultExpandAll)
  // antd Tree 受控状态
  const [expandedKeys, setExpandedKeys] = useState<any[]>([])
  const [checkedKeys, setCheckedKeysState] = useState<any[]>([])
  const [selectedKeys, setSelectedKeys] = useState<any[]>([])
  const [currentNode, setCurrentNode] = useState<any>(null)

  const startXRef = useRef(0)
  const startWidthRef = useRef(0)
  const saveWidthTimerRef = useRef<number | null>(null)
  const rafIdRef = useRef<number | null>(null)

  // 收集所有含子节点的 key（用于展开全部）
  const allParentKeys = useMemo(() => collectParentKeys(treeData, treeProps.children), [treeData, treeProps.children])

  // 节点过滤方法
  const filterTreeNode = (node: DataNode) => {
    if (!searchKeyword) return true
    if (filterMethod) {
      return filterMethod(searchKeyword, node)
    }
    const label = String((node as any)[treeProps.label] || '')
    return label.indexOf(searchKeyword) !== -1
  }

  // 挂载：恢复本地存储宽度
  useEffect(() => {
    if (!collapsed && enableStorage) {
      const savedWidth = getSavedWidth()
      if (savedWidth !== null) {
        setSidebarWidth(savedWidth)
      }
    }
     
  }, [])

  // 卸载清理
  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      if (saveWidthTimerRef.current) clearTimeout(saveWidthTimerRef.current)
    }
  }, [])

  /**
   * 获取保存的宽度
   */
  const getSavedWidth = (): number | null => {
    if (!enableStorage) return null
    try {
      const savedWidth = localStorage.getItem(storageKey)
      if (savedWidth) {
        const width = parseInt(savedWidth, 10)
        if (!isNaN(width) && width >= minWidth && width <= maxWidth) {
          return width
        }
      }
    } catch (error) {
      console.warn(`Failed to load sidebar width from storage with key ${storageKey}:`, error)
    }
    return null
  }

  /**
   * 保存宽度到本地存储
   */
  const saveWidthToStorage = () => {
    if (collapsed || !enableStorage) return
    try {
      localStorage.setItem(storageKey, sidebarWidth.toString())
    } catch (error) {
      console.warn(`Failed to save sidebar width to storage with key ${storageKey}:`, error)
    }
  }

  /**
   * 切换侧边栏收起/展开状态
   */
  const toggleCollapsed = () => {
    const next = !collapsed
    setCollapsed(next)
    if (next) {
      saveWidthToStorage()
      setSidebarWidth(collapsedWidth)
    } else {
      const savedWidth = getSavedWidth()
      setSidebarWidth(savedWidth !== null ? savedWidth : defaultWidth)
    }
    onCollapsedChange && onCollapsedChange(next)
  }

  /**
   * 展开/收起所有节点
   */
  const toggleExpandAll = () => {
    const next = !expandedAll
    setExpandedAll(next)
    if (next) {
      setExpandedKeys(allParentKeys)
    } else {
      setExpandedKeys([])
    }
    onExpandedAllChange && onExpandedAllChange(next)
  }

  const expandAllNodes = () => setExpandedKeys(allParentKeys)
  const collapseAllNodes = () => setExpandedKeys([])

  /**
   * 开始拖拽调整宽度
   */
  const startResize = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    startXRef.current = clientX
    startWidthRef.current = sidebarWidth
    if ('touches' in e) {
      document.addEventListener('touchmove', handleResizeMove as any, { passive: false })
      document.addEventListener('touchend', stopResize)
    } else {
      document.addEventListener('mousemove', handleResizeMove as any)
      document.addEventListener('mouseup', stopResize)
    }
    disableUserSelect()
  }

  const handleResizeMove = (e: MouseEvent | TouchEvent) => {
    if (!isResizing) return
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    rafIdRef.current = requestAnimationFrame(() => {
      e.preventDefault()
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const deltaX = clientX - startXRef.current
      const newWidth = startWidthRef.current + deltaX
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
      if (Math.abs(clampedWidth - sidebarWidth) >= 1) {
        setSidebarWidth(clampedWidth)
      }
    })
  }

  const stopResize = () => {
    if (!isResizing) return
    setIsResizing(false)
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
    document.removeEventListener('mousemove', handleResizeMove as any)
    document.removeEventListener('mouseup', stopResize)
    document.removeEventListener('touchmove', handleResizeMove as any)
    document.removeEventListener('touchend', stopResize)
    enableUserSelect()
    saveWidthToStorage()
  }

  const disableUserSelect = () => {
    document.body.style.userSelect = 'none'
  }
  const enableUserSelect = () => {
    document.body.style.userSelect = ''
  }

  // 搜索过滤
  const handleSearchChange = (val: string) => {
    setSearchKeyword(val)
    onSearch && onSearch(val)
  }

  // 清空搜索
  const clearSearch = () => {
    setSearchKeyword('')
  }

  // 暴露命令式方法
  useImperativeHandle(ref, () => ({
    setCurrentKey: (key: any) => {
      setSelectedKeys([key])
    },
    getCurrentNode: () => currentNode,
    getCurrentKey: () => (selectedKeys.length ? selectedKeys[0] : null),
    setCheckedKeys: (keys: any[]) => {
      if (showCheckbox) setCheckedKeysState(keys)
    },
    getCheckedKeys: () => (showCheckbox ? checkedKeys : []),
    getCheckedNodes: () => (showCheckbox ? checkedKeys : []),
    clearSearch,
    filter: (value: any) => setSearchKeyword(value),
    resetWidth: () => {
      setSidebarWidth(defaultWidth)
      saveWidthToStorage()
    },
    getCurrentWidth: () => sidebarWidth,
    setWidth: (width: number) => {
      if (typeof width === 'number' && width >= minWidth && width <= maxWidth) {
        setSidebarWidth(width)
        if (!collapsed) saveWidthToStorage()
      }
    },
    expandAllNodes,
    collapseAllNodes,
    toggleCollapsed
  }))

  // 渲染节点标题
  const renderTreeTitle = (data: any) => {
    if (renderNode) {
      return renderNode(data, data)
    }
    const hasChildren = data[treeProps.children] && data[treeProps.children].length > 0
    return (
      <span className="tree-node">
        <span className="node-icon">{hasChildren ? <FolderFilled /> : <FileFilled />}</span>
        <span className="node-label" title={String(data[treeProps.label] || '')}>
          {data[treeProps.label]}
        </span>
      </span>
    )
  }

  // 转换 antd Tree 数据（保留原始数据引用）
  const convertTreeData = (data: any[]): DataNode[] => {
    return data.map((item) => ({
      key: item[nodeKey],
      title: renderTreeTitle(item),
      ...(item[treeProps.children] && item[treeProps.children].length ? { children: convertTreeData(item[treeProps.children]) } : {})
    }))
  }

  const treeNodes = useMemo(() => convertTreeData(treeData), [treeData, nodeKey, treeProps, searchKeyword])

  return (
    <div
      className={`tree-sidebar ${collapsed ? 'collapsed' : ''} ${isResizing ? 'resizing' : ''}`}
      style={{ width: `${sidebarWidth}px` }}
    >
      {/* 树形面板：头部 */}
      <div className="tree-header">
        <span className="tree-title">
          {titleIcon}
          {title}
        </span>
        {!collapsed && (
          <div className="tree-actions">
            <span className="tree-action-icon" onClick={toggleExpandAll} title={expandedAll ? '收起全部' : '展开全部'}>
              {expandedAll ? <DownOutlined /> : <UpOutlined />}
            </span>
            <span className="tree-action-icon" onClick={() => onRefresh && onRefresh()} title="刷新">
              <ReloadOutlined />
            </span>
          </div>
        )}
      </div>

      {/* 树形面板：搜索框 */}
      {!collapsed && showSearch && (
        <div className="tree-search">
          <Input
            placeholder={searchPlaceholder}
            allowClear
            prefix={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      )}

      {/* 树形面板：内容区域 */}
      {!collapsed && (
        <div className="tree-wrap">
          <Tree
            treeData={treeNodes}
            fieldNames={{ children: 'children', title: 'title' }}
            showLine={false}
            blockNode
            expandAction={expandOnClickNode ? 'click' : false}
            filterTreeNode={filterTreeNode}
            defaultExpandAll={defaultExpandAll}
            defaultExpandedKeys={defaultExpandedKeys as any}
            expandedKeys={expandedAll ? allParentKeys : expandedKeys}
            onExpand={(keys, info) => {
              setExpandedKeys(keys as any[])
              if (info.expanded && onNodeExpand) {
                onNodeExpand(info.node, info.node)
              } else if (!info.expanded && onNodeCollapse) {
                onNodeCollapse(info.node, info.node)
              }
            }}
            selectedKeys={selectedKeys}
            onSelect={(keys, info) => {
              setSelectedKeys(keys as any[])
              if (keys.length > 0) {
                setCurrentNode(info.selectedNodes[0])
                onNodeClick && onNodeClick(info.selectedNodes[0], info.selectedNodes[0])
              }
            }}
            checkable={showCheckbox}
            checkedKeys={showCheckbox ? checkedKeys : undefined}
            onCheck={(keys, info) => {
              setCheckedKeysState(Array.isArray(keys) ? keys : (keys.checked as any[]))
              onCheck && onCheck(keys, info)
            }}
          />
        </div>
      )}

      {/* 右侧：拖动条 */}
      {!collapsed && (
        <div className={`resize-handle ${isResizing ? 'active' : ''}`} onMouseDown={startResize} onTouchStart={startResize} />
      )}

      {/* 右侧：侧边栏展开/收起按钮 */}
      <div className="collapse-button-container">
        <span className="collapse-button" onClick={toggleCollapsed} title={collapsed ? '展开' : '收起'}>
          {collapsed ? '»' : '«'}
        </span>
      </div>
    </div>
  )
})

TreePanel.displayName = 'TreePanel'
export default TreePanel

/**
 * 递归收集所有含子节点的 key
 */
function collectParentKeys(data: any[], childrenField: string): any[] {
  const keys: any[] = []
  const traverse = (list: any[]) => {
    list.forEach((item) => {
      if (item[childrenField] && item[childrenField].length > 0) {
        keys.push(item.id)
        traverse(item[childrenField])
      }
    })
  }
  traverse(data)
  return keys
}
