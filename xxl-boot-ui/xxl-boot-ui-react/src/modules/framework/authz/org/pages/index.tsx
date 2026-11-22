/**
 * @fileoverview 组织管理
 * @description 组织树表格 + 新增/修改/删除 + 内联排序 + 展开/折叠
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
import { App, Button, InputNumber, Tag } from 'antd';
import type React from 'react';
import { useRef, useState } from 'react';
import { toValueEnum, useEnumOption } from '@/hooks/useEnumOption';
import { usePermission } from '@/hooks/usePermission';
import { t } from '@/i18n';
import { orgApi } from '@/modules/framework/authz/org/api';
import { handleTree } from '@/utils/common';
import FormModal from './FormModal';

/** 组织管理列表页 */
const OrgList = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const { hasPermi } = usePermission();

  // ---------------------- 页面状态 ----------------------

  const [formOpen, setFormOpen] = useState(false);
  const [formCurrent, setFormCurrent] = useState<API.Org | null>(null);
  const [tableData, setTableData] = useState<API.Org[]>([]);
  /* 是否展开全部：默认展开，切换时重建展开状态 */
  const [isExpandAll, setIsExpandAll] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [orderMap, setOrderMap] = useState<Record<number, number>>({});
  const [originalOrders, setOriginalOrders] = useState<Record<number, number>>(
    {},
  );

  const orgStatusOptions = useEnumOption('OrgStatuEnum');
  const statusValueEnum = toValueEnum(orgStatusOptions);

  // ---------------------- 数据操作 ----------------------

  /** 收集所有节点 id */
  const collectAllKeys = (list: API.Org[]): React.Key[] => {
    const keys: React.Key[] = [];
    const walk = (nodes: API.Org[]) => {
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
    const res = await orgApi.treeList(params);
    const tree = handleTree(res.data || []);
    setTableData(tree);
    const orders: Record<number, number> = {};
    const walk = (nodes: API.Org[]) => {
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
    await orgApi.updateSort(ids, orders);
    message.success(t('common.saveSortSuccess'));
    actionRef.current?.reload();
  };

  /** 展开/折叠切换 */
  const handleToggleExpand = () => {
    const next = !isExpandAll;
    setIsExpandAll(next);
    setExpandedKeys(next ? collectAllKeys(tableData) : []);
  };

  /** 删除组织 */
  const handleDelete = (row: API.Org) => {
    modal.confirm({
      title: t('modal.title'),
      content: t('authz.org.confirmDelete', [row.name ?? '']),
      onOk: async () => {
        await orgApi.delete([row.id as number]);
        message.success(t('common.deleteSuccess'));
        actionRef.current?.reload();
      },
    });
  };

  // ---------------------- 表格“列”定义 ----------------------

  /** 表格列：名称、排序、状态、负责人、添加时间、操作 */
  const columns: ProColumns<API.Org>[] = [
    {
      title: t('authz.org.name'),
      dataIndex: 'name',
      width: 220,
      ellipsis: true,
      render: (_, record) => <span>{record.name}</span>,
    },
    {
      title: t('authz.org.order'),
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
      title: t('authz.org.manager'),
      dataIndex: 'manager',
      search: false,
    },
    {
      title: t('common.addTime'),
      dataIndex: 'addTime',
      search: false,
      width: 160,
    },
    {
      title: t('common.operation'),
      valueType: 'option',
      width: 240,
      render: (_, record) => [
        hasPermi('authz:org') && (
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
        hasPermi('authz:org') && (
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
        hasPermi('authz:org') && record.parentId !== 0 && (
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
      <ProTable<API.Org>
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
          hasPermi('authz:org') && (
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
          hasPermi('authz:org') && (
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

export default OrgList;
