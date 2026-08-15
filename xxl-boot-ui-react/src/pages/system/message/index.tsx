/**
 * 页面：站内消息
 * 功能：消息分页表格 + 新增/修改（富文本）/删除 + 详情抽屉 + 已读用户弹窗
 */
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { App, Button, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { MessageDetail, ReadUsersDialog } from '@/components';
import type { MessageDetailRef } from '@/components/MessageDetail';
import type { ReadUsersDialogRef } from '@/components/ReadUsersDialog';
import { toValueEnum, useEnumOption } from '@/hooks/useEnumOption';
import { delMessage, listMessage } from '@/services/system/message';
import { usePermission } from '@/hooks/usePermission';
import MessageFormModal from './MessageFormModal';

const categoryMap: Record<number, { text: string; color: string }> = {
  0: { text: '通知', color: 'success' },
  1: { text: '公告', color: 'warning' },
};

const MessageList = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const messageViewRef = useRef<MessageDetailRef>(null);
  const readUsersRef = useRef<ReadUsersDialogRef>(null);
  const { hasRole } = usePermission();

  const [formOpen, setFormOpen] = useState(false);
  const [formCurrent, setFormCurrent] = useState<API.Message | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const messageStatusOptions = useEnumOption('MessageStatusEnum');
  const statusValueEnum = toValueEnum(messageStatusOptions);

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
    { title: '序号', dataIndex: 'id', search: false, width: 80 },
    {
      title: '消息标题',
      dataIndex: 'title',
      render: (_, record) => (
        <a
          onClick={() => {
            messageViewRef.current?.open(record.id as number);
          }}
        >
          {record.title}
        </a>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      search: false,
      width: 90,
      render: (_, record) => {
        const c = categoryMap[record.category ?? -1];
        return c ? <Tag color={c.color}>{c.text}</Tag> : '-';
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      valueEnum: statusValueEnum,
      render: (_, record) => (
        <Tag color={record.status === 0 ? 'success' : 'error'}>
          {record.status === 0 ? '正常' : '下线'}
        </Tag>
      ),
    },
    { title: '发送人', dataIndex: 'sender', search: false },
    { title: '发送时间', dataIndex: 'addTime', search: false, width: 160 },
    {
      title: '操作',
      valueType: 'option',
      width: 180,
      render: (_, record) => [
        <a
          key="readUsers"
          onClick={() => {
            readUsersRef.current?.open(record);
          }}
        >
          阅读用户
        </a>,
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
      <ProTable<API.Message>
        headerTitle="消息列表"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
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
      <MessageFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        current={formCurrent}
        onSuccess={() => actionRef.current?.reload()}
      />
      <MessageDetail ref={messageViewRef} />
      <ReadUsersDialog ref={readUsersRef} />
    </PageContainer>
  );
};

export default MessageList;
