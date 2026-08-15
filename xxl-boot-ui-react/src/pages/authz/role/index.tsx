/**
 * 页面：角色管理
 * 功能：角色分页表格 + 新增/修改（含菜单权限树）/删除
 */
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { App, Button, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { toValueEnum, useEnumOption } from '@/hooks/useEnumOption';
import { delRole, listRole } from '@/services/authz/role';
import { usePermission } from '@/hooks/usePermission';
import RoleFormModal from './RoleFormModal';

const RoleList = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const { hasPermi } = usePermission();

  const [formOpen, setFormOpen] = useState(false);
  const [formCurrent, setFormCurrent] = useState<API.Role | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const roleStatusOptions = useEnumOption('RoleStatusEnum');
  const statusValueEnum = toValueEnum(roleStatusOptions);

  /** 删除角色 */
  const handleDelete = (row?: API.Role) => {
    const ids = row ? [row.id as number] : selectedIds;
    if (ids.length === 0) return;
    modal.confirm({
      title: '系统提示',
      content: `是否确认删除名称为"${row?.name || '这些角色'}"的数据项？`,
      onOk: async () => {
        await delRole(ids);
        message.success('删除成功');
        setSelectedIds([]);
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns<API.Role>[] = [
    { title: '角色编号', dataIndex: 'id', search: false, width: 90 },
    { title: '角色名称', dataIndex: 'name' },
    {
      title: '权限字符',
      dataIndex: 'code',
      search: false,
    },
    {
      title: '显示顺序',
      dataIndex: 'order',
      search: false,
      width: 90,
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
      title: '创建时间',
      dataIndex: 'addTime',
      search: false,
      width: 160,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 140,
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
        <a key="delete" onClick={() => handleDelete(record)}>
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer ghost title={false}>
      <ProTable<API.Role>
        headerTitle="角色列表"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const res = await listRole(params);
          return {
            data: res.data?.data || [],
            total: res.data?.total || 0,
            success: true,
          };
        }}
        toolBarRender={() => [
          hasPermi('authz:role') && (
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
        rowSelection={{
          onChange: (_keys, rows) => {
            setSelectedIds(rows.map((r) => r.id as number));
          },
        }}
        tableAlertOptionRender={() => [
          <a key="delete" onClick={() => handleDelete()}>
            批量删除
          </a>,
        ]}
      />
      <RoleFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        current={formCurrent}
        onSuccess={() => actionRef.current?.reload()}
      />
    </PageContainer>
  );
};

export default RoleList;
