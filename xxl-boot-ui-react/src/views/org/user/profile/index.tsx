/**
 * 页面：Profile（个人中心）
 * 功能：左侧展示当前登录用户基本信息，右侧为基本资料编辑 / 修改密码 tab 页签切换
 */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Col, Row, Tabs } from 'antd'
import SvgIcon from '@/components/SvgIcon'
import UserInfo from './userInfo'
import ResetPwd from './resetPwd'
import { getUserProfile } from '@/api/org/user'
import type { User } from '@/types/api'
import './profile.scss'

/**
 * 个人中心
 * 通过路由参数 activeTab 激活对应 tab（URL 形如 /user/profile/:activeTab）
 */
export default function Profile() {
  const { activeTab } = useParams() // 路由参数：当前激活的 tab
  const navigate = useNavigate() // 路由跳转

  // 用户信息与角色名称
  const [profile, setProfile] = useState<{ user: User; roleNames: string }>({
    user: {}, // 用户信息
    roleNames: '' // 角色名称列表
  })

  // 当前选中的 tab：以路由参数为唯一数据源，默认基本资料
  const selectedTab = activeTab || 'userinfo'

  /** 获取当前登录用户个人信息 */
  function getUser() {
    getUserProfile().then((res) => {
      const user = res.data
      setProfile({
        user,
        roleNames: ((user.roleNames as string[]) || []).join(', ')
      })
    })
  }

  // 页面初始化：加载用户信息
  useEffect(() => {
    getUser()
  }, [])

  /** tab 切换：同步更新 URL（URL 形如 /user/profile/:activeTab） */
  function handleTabChange(key: string) {
    navigate('/user/profile/' + key)
  }

  return (
    <div className="app-container">
      <Row gutter={20}>
        {/* 左侧个人信息 */}
        <Col xs={24} sm={6}>
          <Card title="个人信息" className="box-card">
            <ul className="list-group list-group-striped">
              <li className="list-group-item">
                <SvgIcon iconClass="user" />
                用户账号
                <div className="pull-right">{String(profile.user.username ?? '')}</div>
              </li>
              <li className="list-group-item">
                <SvgIcon iconClass="phone" />
                手机号码
                <div className="pull-right">{String(profile.user.phone ?? '')}</div>
              </li>
              <li className="list-group-item">
                <SvgIcon iconClass="email" />
                用户邮箱
                <div className="pull-right">{String(profile.user.email ?? '')}</div>
              </li>
              <li className="list-group-item">
                <SvgIcon iconClass="tree" />
                所属部门
                <div className="pull-right">{String(profile.user.orgName ?? '')}</div>
              </li>
              <li className="list-group-item">
                <SvgIcon iconClass="peoples" />
                所属角色
                <div className="pull-right">{profile.roleNames || '无角色'}</div>
              </li>
              <li className="list-group-item">
                <SvgIcon iconClass="date" />
                创建日期
                <div className="pull-right">{String(profile.user.addTime ?? '')}</div>
              </li>
            </ul>
          </Card>
        </Col>

        {/* 右侧基本资料 / 修改密码 */}
        <Col xs={24} sm={18}>
          <Card title="基本资料">
            <Tabs
              activeKey={selectedTab}
              onChange={handleTabChange}
              items={[
                { key: 'userinfo', label: '基本资料', children: <UserInfo user={profile.user} /> },
                { key: 'resetPwd', label: '修改密码', children: <ResetPwd /> }
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
