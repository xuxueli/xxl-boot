/**
 * 组件：RightToolbar（表格工具栏）
 * 功能：表格页面右侧工具栏，支持搜索显隐切换（带动画）、刷新、列显隐控制（checkbox/transfer）。
 *
 * 用法：<RightToolbar showSearch={showSearch} onUpdateShowSearch={setShowSearch} onQueryTable={getList} columns={columns} />
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Checkbox, Dropdown, Modal, Tooltip, Transfer } from 'antd'
import { SearchOutlined, ReloadOutlined, MenuOutlined } from '@ant-design/icons'
import cache from '@/utils/cache'
import './rightToolbar.scss'

/** 表格列配置项类型定义 */
interface ColumnItem {
  /** 列标识 */
  key: string | number
  /** 列显示名称 */
  label: string
  /** 列是否可见 */
  visible: boolean
}

type ColumnsType = ColumnItem[] | { [key: string]: ColumnItem }

interface RightToolbarProps {
  /** "搜索区域" 是否显示（双向绑定） */
  search?: boolean
  /** "搜索区域" 当前显示状态 */
  showSearch?: boolean
  /** 搜索区域显示状态变化事件 */
  onUpdateShowSearch?: (value: boolean) => void
  /** 表格列配置 */
  columns?: ColumnsType
  /** 列显隐控制类型：checkbox / transfer */
  showColumnsType?: string
  /** 右侧外边距 */
  gutter?: number
  /** 列显隐持久化 key */
  storageKey?: string
  /** 刷新表格数据事件 */
  onQueryTable?: () => void
}

/**
 * 表格工具栏
 */
export default function RightToolbar({
  search = true,
  showSearch = true,
  onUpdateShowSearch,
  columns = {},
  showColumnsType = 'checkbox',
  gutter = 10,
  storageKey = '',
  onQueryTable
}: RightToolbarProps) {
  const rightToolbarRef = useRef<HTMLDivElement>(null)
  // transfer 模式：隐藏列的索引列表
  const [value, setValue] = useState<Array<string | number>>([])
  // transfer 模式：弹窗显隐
  const [open, setOpen] = useState(false)
  // checkbox 模式：全选状态
  const [isChecked, setIsChecked] = useState(false)

  // 从 localStorage 恢复列显隐状态
  useEffect(() => {
    if (storageKey) {
      try {
        const saved: any = cache.local.getJSON(storageKey)
        if (saved && typeof saved === 'object' && columns) {
          if (Array.isArray(columns)) {
            columns.forEach((col, index) => {
              if (saved[index] !== undefined) col.visible = saved[index]
            })
          } else {
            Object.keys(columns).forEach((key) => {
              if (saved[key] !== undefined) columns[key].visible = saved[key]
            })
          }
        }
      } catch (e) {
        /* ignore */
      }
    }
     
  }, [])

  // transfer 穿梭显隐列初始默认隐藏列
  useEffect(() => {
    if (showColumnsType === 'transfer' && columns) {
      const initValue: Array<string | number> = []
      if (Array.isArray(columns)) {
        columns.forEach((col, index) => {
          if (col.visible === false) initValue.push(index)
        })
      } else {
        Object.keys(columns).forEach((key, index) => {
          if (columns[key].visible === false) initValue.push(index)
        })
      }
      setValue(initValue)
    }
     
  }, [showColumnsType])

  // 右侧外边距样式
  const style = useMemo(() => {
    const ret: Record<string, any> = {}
    if (gutter) {
      ret.marginRight = `${gutter / 2}px`
    }
    return ret
  }, [gutter])

  // checkbox 判断是否"全选"
  const allVisible = useMemo(() => {
    if (!columns) return true
    return Array.isArray(columns) ? columns.every((col) => col.visible) : Object.values(columns).every((col) => col.visible)
  }, [columns])

  // checkbox 判断是否"部分选中"
  const isIndeterminate = useMemo(() => {
    if (!columns) return false
    const someVisible = Array.isArray(columns)
      ? columns.some((col) => col.visible)
      : Object.values(columns).some((col) => col.visible)
    return someVisible && !allVisible
  }, [columns, allVisible])

  // transfer 数据源
  const transferData = useMemo(() => {
    if (!columns) return []
    if (Array.isArray(columns)) {
      return columns.map((item, index) => ({ key: index, label: item.label }))
    }
    return Object.keys(columns).map((key, index) => ({ key: index, label: columns[key].label }))
  }, [columns])

  /**
   * "搜索区域" 展示/隐藏开关：带动画折叠/展开搜索区
   */
  const toggleSearch = () => {
    let el: HTMLElement | null = rightToolbarRef.current
    let formEl: Element | null = null
    while (el && (el = el.parentElement) && el !== document.body) {
      if ((formEl = el.querySelector('.ant-form'))) break
    }
    if (!formEl) {
      onUpdateShowSearch && onUpdateShowSearch(!showSearch)
      return
    }
    animateSearch(formEl as HTMLElement, showSearch)
  }

  /**
   * 搜索区域折叠/展开动画：操作 ant-form 的 max-height 过渡
   */
  const animateSearch = (el: HTMLElement, isHide: boolean) => {
    const DURATION = 260
    const TRANSITION = 'max-height 0.25s ease, opacity 0.2s ease'
    const clear = () => Object.assign(el.style, { transition: '', maxHeight: '', opacity: '', overflow: '' })
    Object.assign(el.style, { overflow: 'hidden', transition: '' })
    if (isHide) {
      Object.assign(el.style, { maxHeight: el.scrollHeight + 'px', opacity: '1', transition: TRANSITION })
      requestAnimationFrame(() => Object.assign(el.style, { maxHeight: '0', opacity: '0' }))
      setTimeout(() => {
        onUpdateShowSearch && onUpdateShowSearch(false)
        clear()
      }, DURATION)
    } else {
      onUpdateShowSearch && onUpdateShowSearch(true)
      requestAnimationFrame(() => {
        Object.assign(el.style, { maxHeight: '0', opacity: '0' })
        requestAnimationFrame(() => {
          Object.assign(el.style, { transition: TRANSITION, maxHeight: el.scrollHeight + 'px', opacity: '1' })
        })
      })
      setTimeout(clear, DURATION)
    }
  }

  /**
   * 刷新表格数据
   */
  const refresh = () => {
    onQueryTable && onQueryTable()
  }

  /**
   * transfer 穿梭框变化：更新列显隐
   */
  const dataChange = (data: Array<string | number>) => {
    setValue(data)
    if (!columns) return
    if (Array.isArray(columns)) {
      columns.forEach((col) => {
        col.visible = !data.includes(col.key as string | number)
      })
    } else {
      Object.keys(columns).forEach((key, index) => {
        columns[key].visible = !data.includes(index)
      })
    }
    saveStorage()
  }

  /**
   * 单列显隐切换（checkbox 模式）
   */
  const checkboxChange = (event: boolean, key: any) => {
    if (!columns) return
    if (Array.isArray(columns)) {
      const target = columns.find((item) => item.key === key)
      if (target) target.visible = event
    } else {
      columns[key].visible = event
    }
    saveStorage()
  }

  /**
   * 全选/反选切换
   */
  const toggleCheckAll = (checked: boolean) => {
    setIsChecked(checked)
    if (!columns) return
    if (Array.isArray(columns)) {
      columns.forEach((col) => (col.visible = checked))
    } else {
      Object.values(columns).forEach((col) => (col.visible = checked))
    }
    saveStorage()
  }

  /**
   * 持久化列显隐状态到 localStorage
   */
  const saveStorage = () => {
    if (!storageKey) return
    try {
      const state: Record<string | number, any> = {}
      if (!columns) return
      if (Array.isArray(columns)) {
        columns.forEach((col, index) => {
          state[index] = col.visible
        })
      } else {
        Object.keys(columns).forEach((key) => {
          state[key] = columns[key].visible
        })
      }
      cache.local.setJSON(storageKey, state)
    } catch (e) {
      /* ignore */
    }
  }

  // checkbox 模式列显隐下拉
  const columnItems = useMemo(() => {
    if (!columns) return []
    const list = Array.isArray(columns) ? columns : Object.values(columns)
    return list.map((item) => ({
      key: item.key,
      label: item.label
    }))
  }, [columns])

  const hasColumns = columns && (Array.isArray(columns) ? columns.length > 0 : Object.keys(columns).length > 0)

  return (
    <div ref={rightToolbarRef} className="top-right-btn" style={style}>
      {/* "搜索" 展示/隐藏开关 */}
      {search && (
        <Tooltip title={showSearch ? '隐藏搜索' : '显示搜索'}>
          <Button shape="circle" icon={<SearchOutlined />} onClick={toggleSearch} style={{ marginRight: 8 }} />
        </Tooltip>
      )}

      {/* "刷新" 按钮 */}
      <Tooltip title="刷新">
        <Button shape="circle" icon={<ReloadOutlined />} onClick={refresh} style={{ marginRight: 8 }} />
      </Tooltip>

      {/* "显隐列" 按钮 */}
      {hasColumns && showColumnsType === 'transfer' && (
        <Tooltip title="显隐列">
          <Button shape="circle" icon={<MenuOutlined />} onClick={() => setOpen(true)} />
        </Tooltip>
      )}

      {hasColumns && showColumnsType === 'checkbox' && (
        <Dropdown
          trigger={['click']}
          dropdownRender={() => (
            <div className="column-dropdown-menu">
              <div className="column-dropdown-item">
                <Checkbox
                  indeterminate={isIndeterminate}
                  checked={allVisible}
                  onChange={(e) => toggleCheckAll(e.target.checked)}
                >
                  列展示
                </Checkbox>
              </div>
              <div className="check-line" />
              {columnItems.map((item) => {
                const col = Array.isArray(columns)
                  ? columns.find((c) => c.key === item.key)
                  : columns[item.key]
                return (
                  <div key={item.key} className="column-dropdown-item">
                    <Checkbox
                      checked={col ? col.visible : false}
                      onChange={(e) => checkboxChange(e.target.checked, item.key)}
                    >
                      {item.label}
                    </Checkbox>
                  </div>
                )
              })}
            </div>
          )}
        >
          <Button shape="circle" icon={<MenuOutlined />} />
        </Dropdown>
      )}

      {/* transfer 模式：弹框 */}
      <Modal title="显示/隐藏" open={open} onCancel={() => setOpen(false)} footer={null}>
        <Transfer
          dataSource={transferData}
          titles={['显示', '隐藏']}
          targetKeys={value as any}
          onChange={(keys) => dataChange(keys as Array<string | number>)}
          render={(item) => item.label}
        />
      </Modal>
    </div>
  )
}
