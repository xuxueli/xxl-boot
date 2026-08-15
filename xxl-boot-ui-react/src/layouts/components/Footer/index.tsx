/**
 * 布局组件：Footer（页脚）
 * 功能：展示版权与 GitHub 链接
 */
import { GithubOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import React from 'react';

/** 页脚与链接样式 */
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
    margin-left: 8px;
    text-decoration: underline;

    &:hover {
      color: ${token.colorText};
    }
  `,
  nameLink: css`
    color: ${token.colorTextDescription};
    margin-left: 5px;
    text-decoration: underline;

    &:hover {
      color: ${token.colorText};
    }
  `,
}));

/**
 * 页脚组件：版权信息 + 项目 GitHub 链接
 */
const Footer = () => {
  const { styles } = useStyles();
  const year = new Date().getFullYear(); /* 动态获取当前年份，版权区间自动截止到本年 */

  return (
    <div className={styles.footer}>
      <span>
        Copyright © 2015-{year}
        {/* 项目官网链接 */}
        <a
          className={styles.nameLink}
          href="https://www.xuxueli.com/xxl-boot/"
          target="_blank"
          rel="noopener noreferrer"
        >
          xuxueli
        </a>
      </span>
      {/* GitHub 仓库链接 */}
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
