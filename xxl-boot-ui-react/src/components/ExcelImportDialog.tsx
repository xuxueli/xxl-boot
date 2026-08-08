/**
 * 组件：ExcelImportDialog（Excel 导入弹窗）
 * 功能：Excel 文件导入对话框，支持文件拖拽上传、模板下载、覆盖更新选项。
 * 用法：<ExcelImportDialog ref={importRef} title="用户导入" action="/system/user/importData" onSuccess={getList} />
 */
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Button, Checkbox, Modal, Upload } from 'antd'
import { InboxOutlined, LinkOutlined } from '@ant-design/icons'
import { message } from 'antd'
import axios from 'axios'
import { getAuthHeaders } from '@/utils/auth'
import { download } from '@/utils/request'
import modal from '@/utils/modal'

export interface ExcelImportDialogHandle {
  /** 打开对话框 */
  open: () => void
}

interface ExcelImportDialogProps {
  /** 对话框标题 */
  title?: string
  /** 对话框宽度 */
  width?: number | string
  /** 上传接口地址（必传，相对路径） */
  action: string
  /** 模板下载接口地址，不传则不显示下载模板链接 */
  templateAction?: string
  /** 模板文件名前缀 */
  templateFileName?: string
  /** 覆盖更新勾选框的说明文字 */
  updateSupportLabel?: string
  /** 导入成功事件 */
  onSuccess?: () => void
}

/**
 * Excel 导入弹窗
 */
const ExcelImportDialog = forwardRef<ExcelImportDialogHandle, ExcelImportDialogProps>(function ExcelImportDialog(
  {
    title = '数据导入',
    width = 400,
    action,
    templateAction = '',
    templateFileName = 'template',
    updateSupportLabel = '是否更新已经存在的数据',
    onSuccess
  },
  ref
) {
  const [visible, setVisible] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [updateSupport, setUpdateSupport] = useState(false)
  const headers = getAuthHeaders()

  // 上传地址（拼接 updateSupport 参数）
  const uploadUrl = import.meta.env.VITE_APP_BASE_API + action + '?updateSupport=' + (updateSupport ? 1 : 0)

  /**
   * 打开对话框
   */
  const open = () => {
    setUpdateSupport(false)
    setIsUploading(false)
    setSelectedFile(null)
    setVisible(true)
  }

  useImperativeHandle(ref, () => ({ open }))

  /**
   * 关闭时清理上传状态
   */
  const handleClose = () => {
    setIsUploading(false)
    setSelectedFile(null)
  }

  /**
   * 下载导入模板文件
   */
  const handleDownloadTemplate = () => {
    download(templateAction, {}, `${templateFileName}_${new Date().getTime()}.xlsx`)
  }

  /**
   * 上传成功：关闭弹窗，弹出导入结果消息
   */
  const handleSuccess = (response: any) => {
    setVisible(false)
    setIsUploading(false)
    setSelectedFile(null)
    Modal.info({
      title: '导入结果',
      content: (
        <div style={{ overflow: 'auto', overflowX: 'hidden', maxHeight: '70vh', padding: '10px 20px 0' }} dangerouslySetInnerHTML={{ __html: response.msg }} />
      )
    })
    onSuccess && onSuccess()
  }

  /**
   * 提交上传：校验文件格式后执行上传
   */
  const handleSubmit = () => {
    const file = selectedFile
    if (!file || (!file.name.toLowerCase().endsWith('.xls') && !file.name.toLowerCase().endsWith('.xlsx'))) {
      modal.msgError('请选择后缀为 "xls"或"xlsx"的文件。')
      return
    }
    setIsUploading(true)
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
        handleSuccess(res.data)
      })
      .catch(() => {
        setIsUploading(false)
        modal.msgError('上传失败')
      })
  }

  return (
    <Modal title={title} open={visible} width={width} onCancel={() => setVisible(false)} onOk={handleSubmit} okText="确定" cancelText="取消" confirmLoading={isUploading} afterClose={handleClose}>
      <Upload.Dragger
        accept=".xlsx, .xls"
        maxCount={1}
        disabled={isUploading}
        beforeUpload={(file) => {
          setSelectedFile(file)
          return false
        }}
        onRemove={() => setSelectedFile(null)}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
        <p className="ant-upload-hint">
          <div>
            <Checkbox checked={updateSupport} onChange={(e) => setUpdateSupport(e.target.checked)}>
              {updateSupportLabel}
            </Checkbox>
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          {templateAction && (
            <LinkOutlined onClick={handleDownloadTemplate} style={{ cursor: 'pointer', color: '#1677ff' }} />
          )}
        </p>
      </Upload.Dragger>
    </Modal>
  )
})

ExcelImportDialog.displayName = 'ExcelImportDialog'
export default ExcelImportDialog
