/**
 * 组件：ReadUsersDialog（已读用户弹窗）
 * 功能：展示某条消息的已读用户列表，分页加载。
 */
import { Modal, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { listMessageReadUsers } from '@/services/system/message';

export type ReadUsersDialogRef = {
  open: (row: API.Message) => void;
};

const columns: ColumnsType<API.MessageRead> = [
  { title: '序号', width: 70, align: 'center', render: (_v, _r, i) => i + 1 },
  { title: '登录名称', dataIndex: 'userName', align: 'center' },
  { title: '用户名称', dataIndex: 'realName', align: 'center' },
  { title: '阅读时间', dataIndex: 'addTime', align: 'center' },
];

const ReadUsersDialog = forwardRef<ReadUsersDialogRef>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [list, setList] = useState<API.MessageRead[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [messageId, setMessageId] = useState<number>();

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

  /** 打开弹窗：回显消息信息并加载已读用户列表 */
  const open = useCallback(
    (row: API.Message) => {
      setVisible(true);
      setTitle(row.title || '');
      setMessageId(row.id);
      setCurrent(1);
      setPageSize(10);
      setList([]);
      setTotal(0);
      if (row.id != null) {
        loadData(row.id, 1, 10);
      }
    },
    [loadData],
  );

  useImperativeHandle(ref, () => ({ open }));

  /** 关闭弹窗，清空数据 */
  const handleClose = () => {
    setVisible(false);
    setList([]);
    setTotal(0);
  };

  return (
    <Modal
      title={`「${title}」已读用户`}
      width={680}
      open={visible}
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
          showTotal: (t) => `共 ${t} 条`,
          onChange: (page, size) => {
            setCurrent(page);
            setPageSize(size);
            if (messageId != null) {
              loadData(messageId, page, size);
            }
          },
        }}
      />
    </Modal>
  );
});

export default ReadUsersDialog;
