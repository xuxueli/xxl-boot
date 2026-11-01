/**
 * 组件：ReadUsersDialog（已读用户弹窗）
 * 功能：展示某条消息的已读用户列表，分页加载。
 */
import { Modal, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';
import { t } from '@/i18n';
import { listMessageReadUsers } from '@/modules/framework/system/message/api';

/* 组件入参 */
interface ReadUsersDialogProps {
  open: boolean;         /* 是否显示 */
  message?: API.Message; /* 当前消息 */
  onClose: () => void;   /* 关闭回调 */
}

const columns: ColumnsType<API.MessageRead> = [
  {
    title: t('common.serialNo'),
    width: 70,
    align: 'center',
    render: (_v, _r, i) => i + 1,
  },
  { title: t('system.message.userName'), dataIndex: 'userName', align: 'center' },
  { title: t('common.realName'), dataIndex: 'realName', align: 'center' },
  { title: t('system.message.readTime'), dataIndex: 'addTime', align: 'center' },
];

function ReadUsersDialog({ open, message, onClose }: ReadUsersDialogProps) {
  const [list, setList] = useState<API.MessageRead[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  /** 加载已读用户列表（id 为必传，避免依赖 state 回调产生陈旧值） */
  const loadData = useCallback((id: number, page: number, size: number) => {
    setLoading(true);
    listMessageReadUsers({ messageId: id, current: page, pageSize: size })
      .then((res) => {
        const data = res.data;
        setList(data?.data || []);
        setTotal(data?.total || 0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /* 打开弹窗或切换消息时重置分页并加载已读用户列表 */
  useEffect(() => {
    if (!open) return;
    setCurrent(1);
    setPageSize(10);
    setList([]);
    setTotal(0);
    if (message?.id != null) {
      loadData(message.id, 1, 10);
    }
  }, [open, message, loadData]);

  /** 关闭弹窗，清空数据 */
  const handleClose = () => {
    setList([]);
    setTotal(0);
    onClose();
  };

  return (
    <Modal
      title={t('system.message.readUsersTitle', [message?.title || ''])}
      width={680}
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
    >
      <Table<API.MessageRead>
        rowKey="id"
        size="middle"
        loading={loading}
        columns={columns}
        dataSource={list}
        pagination={{
          current,
          pageSize,
          total,
          showTotal: (total) => t('system.message.paginationTotal', [total]),
          onChange: (page, size) => {
            setCurrent(page);
            setPageSize(size);
            if (message?.id != null) {
              loadData(message.id, page, size);
            }
          },
        }}
      />
    </Modal>
  );
}

export default ReadUsersDialog;