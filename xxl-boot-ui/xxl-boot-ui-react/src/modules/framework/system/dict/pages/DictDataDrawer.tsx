/**
 * 组件：DictDataDrawer（字典数据抽屉）
 * 功能：展示某字典类型的字典项列表与统计
 */
import { Drawer, Empty, Spin, Statistic, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { t } from '@/i18n';
import { listData } from '@/modules/framework/system/dict/api';

/* 组件入参 */
interface DictDataDrawerProps {
  open: boolean;         /* 是否显示 */
  dict: API.Dict | null; /* 当前字典 */
  onClose: () => void;   /* 关闭回调 */
}

function DictDataDrawer({ open, dict, onClose }: DictDataDrawerProps) {
  const [items, setItems] = useState<API.DictItem[]>([]);
  const [loading, setLoading] = useState(false);

  /* 打开抽屉或切换字典时加载字典项 */
  useEffect(() => {
    if (!open || !dict) return;
    setLoading(true);
    setItems([]);
    listData({ dictId: dict.id, current: 1, pageSize: 100 })
      .then((res) => {
        setItems(res.data?.data || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [open, dict]);

  const normalCount = items.filter((i) => i.status === 0).length;
  const inactiveCount = items.length - normalCount;

  return (
    <Drawer
      title={t('system.dict.dictDataTitle', [
        dict?.name ?? '',
        dict?.type ?? '',
      ])}
      size={700}
      open={open}
      onClose={onClose}
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
          <Statistic title={t('system.dict.itemTotal')} value={items.length} />
          <Statistic
            title={t('common.normal')}
            value={normalCount}
            valueStyle={{ color: '#52c41a' }}
          />
          {inactiveCount > 0 && (
            <Statistic
              title={t('common.disabled')}
              value={inactiveCount}
              valueStyle={{ color: '#ff4d4f' }}
            />
          )}
        </div>
        {items.length === 0 ? (
          <Empty description={t('system.dict.emptyData')} />
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
                    {t('system.dict.itemCodeText', [item.code ?? 0])}
                  </span>
                </span>
                <Tag color={item.status === 0 ? 'success' : 'error'}>
                  {item.status === 0 ? t('common.normal') : t('common.disabled')}
                </Tag>
              </div>
            ))}
          </div>
        )}
      </Spin>
    </Drawer>
  );
}

export default DictDataDrawer;