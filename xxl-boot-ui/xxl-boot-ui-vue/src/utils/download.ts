/**
 * 插件名称：download（文件下载工具）
 *
 * 能力说明：
 * - 通用下载：download() 以 POST + form-urlencoded 提交业务导出请求
 * - 插件对象默认导出：zip() 下载 ZIP 压缩包（带全屏 Loading 遮罩）
 * - 内置 saveAs / printErrMsg 封装，统一触发下载、解析响应体错误
 *
 * 典型用法（组件内）：
 *   // 下载 ZIP 压缩包
 *   this.$download.zip('/tool/codegen/batchGenCode', 'boot.zip')
 */
import { ElLoading, ElMessage } from 'element-plus'
import { saveAs } from 'file-saver'
import type FileSaver from 'file-saver'
import service, { errorCode, type RequestConfig } from '@/utils/request'
import { tansParams, blobValidate } from '@/utils/common'
import modal from '@/utils/modal'

// 全局下载 Loading 实例，用于 zip 方法中显示/关闭全屏加载遮罩
let downloadLoadingInstance: ReturnType<typeof ElLoading.service> | null = null

/**
 * 对外导出的下载插件对象
 */
export default {
  /**
   * 下载 ZIP 压缩包
   *
   * 说明：
   * - 请求前显示全屏 Loading 遮罩，下载完成或出错后关闭
   * - 响应体以 application/zip 类型构造 Blob，使用传入的 name 作为保存文件名
   * - 请求异常时通过 catch 兜底，打印错误日志并弹出错误提示
   *
   * @param url  ZIP 文件的服务端接口路径（相对路径，会自动拼接 baseURL）
   * @param name 保存到本地的文件名，例如 '导出数据.zip'
   */
  zip(url: string, name: string) {
    // 显示全屏下载 Loading 遮罩，提示用户正在下载
    downloadLoadingInstance = ElLoading.service({ text: '正在下载数据，请稍候', background: 'rgba(0, 0, 0, 0.7)' })
    // 请求拦截器统一注入 token，响应拦截器对 blob 透传为 Blob
    service({
      method: 'get',
      url: url,
      responseType: 'blob'
    })
      .then((res) => {
        // 响应拦截器已对 blob 透传为 Blob，res 即 Blob（非 AxiosResponse）
        const blobData = res as unknown as Blob
        // 校验响应体是否为合法的 Blob 文件数据
        const isBlob = blobValidate(blobData)
        if (isBlob) {
          // 以 application/zip MIME 类型构造 Blob，触发浏览器下载并指定文件名
          const blob = new Blob([blobData], { type: 'application/zip' })
          this.saveAs(blob, name)
        } else {
          // 响应体为错误信息 JSON，解析后展示错误提示
          this.printErrMsg(blobData)
        }
        // 无论成功与否，关闭下载 Loading 遮罩
        downloadLoadingInstance?.close()
      })
      .catch((r) => {
        // 请求发生网络异常或服务端错误时的兜底处理
        console.error(r)
        ElMessage.error('下载文件出现错误，请联系管理员！')
        // 确保异常情况下也关闭 Loading 遮罩，避免页面一直处于加载状态
        downloadLoadingInstance?.close()
      })
  },

  /**
   * 触发浏览器文件下载（file-saver 封装）
   *
   * 说明：
   * - 对 file-saver 库的 saveAs 方法做一层封装，统一下载入口
   * - 外部如需直接触发下载（不走服务端接口），可直接调用此方法
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
   * 说明：
   * - 当服务端返回非 Blob 数据（如错误 JSON）时，调用此方法解析错误内容
   * - 优先使用错误码映射表（errorCode）中的描述，其次使用响应体中的 msg 字段
   * - 若两者均无，则使用 errorCode['default'] 作为兜底提示
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
    ElMessage.error(errMsg)
  }
}

/**
 * 通用文件下载（POST，form-urlencoded）
 *
 * 以 POST + form-urlencoded 提交下载请求，响应为 blob 二进制流，供业务导出等场景使用。
 * 发送过程复用 request service（token 注入、blob 透传），展示全屏 Loading 遮罩。
 *
 * @param url      下载接口地址
 * @param params   请求参数（会被序列化为 application/x-www-form-urlencoded）
 * @param filename 保存到本地的文件名
 * @param config   额外的 axios 请求配置（可选）
 */
export function download(
  url: string,
  params: object,
  filename: string,
  config?: RequestConfig
): void {
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
      if (blobValidate(blobData)) {
        // 响应为正常文件内容，触发浏览器下载
        const blob = new Blob([blobData])
        saveAs(blob, filename)
      } else {
        // 服务端以 blob 格式返回了 JSON 错误报文
        const resText = await blobData.text()
        const rspObj = JSON.parse(resText) as { code?: number; msg?: string }
        const errMsg =
          errorCode[String(rspObj.code)] || rspObj.msg || errorCode.default
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
