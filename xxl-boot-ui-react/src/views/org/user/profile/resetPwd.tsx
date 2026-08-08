/**
 * 组件：ResetPwd（修改密码）
 * 功能：旧密码、新密码、确认密码表单提交，修改当前登录用户密码
 */
import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { usePasswordRule } from '@/hooks/usePasswordRule'
import { updateUserPwd } from '@/api/org/user'
import modal from '@/utils/modal'
import tab from '@/utils/tab'

/** 密码表单数据 */
interface PwdForm {
  oldPassword?: string
  newPassword?: string
  confirmPassword?: string
}

/**
 * 修改密码表单
 */
export default function ResetPwd() {
  const [form] = Form.useForm()

  // 密码强度校验规则（新密码）
  const { infoPwdValidator } = usePasswordRule()

  // 密码表单数据（供确认密码一致性校验使用）
  const [user, setUser] = useState<PwdForm>({
    oldPassword: undefined,
    newPassword: undefined,
    confirmPassword: undefined
  })

  /** 校验两次密码是否一致 */
  const equalToPassword = (_rule: unknown, value: unknown) => {
    if (user.newPassword !== value) {
      return Promise.reject(new Error('两次输入的密码不一致'))
    }
    return Promise.resolve()
  }

  /** 提交按钮 */
  function submit() {
    form.validateFields().then(() => {
      updateUserPwd(user.oldPassword as string, user.newPassword as string).then(() => {
        modal.msgSuccess('修改成功')
        form.resetFields()
      })
    })
  }

  /** 关闭按钮 */
  function close() {
    tab.closePage()
  }

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      onValuesChange={(changed) => setUser((prev) => ({ ...prev, ...changed }))}
    >
      <Form.Item label="旧密码" name="oldPassword" rules={[{ required: true, message: '旧密码不能为空' }]}>
        <Input.Password placeholder="请输入旧密码" />
      </Form.Item>
      <Form.Item label="新密码" name="newPassword" rules={infoPwdValidator}>
        <Input.Password placeholder="请输入新密码" />
      </Form.Item>
      <Form.Item
        label="确认密码"
        name="confirmPassword"
        dependencies={['newPassword']}
        rules={[
          { required: true, message: '确认密码不能为空' },
          { validator: equalToPassword }
        ]}
      >
        <Input.Password placeholder="请确认新密码" />
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
