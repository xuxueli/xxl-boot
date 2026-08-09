/**
 * 组件：Footer（页脚）
 * 功能：展示版权与 GitHub 链接
 */
import { GithubOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import React from 'react';

const useStyles = createStyles(({ token, css }) => ({
  footer: css`
    padding: 16px 24px;
    text-align: center;
    color: ${token.colorTextDescription};
    font-size: ${token.fontSizeSM}px;
    line-height: ${token.lineHeight};
    background: transparent;
  `,
  link: css`
    color: ${token.colorTextDescription};
    text-decoration: none;
    margin-left: 8px;

    &:hover {
      color: ${token.colorText};
    }
  `,
}));

const Footer: React.FC = () => {
  const { styles } = useStyles();
  const year = new Date().getFullYear();

  return (
    <div className={styles.footer}>
      <span>Copyright © 2015-{year} xuxueli</span>
      <a
        className={styles.link}
        href="https://github.com/xuxueli/xxl-boot"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GithubOutlined /> GitHub
      </a>
    </div>
  );
};

export default Footer;
