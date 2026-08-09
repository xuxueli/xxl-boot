import { LockOutlined, SafetyOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { App } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Footer } from '@/components';
import { getCodeImg } from '@/services/xxl-boot/login';
import { useUserStore } from '@/stores/userStore';

/**
 * 校验 redirect URL，防止开放重定向攻击
 */
const getSafeRedirectUrl = (redirect: string | null): string => {
  if (!redirect?.startsWith('/')) return '/';

  if (redirect.startsWith('//')) return '/';

  try {
    const parsed = new URL(redirect, window.location.origin);
    if (parsed.origin !== window.location.origin) return '/';
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return '/';
  }
};

const useStyles = createStyles(({ token }) => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
    captcha: {
      height: 32,
      cursor: 'pointer',
      borderRadius: token.borderRadiusSM,
    },
  };
});

const Login: React.FC = () => {
  const { styles } = useStyles();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useUserStore((s) => s.login);
  const fetchUserInfo = useUserStore((s) => s.fetchUserInfo);
  const fetchMenuData = useUserStore((s) => s.fetchMenuData);

  // 验证码相关状态
  const [captchaEnabled, setCaptchaEnabled] = useState(false);
  const [codeUrl, setCodeUrl] = useState('');
  const [captchaUuid, setCaptchaUuid] = useState('');

  /** 获取验证码图片，根据开关控制显示 */
  const getCode = async () => {
    try {
      const res = await getCodeImg();
      setCaptchaEnabled(res.data?.enable ?? false);
      setCodeUrl(res.data?.image || '');
      setCaptchaUuid(res.data?.uuid || '');
    } catch {
      // 验证码获取失败不阻塞登录
    }
  };

  /** 提交登录 */
  const handleSubmit = async (values: API.LoginParams) => {
    try {
      await login({
        ...values,
        captchaUuid,
      });
      message.success('登录成功！');
      await Promise.all([fetchUserInfo(), fetchMenuData()]);
      const redirectUrl = getSafeRedirectUrl(searchParams.get('redirect'));
      // 提示停留片刻后再跳转，避免成功提示被页面刷新吞掉
      await new Promise((resolve) => setTimeout(resolve, 800));
      navigate(redirectUrl);
    } catch {
      // 登录失败：刷新验证码
      if (captchaEnabled) {
        getCode();
      }
    }
  };

  // 初始化：获取验证码
  useEffect(() => {
    getCode();
    document.title = '登录页 - XXL-BOOT';
  }, []);

  return (
    <div className={styles.container}>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.png" />}
          title="XXL-BOOT"
          subTitle="快速开发平台"
          initialValues={{
            rememberMe: false,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder="请输入账号"
            rules={[
              {
                required: true,
                message: '请输入您的账号',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder="请输入密码"
            rules={[
              {
                required: true,
                message: '请输入您的密码',
              },
            ]}
          />
          {captchaEnabled && (
            <ProFormText
              name="captchaResult"
              fieldProps={{
                size: 'large',
                prefix: <SafetyOutlined />,
                suffix: (
                  <img
                    alt="验证码"
                    className={styles.captcha}
                    src={codeUrl}
                    onClick={getCode}
                  />
                ),
              }}
              placeholder="请输入验证码"
              rules={[
                {
                  required: true,
                  message: '请输入验证码',
                },
              ]}
            />
          )}
          <div style={{ marginBottom: 15 }}>
            <ProFormCheckbox name="rememberMe" noStyle>
              记住密码
            </ProFormCheckbox>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
