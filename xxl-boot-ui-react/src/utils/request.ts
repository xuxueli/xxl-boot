/**
 * request - HTTP 请求工具
 *
 * 基于 axios 封装，提供请求拦截、响应拦截、文件下载功能。
 *
 * 用法：
 *   import request from '@/utils/request'
 *   request.get('/api/list', { params: { page: 1 } })
 *
 * 拦截器能力：
 *   请求 - token 注入 / GET 参数序列化 / POST/PUT 防重复提交
 *   响应 - 301 自动登录弹窗 / blob 透传 / 业务码统一处理
 */
import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { getToken, getTokenKeyHeader } from '@/utils/auth'
import { tansParams, blobValidate } from '@/utils/common'
import cache from '@/utils/cache'
import modal from '@/utils/modal'
import { saveAs } from 'file-saver'
import { useUserStore } from '@/stores'
import defaultSettings from '@/default-settings'
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
type RequestConfig = AxiosRequestConfig & {
  headers?: (AxiosRequestConfig['headers'] & CustomHeaders) | undefined
}

// 防重复提交快照结构
interface RepeatSubmitSnapshot {
  url?: string | null
  data?: string | null
  params?: string | null
  time?: number
}

// 301 重登录防重复弹出标志
export const isRelogin = { show: false }

// 防重复提交快照存储 key
const REPEAT_SUBMIT_STORAGE_KEY = 'sessionObj'

// 错误码映射表：后端业务码 → 前端展示文案
export const errorCode: Record<string, string> = {
  '301': '认证失败，无法访问系统资源',
  '403': '当前操作没有权限',
  '404': '访问资源不存在',
  default: '系统未知错误，请反馈给管理员'
}

// 默认 headers 属性
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// ==================== 创建 axios 实例（拦截器） ====================

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000
})

/**
 * 请求拦截器
 *
 * 在每个请求发出前统一处理以下逻辑：
 *      1. Token 注入（有 token 且 headers.isToken 不为 false 时，自动注入 Authorization header）
 *      2. GET 参数序列化（嵌套对象展开为 key[sub]=val 格式拼入 URL）
 *      3. POST / PUT 防重复提交（基于 sessionStorage 缓存快照比对）
 */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 自定义 header 属性（isToken / repeatSubmit / interval）
    const headers = config.headers as Record<string, unknown>
    // 是否跳过 token 注入（headers.isToken = false 时跳过，用于登录等无需鉴权的接口）
    const isToken = headers.isToken === false
    // 是否跳过防重复提交（headers.repeatSubmit = false 时放行，用于允许重复提交的接口）
    const isRepeatSubmit = headers.repeatSubmit === false
    // 重复提交判定间隔（headers.interval，默认 1000ms，可在请求级自定义）
    const interval = Number(headers.interval) || 1000

    // 1. Token 注入
    if (getToken() && !isToken) {
      config.headers[getTokenKeyHeader()] = getToken()
    }

    // 2. GET 参数序列化
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params)
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }

    // 3. POST / PUT 防重复提交
    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
      // FormData / Blob 无法序列化比对，跳过防重复提交校验
      if (config.data instanceof FormData || config.data instanceof Blob) {
        return config
      }

      // request data
      const requestObj = {
        url: config.url,
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
        params: config.params ? JSON.stringify(config.params) : undefined,
        time: new Date().getTime()
      }
      // request size
      const requestSize = Object.keys(JSON.stringify(requestObj)).length
      if (requestSize >= 5 * 1024 * 1024) {
        console.warn(`[${config.url}]: 请求数据大小超出5M限制，跳过防重复提交验证。`)
        return config
      }

      // request data cache
      const sessionObj = cache.session.getJSON(REPEAT_SUBMIT_STORAGE_KEY) as RepeatSubmitSnapshot | null
      if (!sessionObj) {
        // 首次提交，写入快照
        cache.session.setJSON(REPEAT_SUBMIT_STORAGE_KEY, requestObj)
      } else {
        // 非首次：比对 url + params + data + 时间间隔
        if (
          sessionObj.url === requestObj.url &&
          sessionObj.params === requestObj.params &&
          sessionObj.data === requestObj.data &&
          sessionObj.time != null &&
          requestObj.time - sessionObj.time < interval
        ) {
          // 重复提交
          console.warn(`[${sessionObj.url}]: 数据正在处理，请勿重复提交`)
          return Promise.reject(new Error('数据正在处理，请勿重复提交'))
        } else {
          // 非重复提交，更新快照
          cache.session.setJSON(REPEAT_SUBMIT_STORAGE_KEY, requestObj)
        }
      }
    }

    return config
  },
  (error) => {
    console.log(error)
    Promise.reject(error)
  }
)

/**
 * 响应拦截器
 *
 * 统一处理服务端的业务码（code）和 HTTP 层异常，屏蔽业务层的错误处理重复代码。
 */
service.interceptors.response.use(
  (res) => {
    const code = res.data.code || 200
    const msg = errorCode[String(code)] || res.data.msg || errorCode['default']

    // 1. blob / arraybuffer 透传
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data
    }

    // 2. 301：未授权，弹出重新登录弹窗
    if (code === 301) {
      if (!isRelogin.show) {
        isRelogin.show = true
        modal
          .confirm('登录状态已过期，您可以继续留在该页面，或者重新登录')
          .then(() => {
            isRelogin.show = false
            useUserStore
              .getState()
              .logout()
              .then(() => {
                location.href = defaultSettings.homePath
              })
          })
          .catch(() => {
            isRelogin.show = false
          })
      }
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    }

    // 3. 其他非成功码（非200）
    if (code !== 200) {
      modal.msgError(msg) // msgWarning、notifyError
      return Promise.reject(msg ? new Error(msg) : 'error')
    }

    // 4. 业务成功
    return Promise.resolve(res.data)
  },
  // 5. HTTP 层异常
  (error) => {
    console.log('err' + error)
    let { message } = error as Error
    if (message === 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.slice(-3) + '异常'
    }
    modal.msgError(message)
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

// ==================== 文件下载 ====================

/**
 * 通用文件下载（POST）
 *
 * 以 POST + form-urlencoded 提交下载请求，响应为 blob 二进制流。
 * 下载期间展示全屏 Loading，完成后自动关闭。
 *
 * @param url       下载接口地址
 * @param params    请求参数（会被序列化为 application/x-www-form-urlencoded）
 * @param filename  保存到本地的文件名
 * @param config    额外的 axios 请求配置（可选）
 */
export function download(url: string, params: object, filename: string, config?: RequestConfig): void {
  modal.loading('正在下载数据，请稍候')
  service
    .post(url, params, {
      transformRequest: [(params) => tansParams(params)],
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob',
      ...config
    })
    .then(async (data) => {
      // 响应拦截器已对 blob 响应透传为 Blob，此处断言类型
      const blobData = data as unknown as Blob
      const isBlob = blobValidate(blobData)
      if (isBlob) {
        // 响应为正常文件内容，触发浏览器下载
        const blob = new Blob([blobData])
        saveAs(blob, filename)
      } else {
        // 服务端以 blob 格式返回了 JSON 错误报文
        const resText = await blobData.text()
        const rspObj = JSON.parse(resText)
        const errMsg = errorCode[String(rspObj.code)] || rspObj.msg || errorCode['default']
        modal.msgError(errMsg)
      }
      modal.closeLoading()
    })
    .catch((r) => {
      console.error(r)
      modal.msgError('下载文件出现错误，请联系管理员！')
      modal.closeLoading()
    })
}

export default service
