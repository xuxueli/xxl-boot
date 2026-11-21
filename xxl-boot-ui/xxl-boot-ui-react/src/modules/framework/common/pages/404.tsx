/**
 * @fileoverview 404（未找到）
 * @description 提示用户页面不存在，提供返回首页入口
 * @author xuxueli 2026-11-21
 */
import { Button, Card, Result } from 'antd';
import { Link } from 'react-router-dom';
import { t } from '@/i18n';

const Exception404 = () => (
  <Card variant="borderless">
    <Result
      status="404"
      title="404"
      subTitle={t('error.notFound')}
      extra={
        <Link to="/">
          <Button type="primary">{t('error.backHome')}</Button>
        </Link>
      }
    />
  </Card>
);

export default Exception404;
