<!--
  页面：Dashboard（首页）
  功能：统计概览、日志趋势、最新消息
-->
<template>
  <div class="app-container dashboard">

    <!-- 第一排：指标卡片 -->
    <el-row :gutter="20">
      <el-col :xs="12" :sm="6" v-for="item in stats" :key="item.label">
        <el-card shadow="never" class="stat-card" :style="{ borderTopColor: item.color }">
          <div class="stat-body">
            <SvgIcon :icon-class="item.icon" class="stat-icon" :style="{ color: item.color }" />
            <div class="stat-info">
              <span class="stat-value" :style="{ color: item.color }">{{ item.value }}</span>
              <span class="stat-label">{{ item.label }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 第二排：折线图 + 消息列表 -->
    <el-row :gutter="20" class="row-chart">

      <!-- 折线图 -->
      <el-col :xs="24" :lg="17">
        <el-card shadow="hover" class="chart-card">
          <template v-slot:header>
            <div class="card-header">
              <div class="card-header-left">
                <SvgIcon icon-class="chart" />
                <span>审计日志趋势</span>
              </div>
              <el-radio-group v-model="chartDays" size="small" @change="loadChart">
                <el-radio-button :value="7">7天</el-radio-button>
                <el-radio-button :value="14">14天</el-radio-button>
                <el-radio-button :value="30">30天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="chartRef" class="chart-box"></div>
        </el-card>
      </el-col>

      <!-- 消息列表 -->
      <el-col :xs="24" :lg="7">
        <el-card shadow="hover" class="msg-card">
          <template v-slot:header>
            <div class="card-header">
              <SvgIcon icon-class="message" />
              <span>最新消息</span>
            </div>
          </template>
          <div v-if="messages.length === 0" class="msg-empty">暂无消息</div>
          <div v-else class="msg-list">
            <div v-for="item in messages" :key="item.id" class="msg-item">
              <div class="msg-title">{{ item.title }}</div>
              <div class="msg-meta">
                <el-tag size="small" :type="item.category === 1 ? 'warning' : 'success'">
                  {{ item.category === 1 ? '通知' : '公告' }}
                </el-tag>
                <span class="msg-time">{{ item.addTime }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

    </el-row>

  </div>
</template>

<script setup name="Index">

import { getStats, getLogTrend } from '@/api/dashboard'
import { listNoticeTop } from '@/api/system/message'
import * as echarts from 'echarts'

// 指标卡片
const stats = ref([
  { label: '用户数量', value: 0, icon: 'user', color: '#7265e6' },
  { label: '角色数量', value: 0, icon: 'peoples', color: '#2bb3c0' },
  { label: '日志数量', value: 0, icon: 'log', color: '#f5a623' },
  { label: '消息数量', value: 0, icon: 'message', color: '#f2706c' }
])

const messages = ref([])
const chartRef = ref(null)
const chartDays = ref(30)
let chartInstance = null

/**
 * init
 */
onMounted(() => {
  loadStats()
  loadMessages()
  nextTick(loadChart)
})

/**
 * destory
 */
onUnmounted(() => {
  chartInstance?.dispose()
})

/**
 * 指标卡片 - 数据加载
 */
function loadStats() {
  getStats().then(res => {
    const data = res.data
    stats.value[0].value = data.userCount
    stats.value[1].value = data.roleCount
    stats.value[2].value = data.logCount
    stats.value[3].value = data.messageCount
  })
}

/**
 * 消息列表 - 数据加载
 */
function loadMessages() {
  listNoticeTop().then(res => {
    messages.value = res.data || []
  })
}

/**
 * 日志趋势 - 数据加载
 */
function loadChart() {
  const days = chartDays.value
  getLogTrend(days).then(res => {
    const list = res.data || []

    // 生成完整日期序列，无数据日期补 0
    const dateMap = {}
    list.forEach(i => { dateMap[i.date] = i.count })

    const dates = []
    const counts = []
    const now = new Date()
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = formatDate(d)
      dates.push(key)
      counts.push(dateMap[key] || 0)
    }

    chartInstance = echarts.init(chartRef.value)
    chartInstance.setOption({
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
      series: [{
        data: counts,
        type: 'line',
        smooth: true,
        lineStyle: { width: 2, color: '#409EFF' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(64,158,255,0.3)' },
              { offset: 1, color: 'rgba(64,158,255,0.02)' }
            ]
          }
        },
        itemStyle: { color: '#409EFF' }
      }]
    })
  })
}

function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

</script>

<style scoped lang="scss">

.stat-card {
  margin-bottom: 16px;
  border-radius: 6px;
  border-top: 3px solid transparent;
  transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 2px 10px rgba(0,0,0,0.07); }
  :deep(.el-card__body) { padding: 18px 20px; }
}

.stat-body {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

.row-chart {
  margin-top: 4px;
}

.chart-card, .msg-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.chart-box {
  height: 300px;
  width: 100%;
}

.msg-empty {
  text-align: center;
  padding: 40px 0;
  color: #bbb;
  font-size: 13px;
}

.msg-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.msg-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child { border-bottom: none; }
}

.msg-title {
  font-size: 13px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 6px;
}

.msg-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.msg-time {
  font-size: 11px;
  color: #bbb;
}

html.dark {
  .stat-value { color: #e0e0e0; }
  .card-header { color: #e0e0e0; }
  .msg-title { color: #e0e0e0; }
  .msg-item { border-bottom-color: #2a2a3e; }
}
</style>
