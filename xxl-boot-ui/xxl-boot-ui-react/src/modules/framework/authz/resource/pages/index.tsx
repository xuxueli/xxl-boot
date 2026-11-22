/**
 * @fileoverview 资源管理
 * @description 资源树表格 + 新增/修改（含图标选择）/删除 + 内联排序 + 展开/折叠
 * @author xuxueli 2026-11-21
 */
import {
  DeleteOutlined,
  EditOutlined,
  NodeExpandOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { App, Button, InputNumber, Tag, Tooltip } from 'antd';
import type React from 'react';
import { useRef, useState } from 'react';
import { toValueEnum, useEnumOption } from '@/hooks/useEnumOption';
import { usePermission } from '@/hooks/usePermission';
import { t } from '@/i18n';
import { resourceApi } from '@/modules/framework/authz/resource/api';
import { handleTree } from '@/utils/common';
import { getIconComponent } from '@/utils/icon';
import FormModal from './FormModal';

/* 资源类型标签颜色：仅视觉映射，文案统一走枚举 */
const typeColors: Record<number, string> = {
  0: 'geekblue',
  1: 'success',
  2: 'warning',
};
const visibleColors: Record<number, string> = {
  0: 'geekblue',
  1: 'default',
};

/** 资源（菜单/按钮）管理列表页 */
const ResourceList = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const { hasPermi } = usePermission();

  // ---------------------- 页面状态 ----------------------

  const [formOpen, setFormOpen] = useState(false);
  const [formCurrent, setFormCurrent] = useState<API.Resource | null>(null);
  const [tableData, setTableData] = useState<API.Resource[]>([]);
  /* 是否展开全部：默认折叠，切换时重建展开状态 */
  const [isExpandAll, setIsExpandAll] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  // 排序快照与变更
  const [orderMap, setOrderMap] = useState<Record<number, number>>({});
  const [originalOrders, setOriginalOrders] = useState<Record<number, number>>(
    {},
  );

  const resourceStatusOptions = useEnumOption('ResourceStatuEnum');
  const resourceTypeOptions = useEnumOption('ResourceTypeEnum');
  const resourceVisibleOptions = useEnumOption('ResourceVisibleEnum');
  const statusValueEnum = toValueEnum(resourceStatusOptions);
  const typeValueEnum = toValueEnum(resourceTypeOptions);
  const visibleValueEnum = toValueEnum(resourceVisibleOptions);

  // ---------------------- 数据操作 ----------------------

  /** 收集所有节点 id（展开/收起全部） */
  const collectAllKeys = (list: API.Resource[]): React.Key[] => {
    const keys: React.Key[] = [];
    const walk = (nodes: API.Resource[]) => {
      nodes.forEach((n) => {
        keys.push(n.id as React.Key);
        if (n.children?.length) walk(n.children);
      });
    };
    walk(list);
    return keys;
  };

  /** 加载数据：转树形结构并记录排序快照 */
  const handleRequest = async (params: Record<string, any>) => {
    const res = await resourceApi.treeList(params);
    const tree = handleTree(res.data || []);
    setTableData(tree);
    const orders: Record<number, number> = {};
    const walk = (nodes: API.Resource[]) => {
      nodes.forEach((n) => {
        orders[n.id as number] = n.order ?? 0;
        if (n.children?.length) walk(n.children);
      });
    };
    walk(tree);
    setOriginalOrders(orders);
    setOrderMap({});
    setExpandedKeys(isExpandAll ? collectAllKeys(tree) : []);
    return { data: tree, total: tree.length, success: true };
  };

  /** 内联排序变更 */
  const handleOrderChange = (id: number, value: number | null) => {
    setOrderMap((prev) => ({ ...prev, [id]: value ?? 0 }));
  };

  /** 保存排序：差量提交 */
  const handleSaveSort = async () => {
    const ids: number[] = [];
    const orders: number[] = [];
    Object.keys(orderMap).forEach((key) => {
      const id = Number(key);
      if (orderMap[id] !== originalOrders[id]) {
        ids.push(id);
        orders.push(orderMap[id]);
      }
    });
    if (ids.length === 0) {
      message.warning(t('common.noSortChange'));
      return;
    }
    await resourceApi.updateSort(ids, orders);
    message.success(t('common.saveSortSuccess'));
    actionRef.current?.reload();
  };

  /** 展开/折叠切换 */
  const handleToggleExpand = () => {
    const next = !isExpandAll;
    setIsExpandAll(next);
    setExpandedKeys(next ? collectAllKeys(tableData) : []);
  };

  /** 删除资源 */
  const handleDelete = (row: API.Resource) => {
    modal.confirm({
      title: t('modal.title'),
      content: t('authz.resource.confirmDelete', [row.name ?? '']),
      onOk: async () => {
        await resourceApi.delete([row.id as number]);
        message.success(t('common.deleteSuccess'));
        actionRef.current?.reload();
      },
    });
  };

  // ---------------------- 表格“列”定义 ----------------------

  /** 表格列：名称、类型、权限、地址、可见、状态、操作 */
  const columns: ProColumns<API.Resource>[] = [
    {
      title: t('authz.resource.menuName'),
      dataIndex: 'name',
      width: 220,
      ellipsis: true,
      render: (_, record) => {
        const Icon = getIconComponent(record.icon);
        return (
          <span>
            {Icon && <Icon style={{ marginRight: 6 }} />}
            {record.name}
          </span>
        );
      },
    },
    {
      title: t('authz.resource.typeColumn'),
      dataIndex: 'type',
      search: false,
      width: 90,
      render: (_, record) => {
        const text = typeValueEnum[record.type ?? -1]?.text;
        return text ? (
          <Tag color={typeColors[record.type ?? -1]}>{text}</Tag>
        ) : (
          '-'
        );
      },
    },
    {
      title: t('authz.resource.orderColumn'),
      dataIndex: 'order',
      search: false,
      width: 100,
      render: (_, record) => (
        <InputNumber
          size="small"
          min={0}
          value={orderMap[record.id as number] ?? record.order}
          onChange={(v) => handleOrderChange(record.id as number, v)}
        />
      ),
    },
    {
      title: t('authz.resource.permission'),
      dataIndex: 'permission',
      search: false,
      ellipsis: true,
      render: (_, record) => (
        <Tooltip title={record.permission}>
          <span>{record.permission || '-'}</span>
        </Tooltip>
      ),
    },
    {
      title: t('authz.resource.url'),
      dataIndex: 'url',
      search: false,
      ellipsis: true,
      render: (_, record) => (
        <Tooltip title={record.url || '-'}>
          <span>{record.url || '-'}</span>
        </Tooltip>
      ),
    },
    {
      title: t('authz.resource.visible'),
      dataIndex: 'visible',
      search: false,
      width: 90,
      render: (_, record) => {
        const text = visibleValueEnum[record.visible ?? -1]?.text;
        return text ? (
          <Tag color={visibleColors[record.visible ?? -1]}>{text}</Tag>
        ) : (
          '-'
        );
      },
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      width: 90,
      valueEnum: statusValueEnum,
      render: (_, record) => (
        <Tag color={record.status === 0 ? 'success' : 'error'}>
          {record.status === 0 ? t('common.normal') : t('common.disabled')}
        </Tag>
      ),
    },
    {
      title: t('common.operation'),
      valueType: 'option',
      width: 240,
      render: (_, record) => [
        hasPermi('authz:resource') && (
          <a
            key="edit"
            onClick={() => {
              setFormCurrent(record);
              setFormOpen(true);
            }}
          >
            <EditOutlined /> {t('common.modify')}
          </a>
        ),
        hasPermi('authz:resource') && record.type !== 2 && (
          <a
            key="add"
            onClick={() => {
              setFormCurrent({ parentId: record.id });
              setFormOpen(true);
            }}
          >
            <PlusOutlined /> {t('common.add')}
          </a>
        ),
        hasPermi('authz:resource') && (
          <a key="delete" onClick={() => handleDelete(record)}>
            <DeleteOutlined /> {t('common.delete')}
          </a>
        ),
      ],
    },
  ];

  // ---------------------- 数据列表渲染 ----------------------

  return (
    <PageContainer ghost title={false}>
      <ProTable<API.Resource>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        pagination={false}
        /* 默认批量选择提示隐藏 */
        tableAlertRender={false}
        search={{
          labelWidth: 80,
          optionRender: (_searchConfig, _formProps, dom) => [...dom.reverse()],
        }}
        expandable={{
          expandedRowKeys: expandedKeys,
          onExpandedRowsChange: (keys) => setExpandedKeys([...keys]),
        }}
        request={handleRequest}
        toolBarRender={() => [
          hasPermi('authz:resource') && (
            <Button
              key="add"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setFormCurrent(null);
                setFormOpen(true);
              }}
            >
              {t('common.add')}
            </Button>
          ),
          hasPermi('authz:resource') && (
            <Button
              key="saveSort"
              icon={<SaveOutlined />}
              onClick={handleSaveSort}
            >
              {t('common.saveSort')}
            </Button>
          ),
          <Button
            key="expand"
            icon={<NodeExpandOutlined />}
            onClick={handleToggleExpand}
          >
            {t('common.expandCollapse')}
          </Button>,
        ]}
      />
      <FormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        current={formCurrent}
        onSuccess={() => actionRef.current?.reload()}
      />
    </PageContainer>
  );
};

export default ResourceList;
