/**
 * 组件：UserView（用户详情抽屉）
 * 功能：展示用户基本信息、角色信息及账号相关数据
 */
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Drawer, Spin, Tag } from 'antd'
import { listRole } from '@/api/org/role'
import { loadEnumItem } from '@/api/system/dict/data'
import { parseTime } from '@/utils/common'
import type { User, Role } from '@/types/api'
import type { EnumOption } from '@/types'

export interface UserViewHandle {
  /** 打开详情抽屉 */
  open: (row: User) => void
}

/**
 * 用户详情抽屉
 */
const UserView = forwardRef<UserViewHandle>(function UserView(_, ref) {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState<User>({})
  const [statusOptions, setStatusOptions] = useState<EnumOption[]>([])
  const [roleOptions, setRoleOptions] = useState<Role[]>([])

  const roleNames = (() => {
    const roleIds = info.roleIds as number[] | undefined
    if (!roleIds || !roleIds.length) return ''
    return (
      roleOptions
        .filter((r) => roleIds.includes(r.id as number))
        .map((r) => r.name)
        .join('、') || ''
    )
  })()

  /** 状态编码 → 文案 */
  function statusText(status?: number) {
    const item = statusOptions.find((i) => i.code === status)
    return item ? item.title : status
  }

  /** 打开详情抽屉 */
  function open(row: User) {
    setVisible(true)
    setLoading(true)
    setInfo({ ...row })
    listRole({ offset: 0, pagesize: 999 } as any).then((response) => {
      setRoleOptions(response.data.data)
    })
    loadEnumItem('UserStatuEnum')
      .then((res) => {
        setStatusOptions(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  /** 关闭详情抽屉 */
  function handleClose() {
    setVisible(false)
  }

  useImperativeHandle(ref, () => ({ open }))

  return (
    <Drawer title="用户详情" open={visible} width={680} onClose={handleClose} className="detail-drawer">
      <Spin spinning={loading}>
        <div className="drawer-content">
          {/* 基本信息 */}
          <h4 className="section-header">基本信息</h4>
          <div className="info-item">
            <label className="info-label">用户编号：</label>
            <span className="info-value plaintext">{info.id}</span>
          </div>
          <div className="info-item">
            <label className="info-label">账号：</label>
            <span className="info-value plaintext">{String(info.username ?? "")}</span>
          </div>
          <div className="info-item">
            <label className="info-label">用户名称：</label>
            <span className="info-value plaintext">{String(info.realName ?? "")}</span>
          </div>
          <div className="info-item">
            <label className="info-label">所属组织：</label>
            <span className="info-value plaintext">{String(info.orgName ?? "")}</span>
          </div>
          <div className="info-item">
            <label className="info-label">手机号：</label>
            <span className="info-value plaintext">{String(info.phone ?? "")}</span>
          </div>
          <div className="info-item">
            <label className="info-label">邮箱：</label>
            <span className="info-value plaintext">{String(info.email ?? "")}</span>
          </div>
          <div className="info-item">
            <label className="info-label">用户状态：</label>
            <span className="info-value plaintext">
              <Tag color={info.status === 0 ? 'green' : 'red'}>{statusText(Number(info.status))}</Tag>
            </span>
          </div>
          <div className="info-item">
            <label className="info-label">角色：</label>
            <span className="info-value plaintext">{roleNames || '无角色'}</span>
          </div>
          {/* 其他信息 */}
          <h4 className="section-header">其他信息</h4>
          <div className="info-item">
            <label className="info-label">创建时间：</label>
            <span className="info-value plaintext">{parseTime(info.addTime as string)}</span>
          </div>
          <div className="info-item">
            <label className="info-label">更新时间：</label>
            <span className="info-value plaintext">{parseTime(info.updateTime as string)}</span>
          </div>
        </div>
      </Spin>
    </Drawer>
  )
})

UserView.displayName = 'UserView'
export default UserView
