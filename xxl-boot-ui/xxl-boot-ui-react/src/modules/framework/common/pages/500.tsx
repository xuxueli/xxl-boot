/**
 * 页面：500（服务器错误）
 * 功能：提示用户服务器异常，提供返回首页入口
 */
import { Button, Card, Result } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { t } from '@/i18n';

const Exception500 = () => (
  <Card variant="borderless">
    <Result
      status="500"
      title="500"
      subTitle={t('error.serverError')}
      extra={
        <Link to="/">
          <Button type="primary">{t('error.backHome')}</Button>
        </Link>
      }
    />
  </Card>
);

export default Exception500;
