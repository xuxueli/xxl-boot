/**
 * request - HTTP 请求工具（axios 封装）
 *
 * 基于 axios 封装，提供请求拦截、响应拦截、文件下载功能。
 *
 * 用法：
 *   import request from '@/utils/request'
 *   request.get('/api/list', { params: { page: 1 } })
 *
 * 拦截器能力：
 *   请求 - token 注入 / 参数序列化（嵌套对象 key[sub]=v）/ POST/PUT 防重复提交
 *   响应 - 301 自动登录弹窗 / blob 透传 / 业务码统一处理
 */
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { getToken, getTokenKeyHeader } from '@/utils/auth'
import { tansParams } from '@/utils/common'
import cache from '@/utils/cache'
import modal from '@/utils/modal'
import { useUserStore } from '@/store'
import defaultSettings from '@/default-settings'
import { t } from '@/i18n'
import type { Response } from '@/types'

/**
 * 请求配置扩展：自定义 header 属性
 */
interface CustomHeaders {
  /** 是否跳过 token 注入（false 时跳过，用于登录等无需鉴权的接口） */
  isToken?: boolean
  /** 是否跳过防重复提交（false 时放行，用于允许重复提交的接口） */
  repeatSubmit?: boolean
  /** 重复提交判定间隔（默认 1000ms，可在请求级自定义） */
  interval?: number
}

/** 请求配置：原生 axios 配置 + 自定义 header 属性 */
export type RequestConfig = AxiosRequestConfig & {
  headers?: (AxiosRequestConfig['headers'] & CustomHeaders) | undefined
}

/** 防重复提交快照 */
interface RepeatSubmitSnapshot {
  url?: string | null
  data?: string | null
  params?: string | null
  time?: number
}

// 301 重登录防重复弹出标志
export const isRelogin = { show: false }

// 防重复提交快照存储 key
const REPEAT_SUBMIT_KEY = 'sessionObj'

// 跳过大文件防重复提交阈值（5MB）
const REPEAT_SUBMIT_MAX_SIZE = 5 * 1024 * 1024

// 错误码映射表：后端业务码 → 前端展示文案
export const errorCode: Record<string, string> = {
  '301': t('request.err301'),
  '403': t('request.err403'),
  '404': t('request.err404'),
  default: t('request.errDefault')
}

// ==================== 创建 axios 实例（拦截器） ====================

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
  paramsSerializer: (params) => tansParams(params).replace(/&$/, '')
})

/**
 * 请求拦截器
 *
 *      1. Token 注入
 *         - 有 token 且 headers.isToken 不为 false 时，自动注入登录凭证 header。
 *         - 登录等无需鉴权的接口可通过 { headers: { isToken: false } } 跳过。
 *
 *      2. POST / PUT 防重复提交
 *         - 基于 sessionStorage 缓存上一次请求的 url + params + data + time 快照。
 *         - 同一 url、相同 params + data、间隔小于 interval（默认 1s）时判定为重复，拒绝发送。
 *         - FormData / Blob 与 5MB 以上大请求无法可靠序列化比对，直接放行。
 *         - 可通过 { headers: { repeatSubmit: false } } 跳过；{ headers: { interval: 2000 } } 自定义间隔。
 */
service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const headers = config.headers as unknown as CustomHeaders

  // 自定义 header 属性（isToken / repeatSubmit / interval）
  const isToken = headers.isToken === false
  const isRepeatSubmit = headers.repeatSubmit === false
  const interval = Number(headers.interval) || 1000

  // 1. Token 注入
  if (getToken() && !isToken) {
    config.headers[getTokenKeyHeader()] = getToken()
  }

  // 2. POST / PUT 防重复提交
  if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    // FormData / Blob 无法序列化比对，跳过
    if (config.data instanceof FormData || config.data instanceof Blob) {
      return config
    }

    // 请求快照：url + data + params + time（无 data/params 时以 JSON.stringify(undefined) 处理）
    const snapshot = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      params: config.params ? JSON.stringify(config.params) : undefined,
      time: new Date().getTime()
    } satisfies RepeatSubmitSnapshot
    // 5MB 以上大请求跳过防重校验，直接放行
    if (JSON.stringify(snapshot).length >= REPEAT_SUBMIT_MAX_SIZE) {
      return config
    }

    // 快照比对：同 url + params + data 且间隔小于 interval 判定为重复提交
    const last = cache.session.getJSON(REPEAT_SUBMIT_KEY) as RepeatSubmitSnapshot | null
    if (!last) {
      cache.session.setJSON(REPEAT_SUBMIT_KEY, snapshot)
      return config
    }
    if (
      last.url === snapshot.url &&
      last.params === snapshot.params &&
      last.data === snapshot.data &&
      last.time != null &&
      snapshot.time - last.time < interval
    ) {
      console.warn(`[${snapshot.url}]: ${t('request.repeatSubmit')}`)
      return Promise.reject(new Error(t('request.repeatSubmit')))
    }
    cache.session.setJSON(REPEAT_SUBMIT_KEY, snapshot)
  }

  return config
})

/**
 * 响应拦截器
 *      - 1、blob/arraybuffer 透传
 *      - 2、301：会话过期，弹出重新登录确认框（防重复弹窗）
 *      - 3、非 200：错误码映射文案统一提示（skipErrorHandler 时静默）
 *      - 4、200：返回后端 Response 结构
 */
service.interceptors.response.use(
  (res) => {
    const data = res.data as Response
    const code = data.code || 200

    // 1. blob / arraybuffer 透传
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data
    }

    // 2. 301：未授权，弹出重新登录弹窗
    if (code === 301) {
      if (!isRelogin.show) {
        isRelogin.show = true
        modal
          .confirm(t('request.sessionExpired'))
          .then(() => {
            isRelogin.show = false
            useUserStore()
              .logout()
              .then(() => {
                location.href = defaultSettings.homePath
              })
          })
          .catch(() => {
            isRelogin.show = false
          })
      }
      return Promise.reject(t('request.sessionInvalid'))
    }

    // 3. 其他非成功码（非200）
    if (code !== 200) {
      const msg = data.msg || errorCode[String(code)] || errorCode.default
      modal.msgError(msg)
      return Promise.reject(msg ? new Error(msg) : 'error')
    }

    // 4. 业务成功：返回 { code, msg, data }
    return Promise.resolve(data)
  },
  // 5. HTTP 层异常
  (error) => {
    let { message: msg } = error as Error
    if (msg === 'Network Error') {
      msg = t('request.networkError')
    } else if (msg.includes('timeout')) {
      msg = t('request.timeout')
    } else if (msg.includes('Request failed with status code')) {
      msg = t('request.httpError', [msg.slice(-3)])
    }
    modal.msgError(msg)
    return Promise.reject(error)
  }
)

// ==================== 通用请求方法（泛型） ====================

/**
 * 通用请求方法（业务接口统一入口）
 *
 * 返回 `Promise<Response<T>>`：
 *   - 成功（code=200）时已解包为 response.data（含 code/msg/data）
 *   - 调用方通过 response.data 取业务数据（分页列表在 response.data.data）
 *
 * @param config axios 请求配置（含自定义 headers：isToken/repeatSubmit/interval）
 * @returns 后端统一返回结构
 */
export function request<T = unknown>(config: RequestConfig): Promise<Response<T>> {
  return service.request(config) as unknown as Promise<Response<T>>
}

export default service
