/**
 * 页面：组织管理
 * 功能：组织树表格 + 新增/修改/删除 + 内联排序
 */
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { App, Button, InputNumber, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { toValueEnum, useEnumOption } from '@/hooks/useEnumOption';
import { delOrg, listOrg, updateOrgSort } from '@/services/xxl-boot/authz/org';
import { usePermission } from '@/utils/permission';
import OrgFormModal from './OrgFormModal';

const OrgList: React.FC = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const { hasPermi } = usePermission();

  const [formOpen, setFormOpen] = useState(false);
  const [formCurrent, setFormCurrent] = useState<API.Org | null>(null);
  const [tableData, setTableData] = useState<API.Org[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [orderMap, setOrderMap] = useState<Record<number, number>>({});
  const [originalOrders, setOriginalOrders] = useState<Record<number, number>>(
    {},
  );
  const [sortChanged, setSortChanged] = useState(false);

  const orgStatusOptions = useEnumOption('OrgStatuEnum');
  const statusValueEnum = toValueEnum(orgStatusOptions);

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

  /** 加载数据：记录排序快照 */
  const handleRequest = async (params: Record<string, any>) => {
    const res = await listOrg(params);
    const data = res.data || [];
    setTableData(data);
    const orders: Record<number, number> = {};
    const walk = (nodes: API.Org[]) => {
      nodes.forEach((n) => {
        orders[n.id as number] = n.order ?? 0;
        if (n.children?.length) walk(n.children);
      });
    };
    walk(data);
    setOriginalOrders(orders);
    setOrderMap({});
    setSortChanged(false);
    return { data, total: data.length, success: true };
  };

  /** 内联排序变更 */
  const handleOrderChange = (id: number, value: number | null) => {
    setOrderMap((prev) => ({ ...prev, [id]: value ?? 0 }));
    setSortChanged(true);
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
    await updateOrgSort(ids, orders);
    message.success('保存排序成功');
    actionRef.current?.reload();
  };

  /** 删除组织 */
  const handleDelete = (row: API.Org) => {
    modal.confirm({
      title: '系统提示',
      content: `是否确认删除名称为"${row.name}"的数据项？`,
      onOk: async () => {
        await delOrg([row.id as number]);
        message.success('删除成功');
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns<API.Org>[] = [
    {
      title: '组织名称',
      dataIndex: 'name',
      render: (_, record) => <span>{record.name}</span>,
    },
    {
      title: '显示排序',
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
      title: '负责人',
      dataIndex: 'manager',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'addTime',
      search: false,
      width: 160,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 160,
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setFormCurrent(record);
            setFormOpen(true);
          }}
        >
          修改
        </a>,
        <a
          key="add"
          onClick={() => {
            setFormCurrent({ ...record, id: undefined, parentId: record.id });
            setFormOpen(true);
          }}
        >
          新增
        </a>,
        record.parentId !== 0 && (
          <a key="delete" onClick={() => handleDelete(record)}>
            删除
          </a>
        ),
      ],
    },
  ];

  return (
    <PageContainer ghost title={false}>
      <ProTable<API.Org>
        headerTitle="组织列表"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        search={{ labelWidth: 80 }}
        expandable={{
          expandedRowKeys: expandedKeys,
          onExpandedRowsChange: (keys) => setExpandedKeys([...keys]),
        }}
        request={handleRequest}
        toolBarRender={() => [
          sortChanged && (
            <Button key="saveSort" type="primary" onClick={handleSaveSort}>
              保存排序
            </Button>
          ),
          <Button
            key="expand"
            onClick={() => {
              setExpandedKeys((prev) =>
                prev.length > 0 ? [] : collectAllKeys(tableData),
              );
            }}
          >
            {expandedKeys.length > 0 ? '折叠' : '展开'}
          </Button>,
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
              新增
            </Button>
          ),
        ]}
      />
      <OrgFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        current={formCurrent}
        onSuccess={() => actionRef.current?.reload()}
      />
    </PageContainer>
  );
};

export default OrgList;
