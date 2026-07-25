import request from '@/utils/request'

/**
 * 首页：指标卡片
 */
export function getStats() {
  return request({
    url: '/dashboard/stats',
    method: 'get'
  })
}

/**
 * 首页：审计日志折线图
 */
export function getLogTrend(days) {
  return request({
    url: '/dashboard/logTrend',
    method: 'get',
    params: { days }
  })
}
