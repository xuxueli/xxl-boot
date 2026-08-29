/**
 * 页面：帮助中心
 * 功能：展示系统信息、版本、GitHub 与官方文档入口
 */
import { BookOutlined, GithubOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, Divider, Typography } from 'antd';
import React from 'react';
import defaultSettings from '@/default-settings';

const HelpCenter = () => {
  return (
    <PageContainer ghost title={false}>
      <ProCard>
        <Typography.Title level={4}>XXL-Boot 快速开发平台</Typography.Title>
        <Typography.Paragraph type="secondary">
          一个快速开发平台，易学易用、扩展丰富、开箱即用。内置安全登录、权限管控、
          端到端代码生成、响应式
          UI、国际化、分布式扩展等能力。整合前后端流行技术，
          致力为中小企业、个人开发者打造开箱即用的中后台解决方案。
        </Typography.Paragraph>
        <Divider />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button
            type="primary"
            icon={<GithubOutlined />}
            href="https://github.com/xuxueli/xxl-boot"
            target="_blank"
          >
            GitHub 仓库
          </Button>
          <Button
            icon={<BookOutlined />}
            href="https://www.xuxueli.com/xxl-boot/"
            target="_blank"
          >
            官方文档
          </Button>
          ｜
          <a
            href="https://github.com/xuxueli/xxl-boot"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              alt="GitHub stars"
              src="https://img.shields.io/github/stars/xuxueli/xxl-boot"
            />
          </a>
        </div>
        <Divider />
        <Typography.Paragraph type="secondary" style={{ textAlign: 'left' }}>
          Powered by <strong>{defaultSettings.brandName}</strong> v
          {defaultSettings.version}
        </Typography.Paragraph>
      </ProCard>
    </PageContainer>
  );
};

export default HelpCenter;
