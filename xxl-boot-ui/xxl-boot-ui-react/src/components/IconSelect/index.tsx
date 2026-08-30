/**
 * 组件：IconSelect（图标选择）
 * 功能：从 antd 图标清单中选取图标，用于资源管理菜单图标字段。
 */
import { DownOutlined } from '@ant-design/icons';
import { Empty, Input, Popover } from 'antd';
import { createStyles } from 'antd-style';
import React, { useMemo, useState } from 'react';
import { getIconComponent, iconList } from '@/utils/icon';

const useStyles = createStyles(({ token, css }) => ({
  trigger: css`
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  `,
  grid: css`
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 4px;
    padding: 8px;
  `,
  item: css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 18px;
    color: ${token.colorTextSecondary};

    &:hover {
      background: ${token.colorFillSecondary};
      color: ${token.colorPrimary};
    }
  `,
  selected: css`
    background: ${token.colorPrimaryBg};
    color: ${token.colorPrimary};
  `,
  preview: css`
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: 4px;
    font-size: 16px;
  `,
}));

export type IconSelectProps = {
  value?: string;
  onChange?: (value?: string) => void;
  placeholder?: string;
};

const IconSelect = ({
  value,
  onChange,
  placeholder = '请选择图标',
}: IconSelectProps) => {
  const { styles } = useStyles();
  const [keyword, setKeyword] = useState('');
  const [open, setOpen] = useState(false);

  // 过滤图标列表，根据关键字搜索
  const filtered = useMemo(
    () =>
      iconList.filter((name) =>
        name.toLowerCase().includes(keyword.toLowerCase()),
      ),
    [keyword],
  );

  // 获取当前选中图标的组件
  const Icon = getIconComponent(value);

  return (
    <Popover
      open={open}
      trigger="click"
      onOpenChange={setOpen}
      placement="bottomLeft"
      content={
        <div style={{ width: 280 }}>
          <Input
            size="small"
            placeholder="搜索图标"
            allowClear
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ marginBottom: 4 }}
          />
          {filtered.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="无匹配图标"
            />
          ) : (
            <div className={styles.grid}>
              {filtered.map((name) => {
                const ItemIcon = getIconComponent(name);
                return (
                  <div
                    key={name}
                    className={
                      name === value
                        ? `${styles.item} ${styles.selected}`
                        : styles.item
                    }
                    onClick={() => {
                      onChange?.(name);
                      setOpen(false);
                    }}
                    title={name}
                  >
                    {ItemIcon && <ItemIcon />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      }
    >
      <div className={styles.trigger}>
        {Icon ? (
          <div className={styles.preview}>
            <Icon />
          </div>
        ) : (
          <div className={styles.preview} style={{ color: 'rgba(0,0,0,0.25)' }}>
            <DownOutlined />
          </div>
        )}
        <span style={{ color: value ? 'inherit' : 'rgba(0,0,0,0.25)' }}>
          {value || placeholder}
        </span>
      </div>
    </Popover>
  );
};

export default IconSelect;
