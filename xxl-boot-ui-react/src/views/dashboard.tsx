/**
 * 页面：Dashboard（首页）
 * 功能：统计概览、日志趋势、最新消息
 */
import { useEffect, useRef, useState } from 'react'
import { Card, Col, Row, Radio, Tag } from 'antd'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import SvgIcon from '@/components/SvgIcon'
import HeaderMessageDetail, { type HeaderMessageDetailHandle } from '@/layout/components/Navbar/HeaderMessageDetail'
import { getStats, getLogTrend } from '@/api/dashboard'
import { listMessageTop, markMessageRead } from '@/api/system/message'
import { parseTime } from '@/utils/common'
import type { Message } from '@/types/api'
import './dashboard.scss'

/** 指标卡片项 */
interface StatItem {
  label: string
  value: number
  icon: string
  color: string
  bg: string
}

export default function Dashboard() {
  // 指标卡片
  const [stats, setStats] = useState<StatItem[]>([
    { label: '用户数量', value: 0, icon: 'user', color: '#5b6abf', bg: '#eef0fb' },
    { label: '角色数量', value: 0, icon: 'peoples', color: '#319c8a', bg: '#e8f6f3' },
    { label: '日志数量', value: 0, icon: 'log', color: '#d4943c', bg: '#fcf4e8' },
    { label: '消息数量', value: 0, icon: 'message', color: '#c5566a', bg: '#fbeef1' }
  ])
  const [messages, setMessages] = useState<Message[]>([])
  const [chartDays, setChartDays] = useState(30)
  const chartRef = useRef<HTMLDivElement>(null)
  const messageDetailRef = useRef<HeaderMessageDetailHandle>(null)
  const chartInstanceRef = useRef<ECharts | null>(null)

  /**
   * 指标卡片 - 数据加载
   */
  const loadStats = () => {
    getStats().then((res) => {
      const data = res.data
      setStats((prev) => {
        const next = [...prev]
        next[0].value = data.userCount
        next[1].value = data.roleCount
        next[2].value = data.logCount
        next[3].value = data.messageCount
        return next
      })
    })
  }

  /**
   * 消息列表 - 数据加载
   */
  const loadMessages = () => {
    listMessageTop().then((res) => {
      setMessages(res.data || [])
    })
  }

  /**
   * 消息列表 - 点击查看详情，标记已读
   */
  const handleMsgClick = (item: Message) => {
    messageDetailRef.current?.open(item.id as number)
    markMessageRead(item.id as number)
  }

  /**
   * 加载日志趋势折线图
   */
  const loadChart = () => {
    const days = chartDays
    getLogTrend(days).then((res) => {
      const list = res.data || []

      // 1、转为 Map：date → count
      const dateMap: Record<string, number> = {}
      list.forEach((i: any) => {
        dateMap[i.date] = i.count
      })

      // 2、生成连续日期序列
      const dates: string[] = []
      const counts: number[] = []
      const now = new Date()
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        const key = parseTime(d, '{y}-{m}-{d}') || ''
        dates.push(key)
        counts.push(dateMap[key] || 0)
      }

      // 3、渲染折线图（渐变面积 + 平滑曲线）
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose()
      }
      if (!chartRef.current) return
      chartInstanceRef.current = echarts.init(chartRef.current)
      chartInstanceRef.current.setOption({
        tooltip: { trigger: 'axis' },
        grid: { left: 40, right: 20, bottom: 30, top: 20 },
        xAxis: {
          type: 'category',
          data: dates,
          axisLabel: { fontSize: 11, color: '#909399' }
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          axisLabel: { fontSize: 11, color: '#909399' }
        },
        series: [
          {
            data: counts,
            type: 'line',
            smooth: true,
            lineStyle: { width: 2, color: '#409EFF' },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(64,158,255,0.3)' },
                  { offset: 1, color: 'rgba(64,158,255,0.02)' }
                ]
              }
            },
            itemStyle: { color: '#409EFF' }
          }
        ]
      })
    })
  }

  /**
   * init
   */
  useEffect(() => {
    loadStats()
    loadMessages()
    loadChart()
    return () => {
      chartInstanceRef.current?.dispose()
    }
     
  }, [])

  // 图表天数切换
  useEffect(() => {
    if (chartRef.current) {
      loadChart()
    }
     
  }, [chartDays])

  return (
    <div className="app-container dashboard">
      {/* 第一排：指标卡片 */}
      <Row gutter={20}>
        {stats.map((item) => (
          <Col xs={12} sm={6} key={item.label}>
            <Card className="stat-card" styles={{ body: { padding: '18px 20px' } }}>
              <div className="stat-body">
                <div className="stat-icon-wrap" style={{ background: item.bg }}>
                  <SvgIcon iconClass={item.icon} className="stat-icon" style={{ color: item.color }} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{item.value}</span>
                  <span className="stat-label">{item.label}</span>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 第二排：折线图 + 消息列表 */}
      <Row gutter={20} className="row-chart">
        <Col xs={24} lg={17}>
          <Card
            className="chart-card"
            title={
              <div className="card-header">
                <div className="card-header-left">
                  <SvgIcon iconClass="chart" />
                  <span>审计日志</span>
                </div>
                <Radio.Group
                  size="small"
                  value={chartDays}
                  onChange={(e) => setChartDays(e.target.value)}
                  options={[
                    { label: '7天', value: 7 },
                    { label: '14天', value: 14 },
                    { label: '30天', value: 30 }
                  ]}
                />
              </div>
            }
          >
            <div ref={chartRef} className="chart-box" />
          </Card>
        </Col>

        {/* 消息列表 */}
        <Col xs={24} lg={7}>
          <Card
            className="msg-card"
            title={
              <div className="card-header">
                <div className="card-header-left">
                  <SvgIcon iconClass="list" />
                  <span>站内消息</span>
                </div>
              </div>
            }
          >
            {messages.length === 0 ? (
              <div className="msg-empty">暂无消息</div>
            ) : (
              <div className="msg-list">
                {messages.map((item) => (
                  <div key={item.id} className="msg-item" onClick={() => handleMsgClick(item)}>
                    <div className="msg-title">{item.title}</div>
                    <div className="msg-meta">
                      <Tag color={item.category === 1 ? 'orange' : 'green'} style={{ marginRight: 8 }}>
                        {item.category === 1 ? '通知' : '公告'}
                      </Tag>
                      <span className="msg-time">{item.addTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 消息详情 */}
      <HeaderMessageDetail ref={messageDetailRef} />
    </div>
  )
}
