/**
 * 页面：301（无权限）
 * 功能：提示用户无访问权限，提供返回上一页或回首页入口
 */
import { Button, Card, Result } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { t } from '@/i18n';

const Exception301 = () => {
  const navigate = useNavigate();

  /** 返回上一页或首页 */
  const back = () => {
    if (navigate(-1)) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <Card variant="borderless">
      <Result
        status="403"
        title="301"
        subTitle={t('error.unauthorized')}
        extra={[
          <Button key="back" onClick={back}>
            {t('error.backPrev')}
          </Button>,
          <Link key="home" to="/">
            <Button type="primary">{t('error.backHome')}</Button>
          </Link>,
        ]}
      />
    </Card>
  );
};

export default Exception301;
