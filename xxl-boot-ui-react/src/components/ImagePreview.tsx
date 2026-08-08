/**
 * 组件：ImagePreview（图片预览）
 * 功能：基于 antd Image 的图片预览组件，支持单张/多张图片（逗号分隔），自动拼接 API 基础路径。
 *
 * 用法：<ImagePreview src={item.url} width="100px" height="100px" />
 */
import { Image } from 'antd'
import { PictureOutlined } from '@ant-design/icons'
import { isExternal } from '@/utils/validate'
import './imagePreview.scss'

interface ImagePreviewProps {
  /** 图片 URL，多张用逗号分隔（第一张为主图，全部进入预览列表） */
  src?: string
  /** 显示宽度，如 "100px" 或 100 */
  width?: number | string
  /** 显示高度，如 "100px" 或 100 */
  height?: number | string
}

/**
 * 图片预览
 */
export default function ImagePreview({ src = '', width = '', height = '' }: ImagePreviewProps) {
  /**
   * 主图 src：取第一张；外部 URL 不拼接 base API，内部 URL 拼接
   */
  const realSrc = (() => {
    if (!src) return ''
    const first = src.split(',')[0]
    if (isExternal(first)) {
      return first
    }
    return import.meta.env.VITE_APP_BASE_API + first
  })()

  /**
   * 预览列表：所有图片
   */
  const realSrcList = (() => {
    if (!src) return []
    const srcList: string[] = []
    src.split(',').forEach((item) => {
      if (isExternal(item)) {
        srcList.push(item)
      } else {
        srcList.push(import.meta.env.VITE_APP_BASE_API + item)
      }
    })
    return srcList
  })()

  // 宽高
  const realWidth = typeof width === 'string' ? width : `${width}px`
  const realHeight = typeof height === 'string' ? height : `${height}px`

  return (
    <Image.PreviewGroup items={realSrcList}>
      <Image
        src={realSrc}
        style={{ width: realWidth, height: realHeight, borderRadius: 5, objectFit: 'cover', cursor: 'pointer' }}
        fallback=""
        placeholder={<PictureOutlined className="image-slot-icon" />}
      />
    </Image.PreviewGroup>
  )
}
