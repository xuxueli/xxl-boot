/**
 * 页面：404（未找到）
 * 功能：提示用户页面不存在，提供返回首页入口
 */
import { Button, Card, Result } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const Exception404: React.FC = () => (
  <Card variant="borderless">
    <Result
      status="404"
      title="404"
      subTitle="抱歉，您访问的页面不存在。"
      extra={
        <Link to="/">
          <Button type="primary">返回首页</Button>
        </Link>
      }
    />
  </Card>
);

export default Exception404;
