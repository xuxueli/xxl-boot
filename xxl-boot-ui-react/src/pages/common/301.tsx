/**
 * 页面：301（无权限）
 * 功能：提示用户无访问权限，提供返回上一页或回首页入口
 */
import { Button, Card, Result } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Exception301: React.FC = () => {
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
        subTitle="对不起，您没有访问权限，请不要进行非法操作！您可以返回主页面"
        extra={[
          <Button key="back" onClick={back}>
            返回上一页
          </Button>,
          <Link key="home" to="/">
            <Button type="primary">回首页</Button>
          </Link>,
        ]}
      />
    </Card>
  );
};

export default Exception301;
