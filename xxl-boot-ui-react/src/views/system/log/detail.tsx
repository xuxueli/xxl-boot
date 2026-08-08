/**
 * 组件：LogDetail（日志详情弹窗）
 * 功能：展示单条日志的详细信息
 * @author xuxueli 2026-08-09
 */
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Button, Modal } from 'antd'
import { InfoCircleOutlined, UserOutlined, FileTextOutlined, CopyOutlined } from '@ant-design/icons'
import modal from '@/utils/modal'
import './detail.scss'

export interface LogDetailHandle {
  /** 打开详情弹窗 */
  open: (row: any) => void
}

/** 组件入参类型 */
interface LogDetailProps {
  /** 系统模块编码 → 名称映射 */
  moduleMap?: Record<number | string, string | undefined>
}

/**
 * 日志详情弹窗
 */
const LogDetail = forwardRef<LogDetailHandle, LogDetailProps>(function LogDetail({ moduleMap = {} }, ref) {
  const [visible, setVisible] = useState(false)
  const [row, setRow] = useState<any>({})

  /** 打开详情弹窗 */
  function open(row: any) {
    setRow(row)
    setVisible(true)
  }

  /** 关闭详情弹窗 */
  function handleClose() {
    setVisible(false)
  }

  useImperativeHandle(ref, () => ({ open }))

  /** 复制文本到剪贴板 */
  function copyText(str: string | undefined) {
    const text = str || ''
    // 优先使用 Clipboard API，不支持时降级为 execCommand
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => modal.msgSuccess('已复制'))
    } else {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      modal.msgSuccess('已复制')
    }
  }

  return (
    <Modal title="日志详细" open={visible} width={700} footer={null} onCancel={handleClose} destroyOnClose>
      <div className="detail-wrap">
        {/* 基本信息 */}
        <div className="detail-card">
          <div className="detail-card-title">
            <InfoCircleOutlined /> 基本信息
          </div>
          <div className="detail-row" style={{ display: 'flex' }}>
            <div className="detail-item" style={{ flex: 1 }}>
              <span className="detail-label">日志类型</span>
              <span className="detail-value">
                {row.type === 0 ? '操作日志' : row.type === 1 ? '登陆日志' : row.type}
              </span>
            </div>
            <div className="detail-item" style={{ flex: 1 }}>
              <span className="detail-label">系统模块</span>
              <span className="detail-value">{moduleMap[row.module] || row.module}</span>
            </div>
          </div>
          <div className="detail-row" style={{ display: 'flex' }}>
            <div className="detail-item" style={{ flex: 1 }}>
              <span className="detail-label">日志编号</span>
              <span className="detail-value">{row.id}</span>
            </div>
            <div className="detail-item" style={{ flex: 1 }}>
              <span className="detail-label">日志标题</span>
              <span className="detail-value">{row.title}</span>
            </div>
          </div>
        </div>

        {/* 操作人信息 */}
        <div className="detail-card">
          <div className="detail-card-title">
            <UserOutlined /> 操作人信息
          </div>
          <div className="detail-row" style={{ display: 'flex' }}>
            <div className="detail-item" style={{ flex: 1 }}>
              <span className="detail-label">操作人</span>
              <span className="detail-value">{row.operator}</span>
            </div>
            <div className="detail-item" style={{ flex: 1 }}>
              <span className="detail-label">操作时间</span>
              <span className="detail-value">{row.addTime}</span>
            </div>
          </div>
          <div className="detail-row" style={{ display: 'flex' }}>
            <div className="detail-item" style={{ flex: 1 }}>
              <span className="detail-label">操作IP</span>
              <span className="detail-value">{row.ip}</span>
            </div>
            <div className="detail-item" style={{ flex: 1 }}>
              <span className="detail-label">操作地址</span>
              <span className="detail-value">{row.ipAddress || row.ip}</span>
            </div>
          </div>
        </div>

        {/* 日志内容 */}
        <div className="detail-card">
          <div className="detail-card-title">
            <FileTextOutlined /> 日志内容
          </div>
          <div className="code-body">
            <div className="code-wrap">
              <div className="code-action">
                <Button size="small" icon={<CopyOutlined />} onClick={() => copyText(row.content)}>
                  复制
                </Button>
              </div>
              <pre className="code-pre">{row.content || '（无数据）'}</pre>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
})

LogDetail.displayName = 'LogDetail'
export default LogDetail
