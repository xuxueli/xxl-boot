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
 */
import axios from 'axios'
import { saveAs } from 'file-saver'
import type FileSaver from 'file-saver'
import { getAuthHeaders } from '@/utils/auth'
import { errorCode } from '@/utils/request'
import { blobValidate } from '@/utils/common'
import modal from '@/utils/modal'

// 接口请求的基础 URL，从 Vite 环境变量中读取（对应 .env 文件中的 VITE_APP_BASE_API）
const baseURL = import.meta.env.VITE_APP_BASE_API

/**
 * 对外导出的下载插件对象
 */
export default {
  /**
   * 按文件名下载服务端文件
   *
   * @param name     服务端文件名（会进行 URI 编码后拼接到请求参数中）
   * @param isDelete 是否在下载完成后删除服务端源文件，默认 true
   */
  name(name: string, isDelete = true) {
    // 拼接下载请求地址，对文件名进行 URI 编码防止特殊字符导致请求失败
    const url = baseURL + '/common/download?fileName=' + encodeURIComponent(name) + '&delete=' + isDelete
    axios({
      method: 'get',
      url: url,
      responseType: 'blob', // 以二进制流方式接收响应，适用于文件下载
      headers: getAuthHeaders() // 附加 Token 完成鉴权
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
   * @param resource 服务端资源路径（会进行 URI 编码后拼接到请求参数中）
   */
  resource(resource: string) {
    // 拼接资源下载请求地址
    const url = baseURL + '/common/download/resource?resource=' + encodeURIComponent(resource)
    axios({
      method: 'get',
      url: url,
      responseType: 'blob', // 以二进制流方式接收响应
      headers: getAuthHeaders() // 附加 Token 完成鉴权
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
   * @param url  ZIP 文件的服务端接口路径（相对路径，会自动拼接 baseURL）
   * @param name 保存到本地的文件名，例如 '导出数据.zip'
   */
  zip(url: string, name: string) {
    // 拼接完整请求地址
    const fullUrl = baseURL + url
    // 显示全屏下载 Loading 遮罩，提示用户正在下载
    modal.loading('正在下载数据，请稍候')
    axios({
      method: 'get',
      url: fullUrl,
      responseType: 'blob', // 以二进制流方式接收响应
      headers: getAuthHeaders() // 附加 Token 完成鉴权
    })
      .then((res) => {
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
        modal.closeLoading()
      })
      .catch((r) => {
        // 请求发生网络异常或服务端错误时的兜底处理
        console.error(r)
        modal.msgError('下载文件出现错误，请联系管理员！')
        // 确保异常情况下也关闭 Loading 遮罩，避免页面一直处于加载状态
        modal.closeLoading()
      })
  },

  /**
   * 触发浏览器文件下载（file-saver 封装）
   *
   * @param text Blob 对象或文件内容
   * @param name 保存到本地的文件名
   * @param opts 可选配置项，透传给 file-saver
   */
  saveAs(text: Blob | string, name: string, opts?: FileSaver.FileSaverOptions) {
    saveAs(text, name, opts)
  },

  /**
   * 解析并展示响应体中的错误信息
   *
   * @param data 响应体 Blob 数据（包含错误信息的 JSON 字符串）
   */
  async printErrMsg(data: Blob) {
    // 将 Blob 转换为文本字符串
    const resText = await data.text()
    // 解析为 JSON 对象，获取错误码和错误信息
    const rspObj = JSON.parse(resText) as { code?: number; msg?: string }
    // 优先使用错误码映射，其次使用响应 msg，最后降级到默认错误提示
    const errMsg = errorCode[String(rspObj.code)] || rspObj.msg || errorCode['default']
    modal.msgError(errMsg)
  }
}
