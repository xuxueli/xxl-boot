/**
 * 组件：FileUpload（文件上传）
 * 功能：通用文件上传组件，支持多文件、拖拽排序、类型/大小校验、可下载文件列表。
 * 用法：<FileUpload value={form.files} onChange={(v) => setForm({ ...form, files: v })} limit={5} fileSize={10} />
 */
import { useEffect, useRef, useState } from 'react'
import { Button, Upload } from 'antd'
import Sortable from 'sortablejs'
import { getAuthHeaders } from '@/utils/auth'
import modal from '@/utils/modal'
import './fileUpload.scss'

/** 文件项 */
interface FileItem {
  name: string
  url: string
  uid?: number
}

interface FileUploadProps {
  /** 文件列表：逗号分隔字符串 / 对象 / 数组 */
  value?: string | object | any[]
  /** 上传接口地址（相对于 base API） */
  action?: string
  /** 上传时携带的额外参数 */
  data?: object
  /** 文件数量上限 */
  limit?: number
  /** 单个文件大小上限（MB） */
  fileSize?: number
  /** 允许的文件后缀列表 */
  fileType?: string[]
  /** 是否显示文件格式/大小提示 */
  isShowTip?: boolean
  /** 禁用上传（仅展示已上传文件列表） */
  disabled?: boolean
  /** 是否启用拖拽排序 */
  drag?: boolean
  /** 值变化事件 */
  onChange?: (value: string) => void
}

/**
 * 文件上传
 */
export default function FileUpload({
  value,
  action = '/file/upload',
  data,
  limit = 5,
  fileSize = 5,
  fileType = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf'],
  isShowTip = true,
  disabled = false,
  drag = true,
  onChange
}: FileUploadProps) {
  const [fileList, setFileList] = useState<FileItem[]>([])
  const [number, setNumber] = useState(0)
  const uploadListRef = useRef<FileItem[]>([])
  const listRef = useRef<HTMLUListElement>(null)
  const baseUrl = import.meta.env.VITE_APP_BASE_API
  const uploadFileUrl = import.meta.env.VITE_APP_BASE_API + action
  const headers = getAuthHeaders()
  const showTip = isShowTip && (fileType.length > 0 || !!fileSize)

  // 监听外部 value 变化，同步到文件列表
  useEffect(() => {
    if (value) {
      const list = Array.isArray(value) ? value : String(value).split(',')
      let temp = 1
      const mapped = list.map((item: any) => {
        let file: any = item
        if (typeof item === 'string') {
          file = { name: item, url: item }
        }
        file.uid = file.uid || new Date().getTime() + temp++
        return file
      })
      setFileList(mapped)
    } else {
      setFileList([])
    }
  }, [value])

  // 初始化拖拽排序（sortablejs）
  useEffect(() => {
    if (drag && !disabled && listRef.current) {
      const sortable = Sortable.create(listRef.current, {
        ghostClass: 'file-upload-darg',
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

  // 上传前置校验
  const handleBeforeUpload = (file: File) => {
    // 校检文件类型
    if (fileType.length) {
      const fileName = file.name.split('.')
      const fileExt = fileName[fileName.length - 1]
      const isTypeOk = fileType.indexOf(fileExt) >= 0
      if (!isTypeOk) {
        modal.msgError(`文件格式不正确，请上传${fileType.join('/')}格式文件!`)
        return Upload.LIST_IGNORE
      }
    }
    // 校检文件名是否包含特殊字符
    if (file.name.includes(',')) {
      modal.msgError('文件名不正确，不能包含英文逗号!')
      return Upload.LIST_IGNORE
    }
    // 校检文件大小
    if (fileSize) {
      const isLt = file.size / 1024 / 1024 < fileSize
      if (!isLt) {
        modal.msgError(`上传文件大小不能超过 ${fileSize} MB!`)
        return Upload.LIST_IGNORE
      }
    }
    modal.loading('正在上传文件，请稍候...')
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

  // 上传失败处理
  const handleUploadError = () => {
    setNumber((prev) => prev - 1)
    modal.msgError('上传文件失败')
    modal.closeLoading()
  }

  // 删除文件列表中的指定项
  const handleDelete = (index: number) => {
    setFileList((prev) => {
      const next = [...prev]
      next.splice(index, 1)
      onChange && onChange(listToString(next))
      return next
    })
  }

  // 全部上传完毕时：合并新旧文件列表，输出到 value
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
    <div className="upload-file">
      {/* 文件上传组件 */}
      {!disabled && (
        <Upload
          multiple
          action={uploadFileUrl}
          beforeUpload={handleBeforeUpload}
          data={data as Record<string, unknown> | undefined}
          headers={headers as any}
          showUploadList={false}
          onChange={({ file }) => {
            if (file.status === 'done') {
              handleUploadSuccess(file.response)
            } else if (file.status === 'error') {
              handleUploadError()
            }
          }}
        >
          <Button type="primary">选取文件</Button>
        </Upload>
      )}

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

      {/* 文件列表 */}
      <ul ref={listRef} className="upload-file-list">
        {fileList.map((file, index) => (
          <li key={file.uid || index} className="ele-upload-list__item-content">
            <a href={`${baseUrl}${file.url}`} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
              <span>{getFileName(file.name)}</span>
            </a>
            <div className="ele-upload-list__item-content-action">
              {!disabled && (
                <a style={{ color: '#f5222d' }} onClick={() => handleDelete(index)}>
                  &nbsp;删除
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * 从 URL 或文件名中提取纯文件名
 */
function getFileName(name: string) {
  if (name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1)
  }
  return name
}

/**
 * 文件列表转逗号分隔的 URL 字符串
 */
function listToString(list: FileItem[], separator = ',') {
  let strs = ''
  for (const item of list) {
    if (item.url) {
      strs += item.url + separator
    }
  }
  return strs !== '' ? strs.substr(0, strs.length - 1) : ''
}
