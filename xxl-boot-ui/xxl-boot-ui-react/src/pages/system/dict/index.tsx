/**
 * 页面：字典管理
 * 功能：字典类型分页表格 + 新增/修改/删除 + 字典数据抽屉
 */
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { App, Button, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toValueEnum, useEnumOption } from '@/hooks/useEnumOption';
import { usePermission } from '@/hooks/usePermission';
import { delType, listType } from '@/services/system/dict';
import DictDataDrawer, { type DictDataDrawerRef } from './DictDataDrawer';
import DictFormModal from './DictFormModal';

const DictList = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const drawerRef = useRef<DictDataDrawerRef>(null);
  const navigate = useNavigate();
  const { hasRole } = usePermission();

  const [formOpen, setFormOpen] = useState(false);
  const [formCurrent, setFormCurrent] = useState<API.Dict | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const dictStatusOptions = useEnumOption('DictStatusEnum');
  const statusValueEnum = toValueEnum(dictStatusOptions);

  /** 删除字典类型 */
  const handleDelete = (row?: API.Dict) => {
    const ids = row ? [row.id as number] : selectedIds;
    if (ids.length === 0) return;
    modal.confirm({
      title: '系统提示',
      content: `是否确认删除名称为"${row?.name || '这些字典'}"的数据项？`,
      onOk: async () => {
        await delType(ids);
        message.success('删除成功');
        setSelectedIds([]);
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns<API.Dict>[] = [
    { title: '序号', dataIndex: 'id', search: false, width: 80 },
    { title: '字典名称', dataIndex: 'name' },
    {
      title: '字典类型',
      dataIndex: 'type',
      search: false,
      render: (_, record) => (
        <a
          onClick={() => {
            drawerRef.current?.open(record);
          }}
        >
          {record.type}
        </a>
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
    { title: '备注', dataIndex: 'remark', search: false },
    { title: '创建时间', dataIndex: 'addTime', search: false, width: 160 },
    {
      title: '操作',
      valueType: 'option',
      width: 180,
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
          key="list"
          onClick={() => {
            navigate(`/system/dict/data?dictId=${record.id}`);
          }}
        >
          列表
        </a>,
        <a key="delete" onClick={() => handleDelete(record)}>
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer ghost title={false}>
      <ProTable<API.Dict>
        headerTitle="字典类型列表"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const res = await listType(params);
          return {
            data: res.data?.data || [],
            total: res.data?.total || 0,
            success: true,
          };
        }}
        toolBarRender={() => [
          hasRole('admin') && (
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
      <DictFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        current={formCurrent}
        onSuccess={() => actionRef.current?.reload()}
      />
      <DictDataDrawer ref={drawerRef} />
    </PageContainer>
  );
};

export default DictList;
