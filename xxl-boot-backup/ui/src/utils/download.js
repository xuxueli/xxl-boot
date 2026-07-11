/**
 * 插件名称：download（文件下载插件）
 *
 * 能力说明：
 * - 提供三种文件下载方式，统一处理鉴权 token、响应体校验和错误提示：
 *     · name(name, isDelete)：按文件名下载服务端文件，支持下载后自动删除源文件
 *     · resource(resource)：按资源路径下载服务端静态资源
 *     · zip(url, name)：下载 ZIP 压缩包，带全屏 Loading 遮罩和异常兜底处理
 * - 内置 saveAs 方法封装，统一调用 file-saver 库触发浏览器下载行为
 * - 内置 printErrMsg 方法，将响应体中的错误信息解析后展示给用户
 *
 * 依赖说明：
 * - axios：发起带鉴权头的 HTTP 请求
 * - element-plus ElLoading / ElMessage：加载遮罩与消息提示
 * - file-saver saveAs：触发浏览器下载并命名文件
 * - @/utils/auth getToken：获取当前登录用户的 Bearer Token
 * - @/utils/errorCode：统一错误码与错误信息映射表
 * - @/utils/boot blobValidate：校验响应是否为合法的 Blob 文件数据
 *
 * 典型用法（组件内）：
 *   // 按文件名下载（下载后删除源文件）
 *   this.$download.name('test.xlsx')
 *
 *   // 按文件名下载（保留源文件）
 *   this.$download.name('test.xlsx', false)
 *
 *   // 按资源路径下载
 *   this.$download.resource('/profile/upload/2024/test.png')
 *
 *   // 下载 ZIP 压缩包
 *   this.$download.zip('/system/export', '用户数据.zip')
 *
 *   // 直接触发浏览器下载（自定义 Blob）
 *   this.$download.saveAs(blob, 'custom.xlsx')
 */
import axios from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import { saveAs } from 'file-saver'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { blobValidate } from '@/utils/common'

// 接口请求的基础 URL，从 Vite 环境变量中读取（对应 .env 文件中的 VITE_APP_BASE_API）
const baseURL = import.meta.env.VITE_APP_BASE_API
// 全局下载 Loading 实例，用于 zip 方法中显示/关闭全屏加载遮罩
let downloadLoadingInstance

/**
 * 对外导出的下载插件对象
 *
 * 挂载方式（main.js）：
 *   app.config.globalProperties.$download = download
 */
export default {
  /**
   * 按文件名下载服务端文件
   *
   * 说明：
   * - 请求路径：/common/download?fileName=xxx&delete=true/false
   * - 下载成功后从响应头 download-filename 中获取解码后的文件名并保存
   * - 若响应体校验失败（非合法 Blob），则解析错误信息并提示用户
   *
   * @param {string}  name     服务端文件名（会进行 URI 编码后拼接到请求参数中）
   * @param {boolean} isDelete 是否在下载完成后删除服务端源文件，默认 true
   */
  name(name, isDelete = true) {
    // 拼接下载请求地址，对文件名进行 URI 编码防止特殊字符导致请求失败
    var url = baseURL + "/common/download?fileName=" + encodeURIComponent(name) + "&delete=" + isDelete
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',                                       // 以二进制流方式接收响应，适用于文件下载
      headers: { 'Authorization': 'Bearer ' + getToken() }       // 附加 Bearer Token 完成鉴权
    }).then((res) => {
      // 校验响应体是否为合法的 Blob 文件数据
      const isBlob = blobValidate(res.data)
      if (isBlob) {
        // 构造 Blob 对象，从响应头中解码真实文件名并触发浏览器下载
        const blob = new Blob([res.data])
        this.saveAs(blob, decodeURIComponent(res.headers['download-filename']))
      } else {
        // 响应体为错误信息 JSON，解析后展示错误提示
        this.printErrMsg(res.data)
      }
    })
  },

  /**
   * 按资源路径下载服务端静态资源
   *
   * 说明：
   * - 请求路径：/common/download/resource?resource=xxx
   * - 适用于下载已上传到服务端的静态文件（如图片、文档等）
   * - 下载成功后从响应头 download-filename 中获取文件名并保存
   *
   * @param {string} resource 服务端资源路径（会进行 URI 编码后拼接到请求参数中）
   */
  resource(resource) {
    // 拼接资源下载请求地址
    var url = baseURL + "/common/download/resource?resource=" + encodeURIComponent(resource)
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',                                       // 以二进制流方式接收响应
      headers: { 'Authorization': 'Bearer ' + getToken() }       // 附加 Bearer Token 完成鉴权
    }).then((res) => {
      // 校验响应体是否为合法的 Blob 文件数据
      const isBlob = blobValidate(res.data)
      if (isBlob) {
        // 构造 Blob 对象，从响应头中解码真实文件名并触发浏览器下载
        const blob = new Blob([res.data])
        this.saveAs(blob, decodeURIComponent(res.headers['download-filename']))
      } else {
        // 响应体为错误信息 JSON，解析后展示错误提示
        this.printErrMsg(res.data)
      }
    })
  },

  /**
   * 下载 ZIP 压缩包
   *
   * 说明：
   * - 请求前显示全屏 Loading 遮罩，下载完成或出错后关闭
   * - 响应体以 application/zip 类型构造 Blob，使用传入的 name 作为保存文件名
   * - 请求异常时通过 catch 兜底，打印错误日志并弹出错误提示
   *
   * @param {string} url  ZIP 文件的服务端接口路径（相对路径，会自动拼接 baseURL）
   * @param {string} name 保存到本地的文件名，例如 '导出数据.zip'
   */
  zip(url, name) {
    // 拼接完整请求地址
    var url = baseURL + url
    // 显示全屏下载 Loading 遮罩，提示用户正在下载
    downloadLoadingInstance = ElLoading.service({ text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)", })
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',                                       // 以二进制流方式接收响应
      headers: { 'Authorization': 'Bearer ' + getToken() }       // 附加 Bearer Token 完成鉴权
    }).then((res) => {
      // 校验响应体是否为合法的 Blob 文件数据
      const isBlob = blobValidate(res.data)
      if (isBlob) {
        // 以 application/zip MIME 类型构造 Blob，触发浏览器下载并指定文件名
        const blob = new Blob([res.data], { type: 'application/zip' })
        this.saveAs(blob, name)
      } else {
        // 响应体为错误信息 JSON，解析后展示错误提示
        this.printErrMsg(res.data)
      }
      // 无论成功与否，关闭下载 Loading 遮罩
      downloadLoadingInstance.close()
    }).catch((r) => {
      // 请求发生网络异常或服务端错误时的兜底处理
      console.error(r)
      ElMessage.error('下载文件出现错误，请联系管理员！')
      // 确保异常情况下也关闭 Loading 遮罩，避免页面一直处于加载状态
      downloadLoadingInstance.close()
    })
  },

  /**
   * 触发浏览器文件下载（file-saver 封装）
   *
   * 说明：
   * - 对 file-saver 库的 saveAs 方法做一层封装，统一下载入口
   * - 外部如需直接触发下载（不走服务端接口），可直接调用此方法
   *
   * @param {Blob|string} text Blob 对象或文件内容
   * @param {string}      name 保存到本地的文件名
   * @param {object}      opts 可选配置项，透传给 file-saver
   */
  saveAs(text, name, opts) {
    saveAs(text, name, opts)
  },

  /**
   * 解析并展示响应体中的错误信息
   *
   * 说明：
   * - 当服务端返回非 Blob 数据（如错误 JSON）时，调用此方法解析错误内容
   * - 优先使用错误码映射表（errorCode）中的描述，其次使用响应体中的 msg 字段
   * - 若两者均无，则使用 errorCode['default'] 作为兜底提示
   *
   * @param {Blob} data 响应体 Blob 数据（包含错误信息的 JSON 字符串）
   */
  async printErrMsg(data) {
    // 将 Blob 转换为文本字符串
    const resText = await data.text()
    // 解析为 JSON 对象，获取错误码和错误信息
    const rspObj = JSON.parse(resText)
    // 优先使用错误码映射，其次使用响应 msg，最后降级到默认错误提示
    const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
    ElMessage.error(errMsg)
  }
}
