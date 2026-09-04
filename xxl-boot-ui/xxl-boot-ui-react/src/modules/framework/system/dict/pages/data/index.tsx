/**
 * 页面：字典数据
 * 功能：某字典类型下的字典项分页管理（隐藏路由，从字典管理进入）
 */
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { App, Button, Tag } from 'antd';
import { createStyles } from 'antd-style';
import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { t } from '@/i18n';
import { toValueEnum, useEnumOption } from '@/hooks/useEnumOption';
import { usePermission } from '@/hooks/usePermission';
import { delData, listData } from '@/modules/framework/system/dict/api';
import DictDataFormModal from './DictDataFormModal';

/**
 * 字典项表格样式
 * 功能：顶部操作按钮靠左展示，密度/刷新等设置项仍靠右
 */
const useStyles = createStyles(({ css }) => ({
  dictDataTable: css`
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

const DictData = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const navigate = useNavigate();
  const { hasRole } = usePermission();
  const { styles } = useStyles();
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
      title: t('modal.title'),
      content: t('system.dict.confirmDeleteItem', [
        row?.name || t('system.dict.batchDeleteItemName'),
      ]),
      onOk: async () => {
        await delData(ids);
        message.success(t('common.deleteSuccess'));
        setSelectedIds([]);
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns<API.DictItem>[] = [
    { title: t('common.serialNo'), dataIndex: 'id', search: false, width: 80 },
    { title: t('system.dict.itemName'), dataIndex: 'name' },
    { title: t('system.dict.itemCode'), dataIndex: 'code', search: false },
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
    { title: t('system.dict.order'), dataIndex: 'order', search: false, width: 90 },
    { title: t('common.remark'), dataIndex: 'remark', search: false },
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
      <div className={styles.dictDataTable}>
        <ProTable<API.DictItem>
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          search={{
            labelWidth: 80,
            optionRender: (_searchConfig, _formProps, dom) => [
              ...dom.reverse(),
            ],
          }}
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
          }}
          /* 默认批量选择提示隐藏 */
          tableAlertRender={false}
        />
      </div>
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