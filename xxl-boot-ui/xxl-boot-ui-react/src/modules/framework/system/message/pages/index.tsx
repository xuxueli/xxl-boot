/**
 * 页面：站内消息
 * 功能：消息分页表格 + 新增/修改（富文本）/删除 + 详情抽屉 + 已读用户弹窗
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
import { createStyles } from 'antd-style';
import React, { useMemo, useRef, useState } from 'react';
import {
  toSelectOptions,
  toValueEnum,
  useEnumOption,
} from '@/hooks/useEnumOption';
import { usePermission } from '@/hooks/usePermission';
import { delMessage, listMessage } from '@/modules/framework/system/message/api';
import MessageDetail, { type MessageDetailRef } from './MessageDetail';
import MessageFormModal from './MessageFormModal';
import ReadUsersDialog, { type ReadUsersDialogRef } from './ReadUsersDialog';

/**
 * 消息表格样式
 * 功能：顶部操作按钮靠左展示，密度/刷新等设置项仍靠右
 */
const useStyles = createStyles(({ css }) => ({
  messageTable: css`
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

const MessageList = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const messageViewRef = useRef<MessageDetailRef>(null);
  const readUsersRef = useRef<ReadUsersDialogRef>(null);
  const { hasRole } = usePermission();
  const { styles } = useStyles();

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

  /** 删除消息 */
  const handleDelete = (row?: API.Message) => {
    const ids = row ? [row.id as number] : selectedIds;
    if (ids.length === 0) return;
    modal.confirm({
      title: '系统提示',
      content: `是否确认删除名称为"${row?.title || '这些消息'}"的数据项？`,
      onOk: async () => {
        await delMessage(ids);
        message.success('删除成功');
        setSelectedIds([]);
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns<API.Message>[] = [
    { title: '序号', dataIndex: 'id', search: false, width: 60 },
    {
      title: '消息标题',
      dataIndex: 'title',
      width: 200,
      ellipsis: true,
      render: (_, record) => (
        <Tooltip title={record.title}>
          <a
            onClick={() => {
              messageViewRef.current?.open(record.id as number);
            }}
          >
            {record.title}
          </a>
        </Tooltip>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 80,
      valueEnum: toValueEnum(messageCategoryOptions),
      render: (_, record) => {
        const c = categoryMap[record.category ?? -1];
        return c ? <Tag color={c.color}>{c.text}</Tag> : '-';
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      valueEnum: statusValueEnum,
      render: (_, record) => (
        <Tag color={record.status === 0 ? 'success' : 'error'}>
          {record.status === 0 ? '正常' : '下线'}
        </Tag>
      ),
    },
    { title: '发送人', dataIndex: 'sender', search: false, width: 90 },
    { title: '发送时间', dataIndex: 'addTime', search: false, width: 160 },
    {
      title: '操作',
      valueType: 'option',
      width: 240,
      render: (_, record) => (
        <Space size="middle">
          <a
            key="readUsers"
            onClick={() => {
              readUsersRef.current?.open(record);
            }}
          >
            <TeamOutlined /> 阅读用户
          </a>
          <a
            key="edit"
            onClick={() => {
              setFormCurrent(record);
              setFormOpen(true);
            }}
          >
            <EditOutlined /> 修改
          </a>
          <a key="delete" onClick={() => handleDelete(record)}>
            <DeleteOutlined /> 删除
          </a>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer ghost title={false}>
      <div className={styles.messageTable}>
        <ProTable<API.Message>
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
            const res = await listMessage(params);
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
            hasRole('admin') && (
              <Button
                key="delete"
                danger
                icon={<DeleteOutlined />}
                disabled={!selectedIds.length}
                onClick={() => handleDelete()}
              >
                删除
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
      <MessageFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        current={formCurrent}
        categoryOptions={categorySelectOptions}
        onSuccess={() => actionRef.current?.reload()}
      />
      <MessageDetail ref={messageViewRef} />
      <ReadUsersDialog ref={readUsersRef} />
    </PageContainer>
  );
};

export default MessageList;
