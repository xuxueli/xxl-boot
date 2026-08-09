/**
 * 组件：UserInfo（基本资料编辑）
 * 功能：编辑当前登录用户的用户名称、手机号、邮箱
 */
import { useEffect } from 'react'
import { Button, Form, Input } from 'antd'
import { updateUserProfile } from '@/api/authz/user'
import modal from '@/utils/modal'
import tab from '@/utils/tab'
import type { User } from '@/types/api'

interface UserInfoProps {
  /** 当前登录用户信息 */
  user?: User
}

/**
 * 基本资料编辑表单
 */
export default function UserInfo({ user }: UserInfoProps) {
  const [form] = Form.useForm()

  // 回显当前登录用户信息
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        realName: user.realName,
        email: user.email as string,
        phone: user.phone as string
      })
    }
  }, [user, form])

  /** 提交按钮 */
  function submit() {
    form.validateFields().then((values) => {
      updateUserProfile(values as User).then(() => {
        modal.msgSuccess('修改成功')
      })
    })
  }

  /** 关闭按钮 */
  function close() {
    tab.closePage()
  }

  return (
    <Form form={form} labelCol={{ span: 4 }}>
      <Form.Item label="用户名称" name="realName" rules={[{ required: true, message: '用户名称不能为空' }]}>
        <Input maxLength={30} placeholder="请输入用户名称" />
      </Form.Item>
      <Form.Item label="手机号码" name="phone" rules={[{ pattern: /^\d{5,20}$/, message: '手机号格式不正确' }]}>
        <Input maxLength={20} placeholder="请输入手机号码" />
      </Form.Item>
      <Form.Item label="邮箱" name="email" rules={[{ type: 'email', message: '邮箱格式不正确' }]}>
        <Input maxLength={100} placeholder="请输入邮箱" />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 4 }}>
        <Button type="primary" onClick={submit}>
          保存
        </Button>
        <Button danger style={{ marginLeft: 8 }} onClick={close}>
          关闭
        </Button>
      </Form.Item>
    </Form>
  )
}
