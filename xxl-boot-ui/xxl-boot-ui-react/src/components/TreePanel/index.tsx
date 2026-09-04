/**
 * 组件：TreePanel（树形侧栏面板）
 * 功能：可搜索过滤、展开/收起全部、刷新、可折叠的树形侧栏，用于用户管理等页面左侧组织树。
 */
import {
  ApartmentOutlined,
  ColumnHeightOutlined,
  DownOutlined,
  ReloadOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { Input, Tooltip, Tree } from 'antd';
import { createStyles } from 'antd-style';
import { clsx } from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { t } from '@/i18n';

const useStyles = createStyles(({ token, css }) => ({
  panel: css`
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: ${token.borderRadiusLG}px;
    overflow: hidden;
    position: relative;
    transition: width 0.25s ease;
  `,
  collapsed: css`
    width: 36px !important;
  `,
  header: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    height: 44px;
    border-bottom: 1px solid ${token.colorBorderSecondary};
    background: ${token.colorFillTertiary};
    flex-shrink: 0;
  `,
  title: css`
    font-size: 13px;
    font-weight: 600;
    color: ${token.colorText};
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 5px;

    .anticon {
      color: ${token.colorPrimary};
      font-size: 16px;
    }
  `,
  actions: css`
    display: flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
  `,
  actionIcon: css`
    font-size: 15px;
    color: ${token.colorTextTertiary};
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;

    &:hover {
      color: ${token.colorPrimary};
      background: ${token.colorFillSecondary};
    }
  `,
  search: css`
    padding: 10px 10px 4px;
    flex-shrink: 0;
  `,
  wrap: css`
    flex: 1;
    overflow-y: auto;
    padding: 6px;
  `,
  node: css`
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    overflow: hidden;
  `,
  nodeLabel: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  resizeHandle: css`
    position: absolute;
    top: 0;
    right: 0;
    width: 6px;
    height: 100%;
    cursor: col-resize;
    z-index: 20;

    &:hover {
      background: rgba(22, 119, 255, 0.3);
    }
  `,
}));

export type TreePanelProps = {
  /** 树形数据 */
  treeData?: API.Org[];
  /** 标题 */
  title?: string;
  /** 是否显示搜索框 */
  showSearch?: boolean;
  /** 搜索框占位符 */
  searchPlaceholder?: string;
  /** 是否默认展开所有节点 */
  defaultExpandAll?: boolean;
  /** 节点点击事件 */
  onNodeClick?: (node: API.Org) => void;
  /** 刷新事件 */
  onRefresh?: () => void;
  /** 默认宽度 */
  defaultWidth?: number;
  /** 最小宽度 */
  minWidth?: number;
  /** 最大宽度 */
  maxWidth?: number;
  /** 宽度本地存储 key */
  storageKey?: string;
};

/**
 * 根据关键词过滤树节点（名称包含）
 */
const filterTree = (data: API.Org[], keyword: string): API.Org[] => {
  if (!keyword) return data;
  const result: API.Org[] = [];
  data.forEach((item) => {
    const children = item.children ? filterTree(item.children, keyword) : [];
    if ((item.name || '').includes(keyword) || children.length > 0) {
      result.push({ ...item, children });
    }
  });
  return result;
};

const TreePanel = ({
  treeData = [],
  title = t('components.treePanel.title'),
  showSearch = true,
  searchPlaceholder = t('components.treePanel.search'),
  defaultExpandAll = false,
  onNodeClick,
  onRefresh,
  defaultWidth = 220,
  minWidth = 180,
  maxWidth = 400,
  storageKey = 'tree-sidebar-width',
}: TreePanelProps) => {
  const { styles } = useStyles();
  const [keyword, setKeyword] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [width, setWidth] = useState(defaultWidth);
  const resizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  /** 过滤后的树数据 */
  const filteredData = useMemo(
    () => filterTree(treeData, keyword),
    [treeData, keyword],
  );

  /** 全部节点 key（用于展开/收起） */
  const allKeys = useMemo(() => {
    const keys: React.Key[] = [];
    const walk = (list: API.Org[]) => {
      list.forEach((n) => {
        keys.push(n.id as React.Key);
        if (n.children?.length) walk(n.children);
      });
    };
    walk(filteredData);
    return keys;
  }, [filteredData]);

  // 是否有展开的节点
  const expanded = expandedKeys.length > 0;

  // 默认展开全部：数据加载后首次赋值为全部节点 key（用户手动折叠后不再干预）
  const expandInitialized = useRef(false);
  useEffect(() => {
    if (defaultExpandAll && !expandInitialized.current && allKeys.length > 0) {
      expandInitialized.current = true;
      setExpandedKeys(allKeys);
    }
  }, [allKeys, defaultExpandAll]);

  // 加载持久化宽度
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const w = parseInt(saved, 10);
        if (!Number.isNaN(w) && w >= minWidth && w <= maxWidth) {
          setWidth(w);
        }
      }
    } catch {
      // 忽略读取失败
    }
  }, [storageKey, minWidth, maxWidth]);

  /** 展开/收起全部 */
  const toggleExpandAll = () => {
    setExpandedKeys((prev) => (prev.length > 0 ? [] : allKeys));
  };

  /** 开始拖拽调整宽度 */
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    resizing.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', stopResize);
    document.body.style.userSelect = 'none';
  };

  // 拖拽调整宽度
  const handleResizeMove = (e: MouseEvent) => {
    if (!resizing.current) return;
    const newWidth = startWidth.current + (e.clientX - startX.current);
    setWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
  };

  // 停止拖拽调整宽度
  const stopResize = () => {
    if (!resizing.current) return;
    resizing.current = false;
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', stopResize);
    document.body.style.userSelect = '';
    try {
      localStorage.setItem(storageKey, width.toString());
    } catch {
      // 忽略保存失败
    }
  };

  return (
    <div
      className={clsx(styles.panel, collapsed && styles.collapsed)}
      style={{ width: collapsed ? 36 : width }}
    >
      {!collapsed && (
        <>
          <div className={styles.header}>
            <span className={styles.title}>
              <ApartmentOutlined />
              {title}
            </span>
            <div className={styles.actions}>
              <Tooltip
                title={
                  expanded
                    ? t('components.treePanel.collapseAll')
                    : t('components.treePanel.expandAll')
                }
              >
                {expanded ? (
                  <UpOutlined
                    className={styles.actionIcon}
                    onClick={toggleExpandAll}
                  />
                ) : (
                  <DownOutlined
                    className={styles.actionIcon}
                    onClick={toggleExpandAll}
                  />
                )}
              </Tooltip>
              {onRefresh && (
                <Tooltip title={t('components.treePanel.refresh')}>
                  <ReloadOutlined
                    className={styles.actionIcon}
                    onClick={onRefresh}
                  />
                </Tooltip>
              )}
            </div>
          </div>
          {showSearch && (
            <div className={styles.search}>
              <Input
                size="small"
                placeholder={searchPlaceholder}
                allowClear
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          )}
          <div className={styles.wrap}>
            <Tree
              blockNode
              fieldNames={{ title: 'name', key: 'id', children: 'children' }}
              treeData={
                filteredData as unknown as import('antd/es/tree').DataNode[]
              }
              defaultExpandAll={defaultExpandAll}
              expandedKeys={expandedKeys}
              onExpand={(keys) => setExpandedKeys(keys)}
              onSelect={(_keys, info) => {
                onNodeClick?.(info.node as unknown as API.Org);
              }}
              titleRender={(node) => {
                const data = node as unknown as API.Org;
                return (
                  <span className={styles.node}>
                    <span className={styles.nodeLabel}>{data.name}</span>
                  </span>
                );
              }}
            />
          </div>
          <div className={styles.resizeHandle} onMouseDown={startResize} />
        </>
      )}
      <Tooltip
        title={
          collapsed ? t('components.treePanel.expand') : t('components.treePanel.collapse')
        }
        placement="right"
      >
        <ColumnHeightOutlined
          style={{
            position: 'absolute',
            top: '50%',
            right: 0,
            transform: 'translateY(-50%) rotate(90deg)',
            fontSize: 12,
            color: 'rgba(0,0,0,0.45)',
            cursor: 'pointer',
            zIndex: 100,
            padding: 4,
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '4px 0 0 4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
          onClick={() => setCollapsed((v) => !v)}
        />
      </Tooltip>
    </div>
  );
};

export default TreePanel;
