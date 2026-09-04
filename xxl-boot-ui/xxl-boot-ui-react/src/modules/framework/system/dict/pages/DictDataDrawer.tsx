/**
 * 组件：DictDataDrawer（字典数据抽屉）
 * 功能：展示某字典类型的字典项列表与统计
 */
import { Drawer, Empty, Spin, Statistic, Tag } from 'antd';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { listData } from '@/modules/framework/system/dict/api';

export type DictDataDrawerRef = {
  open: (row: API.Dict) => void;
};

const DictDataDrawer = forwardRef<DictDataDrawerRef>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [dict, setDict] = useState<API.Dict | null>(null);
  const [items, setItems] = useState<API.DictItem[]>([]);
  const [loading, setLoading] = useState(false);

  const open = useCallback((row: API.Dict) => {
    setDict(row);
    setVisible(true);
    setLoading(true);
    setItems([]);
    listData({ dictId: row.id, current: 1, pageSize: 100 })
      .then((res) => {
        setItems(res.data?.data || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useImperativeHandle(ref, () => ({ open }));

  const normalCount = items.filter((i) => i.status === 0).length;
  const inactiveCount = items.length - normalCount;

  return (
    <Drawer
      title={`字典数据（${dict?.name} - ${dict?.type}）`}
      size={700}
      open={visible}
      onClose={() => setVisible(false)}
      destroyOnHidden
    >
      <Spin spinning={loading}>
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginBottom: 16,
          }}
        >
          <Statistic title="共计条目" value={items.length} />
          <Statistic
            title="正常"
            value={normalCount}
            valueStyle={{ color: '#52c41a' }}
          />
          {inactiveCount > 0 && (
            <Statistic
              title="停用"
              value={inactiveCount}
              valueStyle={{ color: '#ff4d4f' }}
            />
          )}
        </div>
        {items.length === 0 ? (
          <Empty description="暂无字典数据" />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  border: '1px solid #f0f0f0',
                  borderRadius: 6,
                }}
              >
                <span>
                  {item.name}
                  <span style={{ marginLeft: 8, color: 'rgba(0,0,0,0.45)' }}>
                    Code：{item.code}
                  </span>
                </span>
                <Tag color={item.status === 0 ? 'success' : 'error'}>
                  {item.status === 0 ? '正常' : '停用'}
                </Tag>
              </div>
            ))}
          </div>
        )}
      </Spin>
    </Drawer>
  );
});

export default DictDataDrawer;
