/**
 * 页面：配置管理
 * 功能：配置分页表格 + 新增/修改/删除
 */
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { App, Button, Tag, Tooltip } from 'antd';
import { createStyles } from 'antd-style';
import React, { useRef, useState } from 'react';
import { t } from '@/i18n';
import { toValueEnum, useEnumOption } from '@/hooks/useEnumOption';
import { usePermission } from '@/hooks/usePermission';
import { delConfig, listConfig } from '@/modules/framework/system/config/api';
import ConfigFormModal from './ConfigFormModal';

/**
 * 配置表格样式
 * 功能：顶部操作按钮靠左展示，密度/刷新等设置项仍靠右
 */
const useStyles = createStyles(({ css }) => ({
  configTable: css`
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

const ConfigList = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const { hasRole } = usePermission();
  const { styles } = useStyles();

  const [formOpen, setFormOpen] = useState(false);
  const [formCurrent, setFormCurrent] = useState<API.Config | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const configStatusOptions = useEnumOption('ConfigStatusEnum');
  const statusValueEnum = toValueEnum(configStatusOptions);

  /** 删除配置 */
  const handleDelete = (row?: API.Config) => {
    const ids = row ? [row.id as number] : selectedIds;
    if (ids.length === 0) return;
    modal.confirm({
      title: t('modal.title'),
      content: t('system.config.confirmDelete', [
        row?.name || t('system.config.batchDeleteName'),
      ]),
      onOk: async () => {
        await delConfig(ids);
        message.success(t('common.deleteSuccess'));
        setSelectedIds([]);
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns<API.Config>[] = [
    { title: t('common.serialNo'), dataIndex: 'id', search: false, width: 80 },
    {
      title: t('system.config.configName'),
      dataIndex: 'name',
      ellipsis: true,
      render: (_, record) => (
        <Tooltip title={record.name}>{record.name}</Tooltip>
      ),
    },
    {
      title: t('system.config.configKey'),
      dataIndex: 'key',
      search: false,
      ellipsis: true,
      render: (_, record) => <Tooltip title={record.key}>{record.key}</Tooltip>,
    },
    {
      title: t('system.config.configValue'),
      dataIndex: 'value',
      search: false,
      ellipsis: true,
      render: (_, record) => (
        <Tooltip title={record.value}>{record.value}</Tooltip>
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
      title: t('common.remark'),
      dataIndex: 'remark',
      search: false,
      render: (_, record) => (
        <Tooltip title={record.remark}>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {record.remark}
          </div>
        </Tooltip>
      ),
    },
    { title: t('common.addTime'), dataIndex: 'addTime', search: false, width: 160 },
    {
      title: t('common.operation'),
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
          <EditOutlined /> {t('common.modify')}
        </a>,
        <a key="delete" onClick={() => handleDelete(record)}>
          <DeleteOutlined /> {t('common.delete')}
        </a>,
      ],
    },
  ];

  return (
    <PageContainer ghost title={false}>
      <div className={styles.configTable}>
        <ProTable<API.Config>
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          search={{
            labelWidth: 80,
            optionRender: (_searchConfig, _formProps, dom) => [
              ...dom.reverse(),
            ],
          }}
          request={async (params) => {
            const res = await listConfig(params);
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
                {t('common.add')}
              </Button>
            ),
            hasRole('admin') && (
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
          }}
          /* 默认批量选择提示隐藏 */
          tableAlertRender={false}
        />
      </div>
      <ConfigFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        current={formCurrent}
        onSuccess={() => actionRef.current?.reload()}
      />
    </PageContainer>
  );
};

export default ConfigList;