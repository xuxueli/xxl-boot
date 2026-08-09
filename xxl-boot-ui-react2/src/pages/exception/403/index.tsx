import { Button, Card, Result } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const Exception403: React.FC = () => (
  <Card variant="borderless">
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您无权访问该页面。"
      extra={
        <Link to="/">
          <Button type="primary">返回首页</Button>
        </Link>
      }
    />
  </Card>
);

export default Exception403;
