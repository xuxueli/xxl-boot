/**
 * 页面：Login（登录）
 * 功能：账号密码登录（支持记住密码、验证码），登录成功后拉取用户信息与菜单并跳转目标页
 */
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
import defaultSettings from '@/default-settings';
import { Footer } from '@/layouts/components';
import { getCodeImg } from '@/services/login';
import { useUserStore } from '@/stores/userStore';
import { getToken } from '@/utils/auth';

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

/**
 * 页面样式
 */
const useStyles = createStyles(({ token }) => {
  return {
    container: {
      position: 'relative',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      // 浅色渐变底色：白 → 淡蓝灰 → 淡紫灰，斜向与光带走向呼应
      background: 'linear-gradient(155deg, #ffffff 0%, #f2f4fb 55%, #e7ecf8 100%)',
      // 光带：从顶部中间（50%,0）起沿斜向延伸，穿过右侧中间（100%,50%）
      '&::before': {
        content: '""',
        position: 'absolute',
        left: '50%',
        top: 0,
        width: 3200,
        height: 150,
        transformOrigin: '0 0',
        // 16:9 视口下「顶中→右中」方向约 30°，其余比例略有偏差，被 overflow 裁切
        transform: 'rotate(30deg)',
        pointerEvents: 'none',
        // 光带颜色由「淡蓝 → 青 → 蓝紫 → 淡紫」渐进，整体偏浅、柔和
        background:
          'linear-gradient(90deg, transparent 44%, rgba(101, 166, 246, 0.12) 50%, rgba(94, 179, 244, 0.22) 55%, rgba(128, 138, 244, 0.15) 60%, rgba(144, 116, 232, 0.06) 65%, transparent 70%)',
      },
    },
    subTitle: {
      fontSize: 16,
    },
    captcha: {
      height: 32,
      cursor: 'pointer',
      borderRadius: token.borderRadiusSM,
    },
  };
});

/**
 * 登录页组件
 */
const Login = () => {
  const { styles } = useStyles();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 验证码相关状态：开关、图片地址、唯一标识（提交登录时回传）
  const [captchaEnabled, setCaptchaEnabled] = useState(false);
  const [codeUrl, setCodeUrl] = useState('');
  const [captchaUuid, setCaptchaUuid] = useState('');

  /** 获取验证码图片，根据后端开关控制显示 */
  const getCode = async () => {
    try {
      const res = await getCodeImg();
      setCaptchaEnabled(res.data?.enable ?? false);
      setCodeUrl(res.data?.image || '');
      setCaptchaUuid(res.data?.uuid || '');
    } catch (error) {
      // 验证码获取失败不阻塞登录
      console.error('getCodeImg failed', error);
    }
  };

  /** 提交登录：校验通过后拉取用户信息与菜单，再跳转目标页 */
  const handleSubmit = async (values: API.LoginParams) => {
    // 事件回调中直接调用 store action，避免为单次调用挂载 store 订阅
    const userStore = useUserStore.getState();
    try {

      // 登录请求
      await userStore.login({
        ...values,
        captchaUuid,
      });
      message.success('登录成功！');

      // 登录成功：拉取用户信息与菜单数据
      await Promise.all([userStore.fetchUserInfo(), userStore.fetchMenuData()]);

      // 登录成功：跳转目标页，优先使用 redirect 参数，其次使用默认首页
      const redirectUrl = getSafeRedirectUrl(searchParams.get('redirect'));
      // 停留片刻后再跳转：避免成功提示被页面刷新吞掉
      await new Promise((resolve) => setTimeout(resolve, 200));
      // 跳转目标页
      navigate(redirectUrl);
    } catch {
      // 登录失败：刷新验证码
      if (captchaEnabled) {
        getCode();
      }
    }
  };

  // 初始化：获取验证码、设置页面标题；已登录进入登录页时直接跳转（对齐 Vue 已登录访问登录页 → 首页/redirect）
  useEffect(() => {
    getCode();
    document.title = defaultSettings.title as string;
    if (getToken() && useUserStore.getState().currentUser) {
      navigate(
        getSafeRedirectUrl(searchParams.get('redirect')) ||
          (defaultSettings.homePath ?? '/dashboard'),
      );
    }
  }, []);

  return (
    <div className={styles.container}>
      <div
        style={{
          flex: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          // 覆盖容器默认的 flex:1 / height:100%，使其按内容高度参与外层居中；
          // 居中后整体上移一屏高度的 15%，实现「居中稍微靠上」
          containerStyle={{
            flex: 'none',
            height: 'auto',
            transform: 'translateY(-15%)',
          }}
          title={defaultSettings.brandName}
          subTitle={<div className={styles.subTitle}>{defaultSettings.title}</div>}
          initialValues={{
            rememberMe: false,
          }}
          onFinish={handleSubmit}
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
