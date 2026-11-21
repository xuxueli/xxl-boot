/**
 * @fileoverview 站内消息
 * @description 消息分页表格 + 新增/修改（富文本）/删除 + 详情抽屉 + 已读用户弹窗
 * @author xuxueli 2026-11-21
 */
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { App, Button, Space, Tag, Tooltip } from 'antd';
import { useMemo, useRef, useState } from 'react';
import {
  toSelectOptions,
  toValueEnum,
  useEnumOption,
} from '@/hooks/useEnumOption';
import { usePermission } from '@/hooks/usePermission';
import { t } from '@/i18n';
import { messageApi } from '@/modules/framework/system/message/api';
import MessageDetail from './MessageDetail';
import FormModal from './FormModal';
import ReadUsersDialog from './ReadUsersDialog';

/** 站内消息列表页 */
const MessageList = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const { hasPermi } = usePermission();

  // ---------------------- 页面状态 ----------------------

  const [detailOpen, setDetailOpen] = useState(false); /* 详情抽屉显隐 */
  const [detailPayload, setDetailPayload] =
    useState<number>(); /* 详情消息 ID */
  const [readOpen, setReadOpen] = useState(false); /* 已读弹窗显隐 */
  const [readMessage, setReadMessage] =
    useState<API.Message>(); /* 已读弹窗消息 */

  const [formOpen, setFormOpen] = useState(false);
  const [formCurrent, setFormCurrent] = useState<API.Message | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const messageCategoryOptions = useEnumOption('MessageCategoryEnum');
  const messageStatusOptions = useEnumOption('MessageStatusEnum');
  const statusValueEnum = toValueEnum(messageStatusOptions);
  // 分类映射：文字来自后端枚举，颜色按枚举顺序（首项高亮）区分
  const categoryMap = useMemo(() => {
    const map: Record<number, { text: string; color: string }> = {};
    messageCategoryOptions.forEach((o, index) => {
      map[o.code] = {
        text: o.title || '',
        color: index === 0 ? 'success' : 'warning',
      };
    });
    return map;
  }, [messageCategoryOptions]);
  const categorySelectOptions = toSelectOptions(messageCategoryOptions);

  // ---------------------- 数据操作 ----------------------

  /** 删除消息 */
  const handleDelete = (row?: API.Message) => {
    const ids = row ? [row.id as number] : selectedIds;
    if (ids.length === 0) return;
    modal.confirm({
      title: t('modal.title'),
      content: t('system.message.confirmDelete', [
        row?.title || t('system.message.batchDeleteName'),
      ]),
      onOk: async () => {
        await messageApi.delete(ids);
        message.success(t('common.deleteSuccess'));
        setSelectedIds([]);
        actionRef.current?.reload();
      },
    });
  };

  // ---------------------- 表格“列”定义 ----------------------

  /** 表格列：序号、标题、分类、状态、发送人、发送时间、操作 */
  const columns: ProColumns<API.Message>[] = [
    { title: t('common.serialNo'), dataIndex: 'id', search: false, width: 60 },
    {
      title: t('system.message.messageTitle'),
      dataIndex: 'title',
      width: 200,
      ellipsis: true,
      render: (_, record) => (
        <Tooltip title={record.title}>
          <a
            onClick={() => {
              setDetailPayload(record.id as number);
              setDetailOpen(true);
            }}
          >
            {record.title}
          </a>
        </Tooltip>
      ),
    },
    {
      title: t('system.message.category'),
      dataIndex: 'category',
      width: 80,
      valueEnum: toValueEnum(messageCategoryOptions),
      render: (_, record) => {
        const c = categoryMap[record.category ?? -1];
        return c ? <Tag color={c.color}>{c.text}</Tag> : '-';
      },
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      width: 80,
      valueEnum: statusValueEnum,
      render: (_, record) => (
        <Tag color={record.status === 0 ? 'success' : 'error'}>
          {record.status === 0
            ? t('common.normal')
            : t('system.message.offline')}
        </Tag>
      ),
    },
    {
      title: t('system.message.sender'),
      dataIndex: 'sender',
      search: false,
      width: 90,
    },
    {
      title: t('system.message.sendTime'),
      dataIndex: 'addTime',
      search: false,
      width: 160,
    },
    {
      title: t('common.operation'),
      valueType: 'option',
      width: 240,
      render: (_, record) => (
        <Space size="middle">
          <a
            key="readUsers"
            onClick={() => {
              setReadMessage(record);
              setReadOpen(true);
            }}
          >
            <TeamOutlined /> {t('system.message.readUsers')}
          </a>
          {hasPermi('system:message') && (
            <a
              key="edit"
              onClick={() => {
                setFormCurrent(record);
                setFormOpen(true);
              }}
            >
              <EditOutlined /> {t('common.modify')}
            </a>
          )}
          {hasPermi('system:message') && (
            <a key="delete" onClick={() => handleDelete(record)}>
              <DeleteOutlined /> {t('common.delete')}
            </a>
          )}
        </Space>
      ),
    },
  ];

  // ---------------------- 数据列表渲染 ----------------------

  return (
    <PageContainer ghost title={false}>
      <ProTable<API.Message>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        search={{
          labelWidth: 80,
          optionRender: (_searchConfig, _formProps, dom) => [...dom.reverse()],
        }}
        request={async (params) => {
          const res = await messageApi.pageList(params);
          return {
            data: res.data?.data || [],
            total: res.data?.total || 0,
            success: true,
          };
        }}
        toolBarRender={() => [
          hasPermi('system:message') && (
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
          hasPermi('system:message') && (
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
        categoryOptions={categorySelectOptions}
        onSuccess={() => actionRef.current?.reload()}
      />
      <MessageDetail
        open={detailOpen}
        payload={detailPayload}
        onClose={() => setDetailOpen(false)}
      />
      <ReadUsersDialog
        open={readOpen}
        message={readMessage}
        onClose={() => setReadOpen(false)}
      />
    </PageContainer>
  );
};

export default MessageList;
