/**
 * 页面：Login（登录页面）
 * 功能：账号密码登录、验证码获取与展示、记住密码（Cookie 回填）
 */
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Checkbox, Form, Input } from 'antd'
import { getCodeImg } from '@/api/login'
import { useUserStore } from '@/stores'
import defaultSettings from '@/default-settings'
import SvgIcon from '@/components/SvgIcon'
import './login.scss'

/**
 * 验证码输入区（单子元素，供 Form.Item 注入 value/onChange）
 * 左侧输入框 + 右侧验证码图片（点击刷新）
 */
interface CaptchaFieldProps {
  /** 验证码输入值（antd Form 注入） */
  value?: string
  /** 值变化事件（antd Form 注入） */
  onChange?: (value: string) => void
  /** 验证码图片地址 */
  codeUrl: string
  /** 点击图片刷新验证码 */
  onRefresh: () => void
  /** 回车提交 */
  onPressEnter: () => void
}

function CaptchaField({ value, onChange, codeUrl, onRefresh, onPressEnter }: CaptchaFieldProps) {
  return (
    <div className="login-captcha-row">
      <Input
        size="large"
        placeholder="验证码"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        prefix={<SvgIcon iconClass="validCode" className="input-icon" />}
        onPressEnter={onPressEnter}
      />
      <div className="login-code">
        <img src={codeUrl} onClick={onRefresh} className="login-code-img" alt="captcha" />
      </div>
    </div>
  )
}

export default function Login() {
  const location = useLocation()
  const navigate = useNavigate()
  const userStore = useUserStore()
  const [form] = Form.useForm()

  // 验证码图片 base64
  const [codeUrl, setCodeUrl] = useState('')
  // 登录按钮 loading
  const [loading, setLoading] = useState(false)
  // 验证码开关（默认开启，实际由后端 /auth/captcha 返回的 enable 决定）
  const [captchaEnabled, setCaptchaEnabled] = useState(true)
  // 验证码标识（不参与表单回显）
  const captchaUuid = useRef('')
  // 登录后重定向地址
  const [redirect, setRedirect] = useState<string>()

  // 监听路由参数，获取重定向地址
  useEffect(() => {
    const query = new URLSearchParams(location.search)
    setRedirect(query.get('redirect') || undefined)
  }, [location.search])

  // 初始化：获取验证码
  useEffect(() => {
    getCode()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * 获取验证码图片，根据开关控制显示
   */
  const getCode = () => {
    getCodeImg().then((res) => {
      setCaptchaEnabled(res.data.enable)
      setCodeUrl(res.data.image)
      captchaUuid.current = res.data.uuid
    })
  }

  /**
   * 处理登录：
   *    - 表单校验（antd Form onFinish 触发时已通过校验）
   *    - →调用登录接口
   *    - →路由跳转
   */
  const handleLogin = (values: { username: string; password: string; rememberMe?: boolean; captchaResult?: string }) => {
    setLoading(true)
    // 执行登录
    userStore
      .login({
        username: values.username,
        password: values.password,
        captchaUuid: captchaUuid.current,
        captchaResult: values.captchaResult,
        rememberMe: values.rememberMe
      })
      .then(() => {
        // 提取除 redirect 外的其他查询参数
        const query = new URLSearchParams(location.search)
        const otherQueryParams: Record<string, string> = {}
        query.forEach((value, key) => {
          if (key !== 'redirect') {
            otherQueryParams[key] = value
          }
        })
        navigate({
          pathname: redirect || '/',
          search: new URLSearchParams(otherQueryParams).toString()
        })
      })
      .catch(() => {
        setLoading(false)
        // 重新获取验证码
        if (captchaEnabled) {
          getCode()
        }
      })
  }

  return (
    <div className="login">
      <Form
        form={form}
        className="login-form"
        onFinish={handleLogin}
        initialValues={{ username: '', password: '', rememberMe: false }}
      >
        <h3 className="title">{defaultSettings.title}</h3>

        {/* 用户名 */}
        <Form.Item name="username" rules={[{ required: true, message: '请输入您的账号' }]}>
          <Input size="large" placeholder="账号" autoComplete="off" prefix={<SvgIcon iconClass="user" className="input-icon" />} />
        </Form.Item>

        {/* 密码 */}
        <Form.Item name="password" rules={[{ required: true, message: '请输入您的密码' }]}>
          <Input.Password
            size="large"
            placeholder="密码"
            autoComplete="off"
            prefix={<SvgIcon iconClass="password" className="input-icon" />}
            onPressEnter={() => form.submit()}
          />
        </Form.Item>

        {/* 验证码 */}
        {captchaEnabled && (
          <Form.Item name="captchaResult" rules={[{ required: true, message: '请输入验证码' }]}>
            <CaptchaField codeUrl={codeUrl} onRefresh={getCode} onPressEnter={() => form.submit()} />
          </Form.Item>
        )}

        {/* 记住密码 */}
        <Form.Item name="rememberMe" valuePropName="checked" style={{ margin: '0px 0px 25px 0px' }}>
          <Checkbox>记住密码</Checkbox>
        </Form.Item>

        {/* login btn */}
        <Form.Item style={{ width: '100%' }}>
          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            {loading ? '登 录 中...' : '登 录'}
          </Button>
        </Form.Item>
      </Form>

      {/* 底部 */}
      <div className="el-login-footer">
        {defaultSettings.footerContent}
        <a href="https://www.xuxueli.com/xxl-boot/" target="_blank" rel="noreferrer" style={{ marginLeft: 5, textDecoration: 'underline' }}>
          xuxueli
        </a>
        <a href="https://github.com/xuxueli/xxl-boot" target="_blank" rel="noreferrer" style={{ marginLeft: 5, textDecoration: 'underline' }}>
          github
        </a>
      </div>
    </div>
  )
}
