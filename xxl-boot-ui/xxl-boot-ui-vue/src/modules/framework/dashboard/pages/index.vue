<!--
  Dashboard（首页）
  功能：统计概览、日志趋势、最新消息
  @author xuxueli 2026-11-22
-->
<template>
  <div class="app-container dashboard">
    <!-- 第一排：指标卡片 -->
    <el-row :gutter="20">
      <el-col :xs="12" :sm="6" v-for="item in stats" :key="item.label">
        <el-card shadow="never" class="stat-card">
          <div class="stat-body">
            <div class="stat-icon-wrap" :style="{ background: item.bg }">
              <SvgIcon :icon-class="item.icon" class="stat-icon" :style="{ color: item.color }" />
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ item.value }}</span>
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
                <span>{{ t('dashboard.auditLog') }}</span>
              </div>
              <el-radio-group v-model="chartDays" size="small" @change="loadChart">
                <el-radio-button :value="7">{{ t('dashboard.days7') }}</el-radio-button>
                <el-radio-button :value="14">{{ t('dashboard.days14') }}</el-radio-button>
                <el-radio-button :value="30">{{ t('dashboard.days30') }}</el-radio-button>
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
              <div class="card-header-left">
                <SvgIcon icon-class="list" />
                <span>{{ t('dashboard.message') }}</span>
              </div>
            </div>
          </template>
          <div v-if="messages.length === 0" class="msg-empty">{{ t('dashboard.messageEmpty') }}</div>
          <div v-else class="msg-list">
            <div v-for="item in messages" :key="item.id" class="msg-item" @click="handleMsgClick(item)">
              <div class="msg-title">{{ item.title }}</div>
              <div class="msg-meta">
                <el-tag size="small" :type="item.category === 0 ? 'success' : 'warning'">
                  {{ enumTitle(categoryOptions, item.category) }}
                </el-tag>
                <span class="msg-time">{{ item.addTime }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 消息详情 -->
    <MessageDetailView ref="messageDetailRef" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Dashboard' })
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import * as echarts from 'echarts'
import { t } from '@/i18n'
import { SvgIcon } from '@/components'
import { enumTitle, useEnumOption } from '@/composables/useEnumOption'
import { parseTime } from '@/utils/common'
import { dashboardApi } from '../api'
import { messageApi } from '@/modules/framework/system/message/api'
import MessageDetailView from '@/layout/components/Navbar/HeaderMessageDetail.vue'
import type { ECharts } from 'echarts'
import type { Message } from '@/modules/framework/system/message/types'

/** 指标卡片项 */
interface StatItem {
  /** 卡片标题 */
  label: string
  /** 统计数值 */
  value: number
  /** 图标名 */
  icon: string
  /** 图标颜色 */
  color: string
  /** 图标背景色 */
  bg: string
}

// ---------------------- 响应式数据 ----------------------

// 指标卡片：顺序固定为用户、角色、日志、消息，加载后按下标回填数值
const stats = ref<StatItem[]>([
  { label: t('dashboard.userCount'), value: 0, icon: 'user', color: '#5b6abf', bg: '#eef0fb' },
  { label: t('dashboard.roleCount'), value: 0, icon: 'peoples', color: '#319c8a', bg: '#e8f6f3' },
  { label: t('dashboard.logCount'), value: 0, icon: 'log', color: '#d4943c', bg: '#fcf4e8' },
  { label: t('dashboard.messageCount'), value: 0, icon: 'message', color: '#c5566a', bg: '#fbeef1' }
])

// 顶部消息列表
const messages = ref<Message[]>([])

// 消息分类选项，由后端枚举接口加载
const { MessageCategoryEnum: categoryOptions } = useEnumOption('MessageCategoryEnum')

// 折线图容器与统计天数（默认最近 30 天）
const chartRef = ref<HTMLElement>()
const chartDays = ref(30)

// 消息详情抽屉
const messageDetailRef = ref<InstanceType<typeof MessageDetailView>>()

// ECharts 实例与容器尺寸监听器，卸载时统一释放
let chartInstance: ECharts | null = null
let resizeObserver: ResizeObserver | null = null

// ---------------------- 数据检索 ----------------------

/** 指标卡片 - 数据加载 */
function loadStats() {
  dashboardApi
    .stats()
    .then((response) => {
      const data = response.data
      // 无数据时保留卡片默认值 0
      if (!data) return
      stats.value[0].value = data.userCount
      stats.value[1].value = data.roleCount
      stats.value[2].value = data.logCount
      stats.value[3].value = data.messageCount
    })
    .catch(() => {
      // 错误已由请求层提示，卡片保留默认值
    })
}

/** 顶部消息列表 - 数据加载 */
function loadMessages() {
  messageApi
    .listTop()
    .then((response) => {
      messages.value = response.data || []
    })
    .catch(() => {
      // 错误已由请求层提示，列表保持为空
    })
}

/**
 * 加载日志趋势折线图
 *
 * 1. 请求后端获取指定天数内的每日日志量
 * 2. 将返回的 [{date, count}] 转为 Map，便于按日期查找
 * 3. 生成完整的日期序列（从 days-1 天前 → 今天），无数据日期补 0，确保折线图连续不断点
 * 4. 初始化 ECharts 实例，配置折线图选项
 */
function loadChart() {
  const days = chartDays.value
  dashboardApi
    .logTrend(days)
    .then((response) => {
      // 图表容器尚未挂载时直接返回，避免 echarts.init 报错
      const chartEl = chartRef.value
      if (!chartEl) return
      // 后端返回 [{date: '2026-07-11', count: 3}, ...]
      const list = response.data || []

      // 1、转为 Map：date → count，方便按日期查找
      const dateMap: Record<string, number> = {}
      list.forEach((item) => {
        dateMap[item.date] = item.count
      })

      // 2、生成连续日期序列，每天对应一个数据点
      const dates: string[] = []
      const counts: number[] = []
      const now = new Date()
      for (let i = days - 1; i >= 0; i--) {
        const day = new Date(now)
        day.setDate(day.getDate() - i)
        const key = parseTime(day, '{y}-{m}-{d}')

        dates.push(key || '')
        counts.push(dateMap[key || ''] || 0) // 无数据日期补 0
      }

      // 3、渲染折线图（渐变面积 + 平滑曲线）
      if (chartInstance) {
        chartInstance.dispose()
      }
      chartInstance = echarts.init(chartEl)
      chartInstance.setOption({
        animation: false, // 关闭开场动画，数据一次性渲染
        tooltip: { trigger: 'axis' }, // 悬浮提示：轴触发
        grid: { left: 40, right: 20, bottom: 30, top: 20 }, // 图表边距
        // X轴：日期
        xAxis: {
          type: 'category',
          data: dates,
          axisLabel: { fontSize: 11, color: '#909399' }
        },
        yAxis: {
          type: 'value',
          minInterval: 1, // Y 轴最小间隔为 1
          axisLabel: { fontSize: 11, color: '#909399' }
        },
        // 数据系列：日志量折线
        series: [
          {
            data: counts,
            type: 'line',
            smooth: true, // 平滑曲线
            lineStyle: { width: 2, color: '#409EFF' },
            areaStyle: {
              // 渐变面积填充
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(64,158,255,0.3)' }, // 顶部：30% 透明度
                  { offset: 1, color: 'rgba(64,158,255,0.02)' } // 底部：2% 透明度
                ]
              }
            },
            itemStyle: { color: '#409EFF' } // 数据点颜色
          }
        ]
      })
    })
    .catch(() => {
      // 错误已由请求层提示，保留上一次图表
    })
}

// ---------------------- 页面交互 ----------------------

/**
 * 消息列表 - 点击查看详情，并标记已读
 *
 * @param item 消息行数据
 */
function handleMsgClick(item: Message) {
  if (item.id == null) return
  messageDetailRef.value?.open(item.id)
  // 标记已读失败不阻断详情展示，错误由请求层提示
  messageApi.markRead(item.id).catch(() => {})
}

// ---------------------- 页面初始化 ----------------------

// 页面挂载后加载统计、消息与日志趋势图
onMounted(() => {
  loadStats()
  loadMessages()
  // 图表容器需等 DOM 渲染完成后再初始化
  nextTick(loadChart)
  // 容器尺寸变化时自适应重绘：窗口缩放、侧边栏折叠等场景
  if (chartRef.value) {
    resizeObserver = new ResizeObserver(() => chartInstance?.resize())
    resizeObserver.observe(chartRef.value)
  }
})

// 页面卸载时断开尺寸监听并销毁图表实例
onUnmounted(() => {
  resizeObserver?.disconnect()
  chartInstance?.dispose()
})
</script>

<style scoped lang="scss">
.stat-card {
  margin-bottom: 16px;
  border-radius: 8px;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }

  :deep(.el-card__body) {
    padding: 18px 20px;
  }
}

.stat-body {
  display: flex;
  align-items: center;
  gap: 14px;
}

.stat-icon-wrap {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 26px;
  font-weight: 500;
  color: #1f2937;
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

.chart-card,
.msg-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-box {
  height: 320px;
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
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }
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
  .stat-value {
    color: #e5e7eb;
  }

  .card-header {
    color: #e0e0e0;
  }

  .msg-title {
    color: #e0e0e0;
  }

  .msg-item {
    border-bottom-color: #2a2a3e;
  }
}
</style>
