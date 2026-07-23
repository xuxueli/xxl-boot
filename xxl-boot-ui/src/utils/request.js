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
 *   响应 - 401 自动登录弹窗 / blob 透传 / 业务码统一处理
 */
import axios from 'axios'
import {ElNotification, ElMessageBox, ElMessage, ElLoading} from 'element-plus'
import {getToken} from '@/utils/auth'
import {tansParams, blobValidate} from '@/utils/common'
import errorCode from '@/utils/errorCode'
import cache from '@/utils/cache'
import {saveAs} from 'file-saver'
import {useUserStore} from '@/store'
import settings from '@/settings'


// 401 重登录防重复弹出标志
export let isRelogin = {show: false}
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
 *
 *      1. Token 注入
 *         - 有 token 且 headers.isToken 不为 false 时，自动注入 Authorization header。
 *         - 登录等无需鉴权的接口可通过 { headers: { isToken: false } } 跳过。
 *
 *      2. GET 参数序列化
 *         - 将 config.params 中的嵌套对象展开为 key[sub]=val 格式拼入 URL。
 *         - 解决 axios 默认序列化对嵌套对象支持不佳的问题。
 *
 *      3. POST / PUT 防重复提交
 *         - 基于 sessionStorage 缓存上一次请求的 url + data + time 快照。
 *         - 同一 url、相同 data、间隔小于 interval（默认 1s）时判定为重复，拒绝发送。
 *         - 超过 5MB 的大请求不做防重校验，直接放行。
 *         - 可通过 { headers: { repeatSubmit: false } } 全局跳过。
 *         - 可通过 { headers: { interval: 2000 } } 自定义判定间隔。
 */
service.interceptors.request.use(config => {
    // 是否跳过 token 注入（headers.isToken = false 时跳过，用于登录等无需鉴权的接口）
    const isToken = (config.headers || {}).isToken === false
    // 是否跳过防重复提交（headers.repeatSubmit = false 时放行，用于允许重复提交的接口）
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
    // 重复提交判定间隔（headers.interval，默认 1000ms，可在请求级自定义）
    const interval = (config.headers || {}).interval || 1000

    // 1. Token 注入
    if (getToken() && !isToken) {
        config.headers['Authorization'] = 'Bearer ' + getToken()
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
        const requestObj = {
            url: config.url,
            data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
            time: new Date().getTime()
        }
        const requestSize = Object.keys(JSON.stringify(requestObj)).length
        if (requestSize >= 5 * 1024 * 1024) {
            console.warn(`[${config.url}]: 请求数据大小超出5M限制，跳过防重复提交验证。`)
            return config
        }

        const sessionObj = cache.session.getJSON('sessionObj')
        if (!sessionObj) {
            // 首次提交，写入快照
            cache.session.setJSON('sessionObj', requestObj)
        } else {
            // 非首次：比对 url + data + 时间间隔
            if (sessionObj.data === requestObj.data
                && requestObj.time - sessionObj.time < interval
                && sessionObj.url === requestObj.url) {
                console.warn(`[${sessionObj.url}]: 数据正在处理，请勿重复提交`)
                return Promise.reject(new Error('数据正在处理，请勿重复提交'))
            }
            // 非重复提交，更新快照
            cache.session.setJSON('sessionObj', requestObj)
        }
    }

    return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

/**
 * 响应拦截器
 *
 * 统一处理服务端的业务码（code）和 HTTP 层异常，屏蔽业务层的错误处理重复代码。
 *
 * 处理流程：
 *
 *      1. blob / arraybuffer 透传
 *         - 文件下载接口的 responseType 为 blob/arraybuffer，不做业务码解析，直接返回。
 *
 *      2. code === 401（未授权 / 会话过期）
 *         - 弹出重新登录确认框。
 *         - isRelogin.show 标志防止多个并发 401 重复弹框。
 *         - 点击"重新登录"时调用 userStore.logout() 清除状态并跳转登录页。
 *         - 始终返回 rejected Promise，阻止后续代码继续执行。
 *
 *      3. code === 500（服务端内部错误）
 *         - 以 ElMessage error 样式展示错误信息 + rejected Promise。
 *
 *      4. code === 601（业务警告）
 *         - 以 ElMessage warning 样式展示提示 + rejected Promise。
 *
 *      5. code !== 200（其他非成功码，如 403/404）
 *         - 以 ElNotification error 形式展示 + rejected Promise。
 *
 *      6. code === 200（业务成功）
 *         - 直接返回 res.data，业务层无需再解包装。
 *
 *      7. HTTP 层异常（网络断开 / 超时 / HTTP 错误码）
 *          - 将英文错误消息映射为中文后展示。
 */
service.interceptors.response.use(res => {
        const code = res.data.code || 200
        const msg = errorCode[code] || res.data.msg || errorCode['default']

        // 1. blob / arraybuffer 透传
        if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
            return res.data
        }

        // 2. 401：未授权，弹出重新登录弹窗
        if (code === 401) {
            if (!isRelogin.show) {
                isRelogin.show = true
                ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    isRelogin.show = false
                    useUserStore().logout().then(() => {
                        location.href = settings.homePath
                    })
                }).catch(() => {
                    isRelogin.show = false
                })
            }
            return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
        }

        // 3. 500：服务端内部错误
        if (code === 500) {
            ElMessage({message: msg, type: 'error'})
            return Promise.reject(new Error(msg))
        }

        // 4. 601：业务警告
        if (code === 601) {
            ElMessage({message: msg, type: 'warning'})
            return Promise.reject(new Error(msg))
        }

        // 5. 其他非成功码
        if (code !== 200) {
            ElNotification.error({title: msg})
            return Promise.reject('error')
        }

        // 6. 业务成功
        return Promise.resolve(res.data)
    },
    // 7. HTTP 层异常
    error => {
        console.log('err' + error)
        let {message} = error
        if (message === "Network Error") {
            message = "后端接口连接异常"
        } else if (message.includes("timeout")) {
            message = "系统接口请求超时"
        } else if (message.includes("Request failed with status code")) {
            message = "系统接口" + message.slice(-3) + "异常"
        }
        ElMessage({message: message, type: 'error', duration: 5 * 1000})
        return Promise.reject(error)
    }
)

// ==================== 文件下载 ====================

/**
 * 通用文件下载（POST）
 *
 * 以 POST + form-urlencoded 提交下载请求，响应为 blob 二进制流。
 * 下载期间展示全屏 Loading，完成后自动关闭。
 *
 * 处理流程：
 *   1. 请求前：开启全屏 Loading。
 *   2. 请求时：params 序列化为 URL 编码格式，设置 responseType: 'blob'。
 *   3. 响应后：
 *      a. blobValidate 校验通过 → 以 file-saver saveAs 触发浏览器下载。
 *      b. blobValidate 校验失败（服务端返回了 JSON 错误）→ 解析 JSON 后展示错误信息。
 *   4. 始终关闭 Loading。
 *   5. 异常时 catch 兜底，提示"下载文件出现错误"并关闭 Loading。
 *
 * @param {string} url       下载接口地址
 * @param {Object} params    请求参数（会被序列化为 application/x-www-form-urlencoded）
 * @param {string} filename  保存到本地的文件名
 * @param {Object} [config]  额外的 axios 请求配置（可选）
 */
export function download(url, params, filename, config) {
    const downloadLoadingInstance = ElLoading.service({text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)",})
    return service.post(url, params, {
        transformRequest: [(params) => tansParams(params)],
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        responseType: 'blob',
        ...config
    }).then(async (data) => {
        const isBlob = blobValidate(data)
        if (isBlob) {
            // 响应为正常文件内容，触发浏览器下载
            const blob = new Blob([data])
            saveAs(blob, filename)
        } else {
            // 服务端以 blob 格式返回了 JSON 错误报文
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
