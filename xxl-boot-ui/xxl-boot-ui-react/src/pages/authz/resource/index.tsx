/**
 * 页面：资源管理
 * 功能：资源树表格 + 新增/修改（含图标选择）/删除 + 内联排序 + 展开/折叠
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
import { createStyles } from 'antd-style';
import React, { useRef, useState } from 'react';
import { toValueEnum, useEnumOption } from '@/hooks/useEnumOption';
import { usePermission } from '@/hooks/usePermission';
import {
  delResource,
  listResource,
  updateResourceSort,
} from '@/services/authz/resource';
import { getIconComponent } from '@/utils/icon';
import { handleTree } from '@/utils/common';
import ResourceFormModal from './ResourceFormModal';

const typeMap: Record<number, { text: string; color: string }> = {
  0: { text: '目录', color: 'geekblue' },
  1: { text: '菜单', color: 'success' },
  2: { text: '按钮', color: 'warning' },
};

const visibleMap: Record<number, { text: string; color: string }> = {
  0: { text: '显示', color: 'geekblue' },
  1: { text: '隐藏', color: 'default' },
};

/**
 * 资源表格样式
 * 功能：顶部操作按钮靠左展示，密度/刷新等设置项仍靠右
 */
const useStyles = createStyles(({ css }) => ({
  resourceTable: css`
    .ant-pro-table-list-toolbar-container {
      justify-content: flex-start;
    }

    .ant-pro-table-list-toolbar-container .ant-pro-table-list-toolbar-right {
      justify-content: flex-start;
    }

    .ant-pro-table-list-toolbar-container
      .ant-pro-table-list-toolbar-right
      .ant-pro-table-list-toolbar-setting-items {
      margin-left: auto;
    }
  `,
}));

const ResourceList = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const { hasPermi } = usePermission();

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
  const statusValueEnum = toValueEnum(resourceStatusOptions);
  const { styles } = useStyles();

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
    const res = await listResource(params);
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
      message.warning('没有需要保存的排序变更');
      return;
    }
    await updateResourceSort(ids, orders);
    message.success('保存排序成功');
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
      title: '系统提示',
      content: `是否确认删除名称为"${row.name}"的数据项？`,
      onOk: async () => {
        await delResource([row.id as number]);
        message.success('删除成功');
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns<API.Resource>[] = [
    {
      title: '资源名称',
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
      title: '类型',
      dataIndex: 'type',
      search: false,
      width: 90,
      render: (_, record) => {
        const t = typeMap[record.type ?? -1];
        return t ? <Tag color={t.color}>{t.text}</Tag> : '-';
      },
    },
    {
      title: '排序',
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
      title: '权限标识',
      dataIndex: 'permission',
      search: false,
      width: 150,
      render: (_, record) => (
        <Tooltip title={record.permission}>
          <span>{record.permission || '-'}</span>
        </Tooltip>
      ),
    },
    {
      title: '菜单地址',
      dataIndex: 'url',
      search: false,
      width: 220,
      ellipsis: true,
      render: (_, record) => <span>{record.url || '-'}</span>,
    },
    {
      title: '显示状态',
      dataIndex: 'visible',
      search: false,
      width: 90,
      render: (_, record) => {
        const v = visibleMap[record.visible ?? -1];
        return v ? <Tag color={v.color}>{v.text}</Tag> : '-';
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      valueEnum: statusValueEnum,
      render: (_, record) => (
        <Tag color={record.status === 0 ? 'success' : 'error'}>
          {record.status === 0 ? '正常' : '停用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      width: 240,
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setFormCurrent(record);
            setFormOpen(true);
          }}
        >
          <EditOutlined /> 修改
        </a>,
        record.type !== 2 && (
          <a
            key="add"
            onClick={() => {
              setFormCurrent({ parentId: record.id });
              setFormOpen(true);
            }}
          >
            <PlusOutlined /> 新增
          </a>
        ),
        <a key="delete" onClick={() => handleDelete(record)}>
          <DeleteOutlined /> 删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer ghost title={false}>
      <div className={styles.resourceTable}>
        <ProTable<API.Resource>
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          pagination={false}
          search={{
            labelWidth: 80,
            optionRender: (_searchConfig, _formProps, dom) => [
              ...dom.reverse(),
            ],
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
                新增
              </Button>
            ),
            hasPermi('authz:resource') && (
              <Button
                key="saveSort"
                icon={<SaveOutlined />}
                onClick={handleSaveSort}
              >
                保存排序
              </Button>
            ),
            <Button
              key="expand"
              icon={<NodeExpandOutlined />}
              onClick={handleToggleExpand}
            >
              展开/折叠
            </Button>,
          ]}
        />
      </div>
      <ResourceFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        current={formCurrent}
        onSuccess={() => actionRef.current?.reload()}
      />
    </PageContainer>
  );
};

export default ResourceList;