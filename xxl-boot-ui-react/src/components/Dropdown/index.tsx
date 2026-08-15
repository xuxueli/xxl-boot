/**
 * 组件：Dropdown（下拉容器）
 * 功能：封装 antd Dropdown，统一顶部导航栏下拉菜单的样式与交互
 *
 * 说明：
 *   - 组件名与 antd 的 Dropdown 同名，内部以 AntdDropdown 别名引入 antd 组件，JSX 中 <AntdDropdown> 指向 antd 组件；
 *   - 通过 classNames.root 注入统一下拉样式，外部可传 overlayClassName 追加自定义类名；
 *   - 移除了 antd 已废弃的 overlay 属性（对应新版 dropdownRender / menu），避免误用。
 *
 * @author xuxueli 2026-08-15
 */
import { Dropdown as AntdDropdown } from 'antd';
import type { DropDownProps } from 'antd/es/dropdown';
import { createStyles } from 'antd-style';
import { clsx } from 'clsx';
import React from 'react';

/**
 * 统一下拉样式
 * 能力：小屏适配（下拉宽度撑满）与菜单图标垂直对齐
 */
const useStyles = createStyles(({ token }) => {
  return {
    dropdown: {
      // 小屏（≤ antd 断点 screenXS）：下拉容器宽度撑满，避免溢出屏幕
      [`@media screen and (max-width: ${token.screenXS}px)`]: {
        width: '100%',
      },
      // 菜单项图标（普通项与二级菜单标题）：inline-flex 保证图标与文字垂直居中
      '.ant-dropdown-menu-item .anticon, .ant-dropdown-menu-submenu-title .anticon':
        {
          display: 'inline-flex',
          alignItems: 'center',
        },
      // 二级菜单标题图标：使用弱化色，与普通菜单项图标视觉区分
      '.ant-dropdown-menu-submenu-title .anticon': {
        color: token.colorTextSecondary,
      },
    },
  };
});

/**
 * 组件 Props
 * - overlayClassName：追加到下拉根容器的自定义类名（与内置样式合并）
 * - placement：下拉弹出方向；其余属性透传 antd Dropdown
 */
export type DropdownProps = {
  overlayClassName?: string;
  placement?:
    | 'bottomLeft'
    | 'bottomRight'
    | 'topLeft'
    | 'topCenter'
    | 'topRight'
    | 'bottomCenter';
} & Omit<DropDownProps, 'overlay'>;

/**
 * 下拉容器组件
 * @param props 组件入参（含 overlayClassName 与透传的 antd Dropdown 属性）
 * @returns antd Dropdown 实例（注入统一样式）
 */
const Dropdown = ({
  overlayClassName: cls,
  ...restProps
}: DropdownProps) => {
  const { styles } = useStyles();
  return (
    <AntdDropdown
      // 合并内置统一样式与外部追加类名，作为根容器 class
      classNames={{
        root: clsx(styles.dropdown, cls),
      }}
      // 透传其余属性（menu / dropdownRender / trigger / placement 等）
      {...restProps}
    />
  );
};

export default Dropdown;
