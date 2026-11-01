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
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import defaultSettings from '@/default-settings';
import { t } from '@/i18n';
import { Footer } from '@/layouts/components';
import { getCodeImg } from '@/modules/framework/auth/api';
import { useSettingsStore } from '@/stores/settingsStore';
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
      // 白底 + 低对比柔光：左上淡蓝、右缘淡紫、右下淡青，中心留白承托登录表单
      background: [
        // 左上淡蓝：自左上角铺开，沿左侧向下淡出
        'radial-gradient(ellipse 90% 75% at 0% 8%, rgba(205, 226, 249, 0.95) 0%, rgba(205, 226, 249, 0.5) 42%, rgba(205, 226, 249, 0) 76%)',
        // 右缘淡紫：贴右边界纵向晕开，峰值落在右侧中部
        'radial-gradient(ellipse 55% 75% at 104% 45%, rgba(206, 206, 241, 0.9) 0%, rgba(206, 206, 241, 0.4) 45%, rgba(206, 206, 241, 0) 74%)',
        // 右下淡青：与淡紫自然衔接
        'radial-gradient(ellipse 65% 60% at 86% 104%, rgba(205, 235, 241, 0.9) 0%, rgba(205, 235, 241, 0.3) 45%, rgba(205, 235, 241, 0) 70%)',
        // 顶部极淡冷灰：右侧稍压灰，避免上方过白
        'linear-gradient(180deg, rgba(240, 243, 249, 0.8) 0%, rgba(240, 243, 249, 0) 20%)',
        '#ffffff',
      ].join(','),
      // 卡片内副标题上下留白收紧，贴近参考图紧凑布局
      '& .ant-pro-form-login-desc': {
        marginBlockStart: 8,
        marginBlockEnd: 24,
      },
      // 表单行间距收紧，贴近参考图紧凑排布
      '& .ant-form-item': {
        marginBottom: 16,
      },
    },
    subTitle: {
      fontSize: 18,
      color: '#3a3a3a',
      textAlign: 'center',
    },
    brand: {
      marginBottom: 16,
      fontSize: 30,
      fontWeight: 600,
      lineHeight: '40px',
      letterSpacing: '0.5px',
      color: '#4a4a4a',
      textAlign: 'center',
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
  const { styles, theme } = useStyles();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 验证码相关状态：开关（后端基础配置）、图片地址、唯一标识（提交登录时回传）
  const captchaEnabled = useSettingsStore((s) => s.captchaEnabled);
  const [codeUrl, setCodeUrl] = useState('');
  const [captchaUuid, setCaptchaUuid] = useState('');

  /** 获取验证码图片，根据后端开关控制显示 */
  const getCode = async () => {
    try {
      const res = await getCodeImg();
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
      message.success(t('auth.login.success'));

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
    document.title = t('app.title');
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
        {/* 品牌标题在卡片外，卡片内只放副标题与表单 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: 'translateY(-6%)',
          }}
        >
          <div className={styles.brand}>{defaultSettings.brandName}</div>
          <LoginForm
            contentStyle={{
              width: '100%',
              minWidth: 0,
              maxWidth: '100%',
            }}
            // 覆盖容器默认的 flex:1 / height:100%，使其按内容高度参与外层居中；
            // 同时为表单区域加白色卡片底色 + 圆角 + 柔和投影
            containerStyle={{
              flex: 'none',
              height: 'auto',
              boxSizing: 'border-box',
              width: 376,
              maxWidth: '92vw',
              padding: '24px 24px 28px',
              background: theme.colorBgContainer,
              borderRadius: 6,
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            }}
            subTitle={
              <div className={styles.subTitle}>{t('app.title')}</div>
            }
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
            placeholder={t('common.inputPlaceholder', [t('authz.user.username')])}
            rules={[
              {
                required: true,
                message: t('common.inputPlaceholder', [t('authz.user.username')]),
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder={t('common.inputPlaceholder', [t('authz.user.password')])}
            rules={[
              {
                required: true,
                message: t('common.inputPlaceholder', [t('authz.user.password')]),
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
                    alt={t('auth.login.captcha')}
                    className={styles.captcha}
                    src={codeUrl}
                    onClick={getCode}
                  />
                ),
              }}
              placeholder={t('common.inputPlaceholder', [t('auth.login.captcha')])}
              rules={[
                {
                  required: true,
                  message: t('common.inputPlaceholder', [t('auth.login.captcha')]),
                },
              ]}
            />
          )}
          <div style={{ marginBottom: 15 }}>
            <ProFormCheckbox name="rememberMe" noStyle>
              {t('auth.login.remember')}
            </ProFormCheckbox>
          </div>
          </LoginForm>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
