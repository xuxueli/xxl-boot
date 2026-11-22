/**
 * @fileoverview 字典数据
 * @description 某字典类型下的字典项分页管理（隐藏路由，从字典管理进入）
 * @author xuxueli 2026-11-21
 */
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { App, Button, Tag } from 'antd';
import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePermission } from '@/hooks/usePermission';
import { t } from '@/i18n';
import { dictApi } from '@/modules/framework/system/dict/api';
import FormModal from './FormModal';

/** 字典数据列表页 */
const DictData = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const navigate = useNavigate();
  const { hasPermi } = usePermission();
  const location = useLocation();

  // ---------------------- 页面状态 ----------------------

  // 从 URL 读取 dictId；缺省时保持 undefined，避免 Number(null) 产生 0
  const raw = new URLSearchParams(location.search).get('dictId');
  const dictId = raw ? Number(raw) : undefined;
  const [formOpen, setFormOpen] = useState(false);
  const [formCurrent, setFormCurrent] = useState<API.DictItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // ---------------------- 数据操作 ----------------------

  /** 删除字典项 */
  const handleDelete = (row?: API.DictItem) => {
    const ids = row ? [row.id as number] : selectedIds;
    if (ids.length === 0) return;
    modal.confirm({
      title: t('modal.title'),
      content: t('system.dict.confirmDeleteItem', [
        row?.name || t('system.dict.batchDeleteItemName'),
      ]),
      onOk: async () => {
        await dictApi.itemDelete(ids);
        message.success(t('common.deleteSuccess'));
        setSelectedIds([]);
        actionRef.current?.reload();
      },
    });
  };

  // ---------------------- 表格“列”定义 ----------------------

  /** 表格列：编号、名称、编码、状态、排序、备注、添加时间、操作 */
  const columns: ProColumns<API.DictItem>[] = [
    { title: t('common.id'), dataIndex: 'id', search: false, width: 80 },
    { title: t('system.dict.itemName'), dataIndex: 'name', search: false },
    { title: t('system.dict.itemCode'), dataIndex: 'code', search: false },
    {
      title: t('common.status'),
      dataIndex: 'status',
      width: 90,
      search: false,
      render: (_, record) => (
        <Tag color={record.status === 0 ? 'success' : 'error'}>
          {record.status === 0 ? t('common.normal') : t('common.disabled')}
        </Tag>
      ),
    },
    {
      title: t('system.dict.order'),
      dataIndex: 'order',
      search: false,
      width: 90,
    },
    { title: t('common.remark'), dataIndex: 'remark', search: false },
    {
      title: t('common.addTime'),
      dataIndex: 'addTime',
      search: false,
      width: 160,
    },
    {
      title: t('common.operation'),
      valueType: 'option',
      width: 140,
      render: (_, record) => [
        hasPermi('system:dict') && (
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
        hasPermi('system:dict') && (
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
      <ProTable<API.DictItem>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        search={{
          labelWidth: 80,
          optionRender: (_searchConfig, _formProps, dom) => [...dom.reverse()],
        }}
        params={{ dictId }}
        request={async (params) => {
          const res = await dictApi.itemPageList(params);
          return {
            data: res.data?.data || [],
            total: res.data?.total || 0,
            success: true,
          };
        }}
        toolBarRender={() => [
          hasPermi('system:dict') && (
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
          hasPermi('system:dict') && (
            <Button
              key="delete"
              danger
              icon={<DeleteOutlined />}
              disabled={!selectedIds.length}
              onClick={() => handleDelete()}
            >
              {t('common.delete')}
            </Button>
          ),
          <Button
            key="close"
            onClick={() => {
              navigate('/system/dict');
            }}
          >
            {t('common.close')}
          </Button>,
        ]}
        rowSelection={{
          onChange: (_keys, rows) => {
            setSelectedIds(rows.map((r) => r.id as number));
          },
        }}
        /* 分页配置 */
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: [10, 20, 50, 100],
          showSizeChanger: true,
          showTotal: (total) => t('common.paginationTotal', [total]),
        }}
        /* 默认批量选择提示隐藏 */
        tableAlertRender={false}
      />
      <FormModal
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
