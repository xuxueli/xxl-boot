/**
 * @fileoverview 字典管理
 * @description 字典类型分页表格 + 新增/修改/删除 + 字典数据抽屉
 * @author xuxueli 2026-11-21
 */
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { App, Button, Tag } from 'antd';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toValueEnum, useEnumOption } from '@/hooks/useEnumOption';
import { usePermission } from '@/hooks/usePermission';
import { t } from '@/i18n';
import { dictApi } from '@/modules/framework/system/dict/api';
import DictDataDrawer from './DictDataDrawer';
import FormModal from './FormModal';

/** 字典类型列表页 */
const DictList = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const [drawerOpen, setDrawerOpen] = useState(false); /* 抽屉显隐 */
  const [drawerDict, setDrawerDict] = useState<API.Dict | null>(
    null,
  ); /* 当前字典 */
  const navigate = useNavigate();
  const { hasPermi } = usePermission();

  // ---------------------- 页面状态 ----------------------

  const [formOpen, setFormOpen] = useState(false);
  const [formCurrent, setFormCurrent] = useState<API.Dict | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const dictStatusOptions = useEnumOption('DictStatusEnum');
  const statusValueEnum = toValueEnum(dictStatusOptions);

  // ---------------------- 数据操作 ----------------------

  /** 删除字典类型 */
  const handleDelete = (row?: API.Dict) => {
    const ids = row ? [row.id as number] : selectedIds;
    if (ids.length === 0) return;
    modal.confirm({
      title: t('modal.title'),
      content: t('system.dict.confirmDelete', [
        row?.name || t('system.dict.batchDeleteName'),
      ]),
      onOk: async () => {
        await dictApi.delete(ids);
        message.success(t('common.deleteSuccess'));
        setSelectedIds([]);
        actionRef.current?.reload();
      },
    });
  };

  // ---------------------- 表格“列”定义 ----------------------

  /** 表格列：编号、名称、类型、状态、备注、添加时间、操作 */
  const columns: ProColumns<API.Dict>[] = [
    { title: t('common.id'), dataIndex: 'id', search: false, width: 80 },
    { title: t('system.dict.dictName'), dataIndex: 'name' },
    {
      title: t('system.dict.dictType'),
      dataIndex: 'type',
      search: false,
      render: (_, record) => (
        <a
          onClick={() => {
            setDrawerDict(record);
            setDrawerOpen(true);
          }}
        >
          {record.type}
        </a>
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
      width: 180,
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
          <a
            key="list"
            onClick={() => {
              navigate(`/system/dict/data?dictId=${record.id}`);
            }}
          >
            <UnorderedListOutlined /> {t('system.dict.dataList')}
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
      <ProTable<API.Dict>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        search={{
          labelWidth: 80,
          optionRender: (_searchConfig, _formProps, dom) => [...dom.reverse()],
        }}
        request={async (params) => {
          const res = await dictApi.pageList(params);
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
        onSuccess={() => actionRef.current?.reload()}
      />
      <DictDataDrawer
        open={drawerOpen}
        dict={drawerDict}
        onClose={() => setDrawerOpen(false)}
      />
    </PageContainer>
  );
};

export default DictList;
