/**
 * 页面：帮助中心
 * 功能：展示系统信息、版本、GitHub 与官方文档入口
 */
import { BookOutlined, GithubOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, Divider, Typography } from 'antd';
import React from 'react';
import { t } from '@/i18n';
import defaultSettings from '@/default-settings';

const HelpCenter = () => {
  return (
    <PageContainer ghost title={false}>
      <ProCard>
        <Typography.Title level={4}>{t('help.title')}</Typography.Title>
        <Typography.Paragraph type="secondary">
          {t('help.intro')}
        </Typography.Paragraph>
        <Divider />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button
            type="primary"
            icon={<GithubOutlined />}
            href="https://github.com/xuxueli/xxl-boot"
            target="_blank"
          >
            {t('help.github')}
          </Button>
          <Button
            icon={<BookOutlined />}
            href="https://www.xuxueli.com/xxl-boot/"
            target="_blank"
          >
            {t('help.doc')}
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
