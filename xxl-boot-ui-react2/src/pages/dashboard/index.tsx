/**
 * 页面：Dashboard（首页）
 * 功能：统计概览、日志趋势、最新消息
 */

import {
  FileTextOutlined,
  MessageOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Line } from '@ant-design/plots';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { App, Card, Empty, Radio, Tag } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MessageDetail } from '@/components';
import type { MessageDetailRef } from '@/components/MessageDetail';
import { getLogTrend, getStats } from '@/services/xxl-boot/dashboard';
import {
  listMessageTop,
  markMessageRead,
} from '@/services/xxl-boot/system/message';

const useStyles = createStyles(({ token, css }) => ({
  statCard: css`
    margin-bottom: 16px;
    border-radius: ${token.borderRadiusLG}px;
  `,
  statBody: css`
    display: flex;
    align-items: center;
    gap: 14px;
  `,
  statIconWrap: css`
    width: 50px;
    height: 50px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  `,
  statIcon: css`
    font-size: 22px;
  `,
  statInfo: css`
    display: flex;
    flex-direction: column;
  `,
  statValue: css`
    font-size: 26px;
    font-weight: 500;
    color: ${token.colorText};
    line-height: 1.2;
  `,
  statLabel: css`
    font-size: 13px;
    color: ${token.colorTextTertiary};
    margin-top: 4px;
  `,
  msgItem: css`
    padding: 12px 0;
    border-bottom: 1px solid ${token.colorBorderSecondary};
    cursor: pointer;

    &:last-child {
      border-bottom: none;
    }
  `,
  msgTitle: css`
    font-size: 13px;
    color: ${token.colorText};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 6px;
  `,
  msgMeta: css`
    display: flex;
    align-items: center;
    gap: 8px;
  `,
  msgTime: css`
    font-size: 11px;
    color: ${token.colorTextQuaternary};
  `,
}));

/** 指标卡片配置 */
const statConfig = [
  {
    key: 'userCount',
    label: '用户数量',
    icon: <UserOutlined />,
    color: '#5b6abf',
    bg: '#eef0fb',
  },
  {
    key: 'roleCount',
    label: '角色数量',
    icon: <TeamOutlined />,
    color: '#319c8a',
    bg: '#e8f6f3',
  },
  {
    key: 'logCount',
    label: '日志数量',
    icon: <FileTextOutlined />,
    color: '#d4943c',
    bg: '#fcf4e8',
  },
  {
    key: 'messageCount',
    label: '消息数量',
    icon: <MessageOutlined />,
    color: '#c5566a',
    bg: '#fbeef1',
  },
] as const;

const Dashboard: React.FC = () => {
  const { styles } = useStyles();
  const { message: messageApi } = App.useApp();
  const messageDetailRef = useRef<MessageDetailRef>(null);

  const [stats, setStats] = useState<API.DashboardStats>({});
  const [messages, setMessages] = useState<API.Message[]>([]);
  const [chartDays, setChartDays] = useState(30);
  const [trendData, setTrendData] = useState<API.LogTrendItem[]>([]);

  /** 指标卡片 - 数据加载 */
  const loadStats = () => {
    getStats()
      .then((res) => {
        setStats(res.data || {});
      })
      .catch(() => {
        messageApi.error('统计数据加载失败');
      });
  };

  /** 消息列表 - 数据加载 */
  const loadMessages = () => {
    listMessageTop()
      .then((res) => {
        setMessages(res.data || []);
      })
      .catch(() => {});
  };

  /** 加载日志趋势折线图：补全连续日期，无数据补 0 */
  const loadChart = (days: number) => {
    getLogTrend(days)
      .then((res) => {
        const list = res.data || [];
        const dateMap: Record<string, number> = {};
        list.forEach((i) => {
          if (i.date) dateMap[i.date] = i.count || 0;
        });
        const data: API.LogTrendItem[] = [];
        const now = new Date();
        for (let i = days - 1; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          data.push({ date: key, count: dateMap[key] || 0 });
        }
        setTrendData(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadStats();
    loadMessages();
    loadChart(30);
  }, []);

  /** 消息列表 - 点击查看详情，标记已读 */
  const handleMsgClick = (item: API.Message) => {
    messageDetailRef.current?.open(item.id as number);
    markMessageRead(item.id as number).catch(() => {});
  };

  const chartData = useMemo(
    () =>
      trendData.map((i) => ({
        date: i.date,
        count: i.count,
      })),
    [trendData],
  );

  return (
    <PageContainer ghost title={false}>
      {/* 第一排：指标卡片 */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {statConfig.map((item) => (
          <Card
            key={item.key}
            className={styles.statCard}
            style={{ flex: 1, minWidth: 220 }}
            variant="borderless"
          >
            <div className={styles.statBody}>
              <div
                className={styles.statIconWrap}
                style={{ background: item.bg }}
              >
                <span className={styles.statIcon} style={{ color: item.color }}>
                  {item.icon}
                </span>
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats[item.key] ?? 0}</span>
                <span className={styles.statLabel}>{item.label}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 第二排：折线图 + 消息列表 */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <ProCard
          style={{ flex: 1, minWidth: 480, marginBottom: 20 }}
          title="审计日志"
          extra={
            <Radio.Group
              size="small"
              value={chartDays}
              onChange={(e) => {
                setChartDays(e.target.value);
                loadChart(e.target.value);
              }}
            >
              <Radio.Button value={7}>7天</Radio.Button>
              <Radio.Button value={14}>14天</Radio.Button>
              <Radio.Button value={30}>30天</Radio.Button>
            </Radio.Group>
          }
        >
          <Line
            data={chartData}
            xField="date"
            yField="count"
            height={320}
            smooth
            area={{
              style: {
                fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1677ff',
                opacity: 0.3,
              },
            }}
            line={{
              style: { stroke: '#1677ff', lineWidth: 2 },
            }}
            xAxis={{
              label: {
                // 标签保持横向，过密时隐藏部分刻度，避免日期竖排
                align: 'horizontal',
                overlap: [{ type: 'hide' }],
                style: { fontSize: 11, fill: '#909399' },
              },
              tickLine: { length: 4 },
            }}
            yAxis={{
              minInterval: 1,
              label: { fontSize: 11, fill: '#909399' },
            }}
            tooltip={{ title: 'date', items: [{ channel: 'y' }] }}
          />
        </ProCard>

        <ProCard
          style={{ width: 320, minWidth: 260, marginBottom: 20 }}
          title="站内消息"
        >
          {messages.length === 0 ? (
            <Empty description="暂无消息" />
          ) : (
            <div>
              {messages.map((item) => (
                <div
                  key={item.id}
                  className={styles.msgItem}
                  onClick={() => handleMsgClick(item)}
                >
                  <div className={styles.msgTitle}>{item.title}</div>
                  <div className={styles.msgMeta}>
                    <Tag
                      color={item.category === 1 ? 'warning' : 'success'}
                      style={{ marginRight: 0 }}
                    >
                      {item.category === 1 ? '通知' : '公告'}
                    </Tag>
                    <span className={styles.msgTime}>{item.addTime}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ProCard>
      </div>

      <MessageDetail ref={messageDetailRef} />
    </PageContainer>
  );
};

export default Dashboard;
