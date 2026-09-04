/**
 * 页面：字典管理
 * 功能：字典类型分页表格 + 新增/修改/删除 + 字典数据抽屉
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
import { createStyles } from 'antd-style';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from '@/i18n';
import { toValueEnum, useEnumOption } from '@/hooks/useEnumOption';
import { usePermission } from '@/hooks/usePermission';
import { delType, listType } from '@/modules/framework/system/dict/api';
import DictDataDrawer, { type DictDataDrawerRef } from './DictDataDrawer';
import DictFormModal from './DictFormModal';

/**
 * 字典表格样式
 * 功能：顶部操作按钮靠左展示，密度/刷新等设置项仍靠右
 */
const useStyles = createStyles(({ css }) => ({
  dictTable: css`
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

const DictList = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const drawerRef = useRef<DictDataDrawerRef>(null);
  const navigate = useNavigate();
  const { hasRole } = usePermission();
  const { styles } = useStyles();

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
      title: t('modal.title'),
      content: t('system.dict.confirmDelete', [
        row?.name || t('system.dict.batchDeleteName'),
      ]),
      onOk: async () => {
        await delType(ids);
        message.success(t('common.deleteSuccess'));
        setSelectedIds([]);
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns<API.Dict>[] = [
    { title: t('common.serialNo'), dataIndex: 'id', search: false, width: 80 },
    { title: t('system.dict.dictName'), dataIndex: 'name' },
    {
      title: t('system.dict.dictType'),
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
    { title: t('common.addTime'), dataIndex: 'addTime', search: false, width: 160 },
    {
      title: t('common.operation'),
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
          <EditOutlined /> {t('common.modify')}
        </a>,
        <a
          key="list"
          onClick={() => {
            navigate(`/system/dict/data?dictId=${record.id}`);
          }}
        >
          <UnorderedListOutlined /> {t('system.dict.dataList')}
        </a>,
        <a key="delete" onClick={() => handleDelete(record)}>
          <DeleteOutlined /> {t('common.delete')}
        </a>,
      ],
    },
  ];

  return (
    <PageContainer ghost title={false}>
      <div className={styles.dictTable}>
        <ProTable<API.Dict>
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