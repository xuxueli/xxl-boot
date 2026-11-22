/**
 * @fileoverview 配置管理
 * @description 配置分页表格 + 新增/修改/删除
 * @author xuxueli 2026-11-21
 */
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { App, Button, Tag } from 'antd';
import { useRef, useState } from 'react';
import { toValueEnum, useEnumOption } from '@/hooks/useEnumOption';
import { usePermission } from '@/hooks/usePermission';
import { t } from '@/i18n';
import { configApi } from '@/modules/framework/system/config/api';
import FormModal from './FormModal';

/**
 * 配置列表页
 * 功能：只负责查询、勾选、顶部操作与弹窗编排；表单细节收敛在 FormModal。
 */
const ConfigList = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const { hasPermi } = usePermission();

  // ---------------------- 页面状态 ----------------------

  const [formOpen, setFormOpen] = useState(false); /* 表单弹窗显隐 */
  const [formCurrent, setFormCurrent] = useState<API.Config | null>(
    null,
  ); /* 当前编辑行，null 表示新增 */
  const [selectedIds, setSelectedIds] = useState<number[]>([]); /* 勾选行主键 */

  // 状态枚举：valueEnum 供搜索下拉，render 中的 Tag 文案由 common 文案兜底
  const configStatusOptions = useEnumOption('ConfigStatusEnum');
  const statusValueEnum = toValueEnum(configStatusOptions);

  // ---------------------- 数据操作 ----------------------

  /**
   * 删除配置（单条或批量）
   *
   * @param row 行数据，省略时删除勾选行
   */
  const handleDelete = (row?: API.Config) => {
    // 行按钮只删当前行；顶部按钮删除勾选行
    const ids = row ? (row.id != null ? [row.id] : []) : selectedIds;
    // 无可删记录时直接返回，避免弹出空确认框
    if (ids.length === 0) return;
    // confirm delete
    modal.confirm({
      title: t('modal.title'),
      content: row
        ? t('system.config.confirmDelete', [row.name ?? String(row.id)])
        : t('system.config.confirmBatchDelete', [ids.length]),
      onOk: async () => {
        await configApi.delete(ids);
        message.success(t('common.deleteSuccess'));
        // 删除后清空勾选，避免批量按钮仍处于可用态
        setSelectedIds([]);
        actionRef.current?.reload();
      },
    });
  };

  // ---------------------- 表格“列”定义 ----------------------

  /** 表格列：编号、名称、Key、Value、状态、备注、添加时间、操作 */
  const columns: ProColumns<API.Config>[] = [
    { title: t('common.id'), dataIndex: 'id', search: false, width: 80 },
    {
      title: t('system.config.configName'),
      dataIndex: 'name',
      /* 启用搜索 */
      search: true,
      ellipsis: true,
    },
    {
      title: t('system.config.configKey'),
      dataIndex: 'key',
      /* 启用搜索：与后端 pageList 的 key 条件对齐 */
      search: true,
      ellipsis: true,
    },
    {
      title: t('system.config.configValue'),
      dataIndex: 'value',
      search: false,
      ellipsis: true,
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      width: 90,
      valueType: 'select',
      valueEnum: statusValueEnum,
      render: (_, record) => (
        <Tag color={record.status === 0 ? 'success' : 'error'}>
          {record.status === 0 ? t('common.normal') : t('common.disabled')}
        </Tag>
      ),
    },
    {
      title: t('common.remark'),
      dataIndex: 'remark',
      search: false,
      ellipsis: true,
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
      width: 140,
      render: (_, record) => [
        hasPermi('system:config') && (
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
        hasPermi('system:config') && (
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
      <ProTable<API.Config>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        /* 搜索区：查询/重置按钮靠右 */
        search={{
          labelWidth: 80,
          optionRender: (_searchConfig, _formProps, dom) => [...dom.reverse()],
        }}
        /* 列表数据查询 */
        request={async (params) => {
          const res = await configApi.pageList(params);
          return {
            data: res.data?.data || [],
            total: res.data?.total || 0,
            success: true,
          };
        }}
        /* 工具栏：新增、批量删除 */
        toolBarRender={() => [
          hasPermi('system:config') && (
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
          hasPermi('system:config') && (
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
        /* 行勾选：同步主键，供批量删除使用 */
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
          showQuickJumper: false,
          showTotal: (total) => t('common.paginationTotal', [total]),
        }}
        /* 默认批量选择提示隐藏 */
        tableAlertRender={false}
      />
      {/* 新增/编辑弹窗 */}
      <FormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        current={formCurrent}
        onSuccess={() => actionRef.current?.reload()}
      />
    </PageContainer>
  );
};

export default ConfigList;
