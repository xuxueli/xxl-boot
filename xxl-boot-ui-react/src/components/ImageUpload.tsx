/**
 * 组件：ImageUpload（图片上传）
 * 功能：图片墙模式上传，支持多图、拖拽排序、预览大图、类型/大小校验。
 * 用法：<ImageUpload value={form.images} onChange={(v) => setForm({ ...form, images: v })} limit={5} />
 */
import { useEffect, useRef, useState } from 'react'
import { Modal, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Sortable from 'sortablejs'
import { getAuthHeaders } from '@/utils/auth'
import { isExternal } from '@/utils/validate'
import modal from '@/utils/modal'
import './imageUpload.scss'

/** 图片项 */
interface ImageItem {
  name: string
  url: string
}

interface ImageUploadProps {
  /** 图片列表：逗号分隔字符串 / 对象 / 数组 */
  value?: string | object | any[]
  /** 上传接口地址（相对于 base API） */
  action?: string
  /** 上传时携带的额外参数 */
  data?: object
  /** 图片数量上限 */
  limit?: number
  /** 单张图片大小上限（MB） */
  fileSize?: number
  /** 允许的图片后缀 */
  fileType?: string[]
  /** 是否显示格式/大小提示 */
  isShowTip?: boolean
  /** 禁用上传（仅展示已上传图片） */
  disabled?: boolean
  /** 是否启用拖拽排序 */
  drag?: boolean
  /** 值变化事件 */
  onChange?: (value: string) => void
}

/**
 * 图片上传
 */
export default function ImageUpload({
  value,
  action = '/file/upload',
  data,
  limit = 5,
  fileSize = 5,
  fileType = ['png', 'jpg', 'jpeg'],
  isShowTip = true,
  disabled = false,
  drag = true,
  onChange
}: ImageUploadProps) {
  const [fileList, setFileList] = useState<ImageItem[]>([])
  const [number, setNumber] = useState(0)
  const uploadListRef = useRef<ImageItem[]>([])
  const [dialogImageUrl, setDialogImageUrl] = useState('')
  const [dialogVisible, setDialogVisible] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const baseUrl = import.meta.env.VITE_APP_BASE_API
  const uploadImgUrl = import.meta.env.VITE_APP_BASE_API + action
  const headers = getAuthHeaders()
  const showTip = isShowTip && (fileType.length > 0 || !!fileSize)

  // 监听外部 value 变化，同步到文件列表，自动补齐 baseUrl
  useEffect(() => {
    if (value) {
      const list = Array.isArray(value) ? value : String(value).split(',')
      const mapped = list.map((item: any) => {
        if (typeof item === 'string') {
          // 缺少 baseUrl 且非外链时补齐
          if (item.indexOf(baseUrl) === -1 && !isExternal(item)) {
            return { name: baseUrl + item, url: baseUrl + item }
          }
          return { name: item, url: item }
        }
        return item
      })
      setFileList(mapped)
    } else {
      setFileList([])
    }
  }, [value])

  // 初始化拖拽排序（sortablejs）
  useEffect(() => {
    if (drag && !disabled && listRef.current) {
      const element = listRef.current.querySelector('.ant-upload-list') as HTMLElement
      if (!element) return
      const sortable = Sortable.create(element, {
        animation: 150,
        onEnd: (evt) => {
          setFileList((prev) => {
            const next = [...prev]
            const movedItem = next.splice(evt.oldIndex!, 1)[0]
            next.splice(evt.newIndex!, 0, movedItem)
            onChange && onChange(listToString(next))
            return next
          })
        }
      })
      return () => {
        sortable.destroy()
      }
    }
     
  }, [drag, disabled])

  // 上传前校验
  const handleBeforeUpload = (file: File) => {
    let isImg = false
    if (fileType.length) {
      let fileExtension = ''
      if (file.name.lastIndexOf('.') > -1) {
        fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1)
      }
      isImg = fileType.some((type) => {
        if (file.type.indexOf(type) > -1) return true
        if (fileExtension && fileExtension.indexOf(type) > -1) return true
        return false
      })
    } else {
      isImg = file.type.indexOf('image') > -1
    }
    if (!isImg) {
      modal.msgError(`文件格式不正确，请上传${fileType.join('/')}图片格式文件!`)
      return Upload.LIST_IGNORE
    }
    if (file.name.includes(',')) {
      modal.msgError('文件名不正确，不能包含英文逗号!')
      return Upload.LIST_IGNORE
    }
    if (fileSize) {
      const isLt = file.size / 1024 / 1024 < fileSize
      if (!isLt) {
        modal.msgError(`上传图片大小不能超过 ${fileSize} MB!`)
        return Upload.LIST_IGNORE
      }
    }
    modal.loading('正在上传图片，请稍候...')
    setNumber((prev) => prev + 1)
    return true
  }

  // 上传成功回调
  const handleUploadSuccess = (res: any) => {
    if (res.code === 200) {
      uploadListRef.current = [...uploadListRef.current, { name: res.fileName, url: res.fileName }]
      uploadedSuccessfully()
    } else {
      setNumber((prev) => prev - 1)
      modal.closeLoading()
      modal.msgError(res.msg)
      uploadedSuccessfully()
    }
  }

  // 上传失败
  const handleUploadError = () => {
    setNumber((prev) => prev - 1)
    modal.msgError('上传图片失败')
    modal.closeLoading()
  }

  // 删除图片
  const handleDelete = (index: number) => {
    if (uploadListRef.current.length !== number) return
    setFileList((prev) => {
      const next = [...prev]
      next.splice(index, 1)
      onChange && onChange(listToString(next))
      return next
    })
  }

  // 全部上传完毕：合并新旧列表，回写 value
  const uploadedSuccessfully = () => {
    const count = number
    if (count > 0 && uploadListRef.current.length === count) {
      setFileList((prev) => {
        const next = prev.filter((f) => f.url !== undefined).concat(uploadListRef.current)
        onChange && onChange(listToString(next))
        return next
      })
      uploadListRef.current = []
      setNumber(0)
      modal.closeLoading()
    }
  }

  return (
    <div className="component-upload-image">
      {/* 上传组件（picture-card 图片墙） */}
      <Upload
        listType="picture-card"
        multiple
        disabled={disabled}
        action={uploadImgUrl}
        data={data as Record<string, unknown> | undefined}
        headers={headers as any}
        showUploadList={{ showPreviewIcon: true, showRemoveIcon: !disabled }}
        fileList={fileList.map((f, index) => ({ uid: String(index), name: f.name, url: f.url, status: 'done' }))}
        onChange={({ file, fileList: fl }) => {
          // 处理上传完成/失败
          if (file.status === 'done') {
            handleUploadSuccess(file.response)
          } else if (file.status === 'error') {
            handleUploadError()
          }
          // 删除事件
          if (file.status === 'removed') {
            handleDelete(fl.length)
          }
          setFileList(
            fl.map((f) => ({ name: f.name, url: String(f.url || f.response?.fileName || '') })).filter((f) => f.url)
          )
        }}
        onPreview={(file) => {
          setDialogImageUrl(file.url || file.response?.fileName || '')
          setDialogVisible(true)
        }}
        beforeUpload={handleBeforeUpload}
      >
        {fileList.length >= limit || disabled ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
          </div>
        )}
      </Upload>

      {/* 上传提示 */}
      {showTip && !disabled && (
        <div className="el-upload__tip">
          请上传
          {fileSize && (
            <span>
              大小不超过 <b style={{ color: '#f56c6c' }}>{fileSize}MB</b>
            </span>
          )}
          {fileType.length > 0 && (
            <span>
              格式为 <b style={{ color: '#f56c6c' }}>{fileType.join('/')}</b>
            </span>
          )}
          的文件
        </div>
      )}

      {/* 预览弹窗 */}
      <Modal title="预览" open={dialogVisible} footer={null} width={800} onCancel={() => setDialogVisible(false)}>
        <img src={dialogImageUrl} alt="preview" style={{ display: 'block', maxWidth: '100%', margin: '0 auto' }} />
      </Modal>
    </div>
  )
}

/**
 * 图片列表转逗号分隔的相对路径字符串（去掉 baseUrl 和 blob 临时路径）
 */
function listToString(list: ImageItem[], separator = ',') {
  const baseUrl: string = import.meta.env.VITE_APP_BASE_API
  let strs = ''
  for (const item of list) {
    if (item.url !== undefined && item.url.indexOf('blob:') !== 0) {
      strs += item.url.replace(baseUrl, '') + separator
    }
  }
  return strs !== '' ? strs.substr(0, strs.length - 1) : ''
}
