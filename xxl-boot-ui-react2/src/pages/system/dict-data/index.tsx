/**
 * 页面：字典数据
 * 功能：某字典类型下的字典项分页管理（隐藏路由，从字典管理进入）
 */
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history, useLocation } from '@umijs/max';
import { App, Button, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { toValueEnum, useEnumOption } from '@/hooks/useEnumOption';
import { delData, listData } from '@/services/xxl-boot/system/dict';
import { usePermission } from '@/utils/permission';
import DictDataFormModal from './DictDataFormModal';

const DictData: React.FC = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const { hasRole } = usePermission();
  const location = useLocation();

  // 从 URL 读取 dictId
  const rawDictId = Number(new URLSearchParams(location.search).get('dictId'));
  const dictId = Number.isNaN(rawDictId) ? undefined : rawDictId;
  const [formOpen, setFormOpen] = useState(false);
  const [formCurrent, setFormCurrent] = useState<API.DictItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const dictStatusOptions = useEnumOption('DictStatusEnum');
  const statusValueEnum = toValueEnum(dictStatusOptions);

  /** 删除字典项 */
  const handleDelete = (row?: API.DictItem) => {
    const ids = row ? [row.id as number] : selectedIds;
    if (ids.length === 0) return;
    modal.confirm({
      title: '系统提示',
      content: `是否确认删除名称为"${row?.name || '这些字典项'}"的数据项？`,
      onOk: async () => {
        await delData(ids);
        message.success('删除成功');
        setSelectedIds([]);
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns<API.DictItem>[] = [
    { title: '序号', dataIndex: 'id', search: false, width: 80 },
    { title: '字典项名称', dataIndex: 'name' },
    { title: '字典项编码', dataIndex: 'code', search: false },
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
    { title: '显示排序', dataIndex: 'order', search: false, width: 90 },
    { title: '备注', dataIndex: 'remark', search: false },
    { title: '创建时间', dataIndex: 'addTime', search: false, width: 160 },
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
      <ProTable<API.DictItem>
        headerTitle="字典项列表"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        params={{ dictId }}
        request={async (params) => {
          const res = await listData(params);
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
          <Button
            key="close"
            onClick={() => {
              history.push('/system/dict');
            }}
          >
            关闭
          </Button>,
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
      <DictDataFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        current={formCurrent}
        dictId={dictId}
        onSuccess={() => actionRef.current?.reload()}
      />
    </PageContainer>
  );
};

export default DictData;
