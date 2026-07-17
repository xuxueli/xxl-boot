/**
 * HTTP 请求工具模块（request.js）
 *
 * 职责：
 *   - 创建并导出全局统一的 axios 实例（service），供所有 API 模块使用。
 *   - 请求拦截器：
 *       1. 自动注入 Bearer Token（可通过 headers.isToken=false 跳过）。
 *       2. GET 请求自动序列化 params 为 URL 查询字符串。
 *       3. POST / PUT 请求防重复提交（基于 sessionStorage 缓存上次请求快照）。
 *   - 响应拦截器：
 *       1. 二进制流（blob/arraybuffer）直接透传，不做业务码解析。
 *       2. 401：弹出重新登录对话框，并防止重复弹出。
 *       3. 500/601：以 ElMessage 展示服务端错误信息。
 *       4. 其他非 200：以 ElNotification 展示错误标题。
 *       5. 网络异常/超时/HTTP 错误码：统一格式化提示文案。
 *   - 导出 download 方法：封装文件下载逻辑，支持 blob 校验与用户友好提示。
 *
 * 依赖：
 *   - axios                  HTTP 客户端
 *   - element-plus           UI 通知组件
 *   - @/utils/auth           Token 读取
 *   - @/utils/errorCode      HTTP 错误码映射表
 *   - @/utils/boot           参数序列化 / blob 校验工具
 *   - @/plugins/cache        sessionStorage 封装
 *   - file-saver             触发浏览器文件下载
 *   - @/store/modules/user   退出登录 action
 */
import axios from 'axios'
import { ElNotification , ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { tansParams, blobValidate } from '@/utils/common'
import cache from '@/utils/cache'
import { saveAs } from 'file-saver'
import useUserStore from '@/store/modules/user'

// 文件下载时的全局 Loading 实例，下载完成或出错后关闭
let downloadLoadingInstance
// 是否显示重新登录弹窗（防止 401 并发响应时弹出多次）
export let isRelogin = { show: false }

// 统一设置请求 Content-Type，后端默认接收 JSON
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// ─────────────────────────────────────────────
// 1. 创建 axios 实例
// ─────────────────────────────────────────────
// baseURL 由 Vite 环境变量注入，便于区分开发/生产环境接口地址
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时
  timeout: 10000
})

// ─────────────────────────────────────────────
// 2. 请求拦截器
// ─────────────────────────────────────────────
// 在每个请求发出前统一处理：注入 token、序列化参数、防重复提交
service.interceptors.request.use(config => {
  // 是否需要设置 token（headers.isToken === false 时跳过注入，适用于登录等不需要鉴权的接口）
  const isToken = (config.headers || {}).isToken === false
  // 是否需要防止数据重复提交（headers.repeatSubmit === false 时跳过防重，适用于允许重复的接口）
  const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
  // 间隔时间(ms)，小于此时间视为重复提交（可通过 headers.interval 自定义，默认 1000ms）
  const interval = (config.headers || {}).interval || 1000
  if (getToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  // get请求映射params参数：将 params 对象序列化后拼入 URL，避免数组/嵌套对象序列化问题
  if (config.method === 'get' && config.params) {
    let url = config.url + '?' + tansParams(config.params)
    url = url.slice(0, -1) // 去掉末尾多余的 &
    config.params = {}
    config.url = url
  }
  // POST / PUT 请求防重复提交：比对本次请求与上次请求的 URL、数据、时间间隔
  if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    const requestObj = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime()
    }
    const requestSize = Object.keys(JSON.stringify(requestObj)).length // 请求数据大小
    const limitSize = 5 * 1024 * 1024 // 限制存放数据5M（超出时不做防重复校验，直接放行）
    if (requestSize >= limitSize) {
      console.warn(`[${config.url}]: ` + '请求数据大小超出允许的5M限制，无法进行防重复提交验证。')
      return config
    }
    const sessionObj = cache.session.getJSON('sessionObj')
    if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
      // 首次请求，写入缓存快照
      cache.session.setJSON('sessionObj', requestObj)
    } else {
      const s_url = sessionObj.url                // 请求地址
      const s_data = sessionObj.data              // 请求数据
      const s_time = sessionObj.time              // 请求时间
      // 同一地址、相同数据、间隔时间内 → 判定为重复提交，拒绝发送
      if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
        const message = '数据正在处理，请勿重复提交'
        console.warn(`[${s_url}]: ` + message)
        return Promise.reject(new Error(message))
      } else {
        // 非重复提交，更新缓存快照
        cache.session.setJSON('sessionObj', requestObj)
      }
    }
  }
  return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

// ─────────────────────────────────────────────
// 3. 响应拦截器
// ─────────────────────────────────────────────
// 统一处理服务端业务码及 HTTP 级别的异常，屏蔽业务层的错误处理重复代码
service.interceptors.response.use(res => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200
    // 获取错误信息：优先取 errorCode 映射表中的文案，其次取接口返回的 msg，最后取默认文案
    const msg = errorCode[code] || res.data.msg || errorCode['default']
    // 二进制数据则直接返回（文件下载场景）
    if (res.request.responseType ===  'blob' || res.request.responseType ===  'arraybuffer') {
      return res.data
    }
    if (code === 401) {
      // 未授权或会话过期：弹出确认框提示重新登录，isRelogin 标志防止并发 401 多次弹框
      if (!isRelogin.show) {
        isRelogin.show = true
        ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', { confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'warning' }).then(() => {
          isRelogin.show = false
          // 调用用户 store 的退出逻辑（清除 token 等状态），然后跳转到登录页
          useUserStore().logout().then(() => {
            location.href = '/index'
          })
      }).catch(() => {
        isRelogin.show = false
      })
    }
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
      // 服务端内部错误：以 error 样式展示错误信息
      ElMessage({ message: msg, type: 'error' })
      return Promise.reject(new Error(msg))
    } else if (code === 601) {
      // 业务警告码：以 warning 样式展示提示信息
      ElMessage({ message: msg, type: 'warning' })
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      // 其他非成功码：以通知形式展示错误标题
      ElNotification.error({ title: msg })
      return Promise.reject('error')
    } else {
      // 业务成功：直接返回 data 对象，业务层无需再解包
      return  Promise.resolve(res.data)
    }
  },
  error => {
    // HTTP 层错误（网络异常、超时、4xx/5xx 等）统一格式化提示
    console.log('err' + error)
    let { message } = error
    if (message == "Network Error") {
      message = "后端接口连接异常"
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时"
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.slice(-3) + "异常"
    }
    ElMessage({ message: message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  }
)

// ─────────────────────────────────────────────
// 4. 文件下载工具方法
// ─────────────────────────────────────────────
/**
 * 通用文件下载方法
 *
 * 以 POST 方式提交下载请求，响应类型固定为 blob；
 * 下载期间展示全屏 Loading，完成或出错后自动关闭。
 *
 * @param {string}   url      下载接口地址
 * @param {Object}   params   请求参数对象，内部会被序列化为 application/x-www-form-urlencoded
 * @param {string}   filename 保存到本地的文件名
 * @param {Object}   [config] 额外的 axios 请求配置（可选）
 * @returns {Promise<void>}
 */
export function download(url, params, filename, config) {
  downloadLoadingInstance = ElLoading.service({ text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)", })
  return service.post(url, params, {
    transformRequest: [(params) => { return tansParams(params) }],
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
    ...config
  }).then(async (data) => {
    // 校验响应是否为真正的文件内容（非 JSON 错误报文）
    const isBlob = blobValidate(data)
    if (isBlob) {
      // 正常 blob 数据：触发浏览器下载
      const blob = new Blob([data])
      saveAs(blob, filename)
    } else {
      // 服务端以 blob 格式返回了业务错误，解析 JSON 并展示错误信息
      const resText = await data.text()
      const rspObj = JSON.parse(resText)
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      ElMessage.error(errMsg)
    }
    downloadLoadingInstance.close()
  }).catch((r) => {
    console.error(r)
    ElMessage.error('下载文件出现错误，请联系管理员！')
    downloadLoadingInstance.close()
  })
}

export default service
