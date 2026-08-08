/**
 * 组件：Editor（富文本编辑器）
 * 功能：基于 Quill 的富文本编辑器，支持工具栏、图片上传（url/base64）、粘贴图片、自定义高度/只读模式。
 *
 * 用法：<Editor value={form.content} onChange={(v) => setForm(...)} minHeight={192} />
 */
import { useEffect, useRef } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import axios from 'axios'
import { getAuthHeaders } from '@/utils/auth'
import modal from '@/utils/modal'
import './editor.scss'

interface EditorProps {
  /** 编辑器的内容（受控 value） */
  value?: string
  /** 内容变化事件 */
  onChange?: (value: string) => void
  /** 编辑器高度（px），不传则自适应 */
  height?: number | null
  /** 编辑器最小高度（px） */
  minHeight?: number | null
  /** 是否只读 */
  readOnly?: boolean
  /** 上传文件大小限制（MB） */
  fileSize?: number
  /** 图片上传方式：url（上传到服务器拿链接）/ base64（转 base64 直接嵌入） */
  type?: string
}

/**
 * 富文本编辑器
 */
export default function Editor({
  value,
  onChange,
  height = null,
  minHeight = null,
  readOnly = false,
  fileSize = 5,
  type = 'url'
}: EditorProps) {
  const quillRef = useRef<ReactQuill>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadUrl = import.meta.env.VITE_APP_BASE_API + '/file/upload'
  const headers = getAuthHeaders()

  // 编辑器样式：最小高度 / 高度
  const styles: React.CSSProperties = {}
  if (minHeight) {
    styles.minHeight = `${minHeight}px`
  }
  if (height) {
    styles.height = `${height}px`
  }

  // 工具栏 + 图片上传劫持 + 粘贴监听
  const modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['clean'],
        ['link', 'image', 'video']
      ],
      handlers: {
        image: function (this: any, _value: any) {
          if (type === 'url') {
            // 触发隐藏的文件上传
            fileInputRef.current?.click()
          }
        }
      }
    },
    clipboard: {}
  }

  // 编辑器初始化后：监听粘贴事件（粘贴图片上传）
  useEffect(() => {
    if (type !== 'url') return
    const quill = quillRef.current?.getEditor()
    if (!quill) return
    const handlePasteCapture = (e: ClipboardEvent) => {
      const clipboard = e.clipboardData || (window as any).clipboardData
      if (clipboard && clipboard.items) {
        for (let i = 0; i < clipboard.items.length; i++) {
          const item = clipboard.items[i]
          if (item.type.indexOf('image') !== -1) {
            e.preventDefault()
            const file = item.getAsFile()
            insertImage(file)
          }
        }
      }
    }
    quill.root.addEventListener('paste', handlePasteCapture, true)
    return () => {
      quill.root.removeEventListener('paste', handlePasteCapture, true)
    }
     
  }, [type])

  // 上传前校验格式和大小
  const handleBeforeUpload = (file: File): boolean => {
    const typeList = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg']
    const isJPG = typeList.includes(file.type)
    // 检验文件格式
    if (!isJPG) {
      modal.msgError('图片格式错误!')
      return false
    }
    // 校检文件大小
    if (fileSize) {
      const isLt = file.size / 1024 / 1024 < fileSize
      if (!isLt) {
        modal.msgError(`上传文件大小不能超过 ${fileSize} MB!`)
        return false
      }
    }
    return true
  }

  // 上传成功：在光标位置插入图片
  const handleUploadSuccess = (res: any) => {
    if (res.code === 200) {
      const quill = quillRef.current?.getEditor()
      if (!quill) return
      // 获取光标位置
      const length = quill.getSelection(true)?.index ?? 0
      // 插入图片
      quill.insertEmbed(length, 'image', import.meta.env.VITE_APP_BASE_API + res.data.fileName)
      // 调整光标到最后
      quill.setSelection(length + 1)
    } else {
      modal.msgError('图片插入失败')
    }
  }

  // 上传失败处理
  const handleUploadError = () => {
    modal.msgError('图片插入失败')
  }

  // 粘贴图片时上传到服务器
  const insertImage = (file: File | null) => {
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    axios
      .post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: headers.Authorization
        }
      })
      .then((res) => {
        handleUploadSuccess(res.data)
      })
  }

  // 隐藏的文件上传：点击工具栏图片按钮时触发
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    if (!handleBeforeUpload(file)) {
      e.target.value = ''
      return
    }
    const formData = new FormData()
    formData.append('file', file)
    axios
      .post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: headers.Authorization
        }
      })
      .then((res) => {
        handleUploadSuccess(res.data)
      })
      .catch(() => {
        handleUploadError()
      })
      .finally(() => {
        e.target.value = ''
      })
  }

  return (
    <div className="editor">
      <input ref={fileInputRef} type="file" accept="image/*" className="editor-img-uploader" onChange={handleFileChange} />
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value === undefined || value === null ? '<p></p>' : value}
        onChange={(html) => {
          onChange && onChange(html)
        }}
        modules={modules}
        readOnly={readOnly}
        placeholder="请输入内容"
        style={styles}
      />
    </div>
  )
}
