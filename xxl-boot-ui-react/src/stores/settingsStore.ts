/**
 * settingsStore - 全局设置状态（Zustand）
 * 功能：管理布局设置与设置面板开关（SettingDrawer）
 * 说明：布局设置默认取自 default-settings.ts；通过 SettingDrawer 修改后持久化到本 store，
 *       AppLayout 消费后实时生效。
 */
import { create } from 'zustand';
import type { ProLayoutProps } from '@ant-design/pro-components';
import defaultSettings from '@/default-settings';

/**
 * 设置状态结构
 */
interface SettingsState {
  /** 布局设置：默认来自 defaultSettings */
  settings: ProLayoutProps;
  /** 布局设置更新：与默认配置浅合并后覆盖 */
  setSettings: (settings: ProLayoutProps) => void;
  /** 面板开关：true 为展开 */
  settingDrawerOpen: boolean;
  /** 面板开关设置 */
  setSettingDrawerOpen: (open: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()((set) => ({
  /* 初始布局设置：默认配置 */
  settings: defaultSettings as ProLayoutProps,
  /* 初始设置面板：关闭 */
  settingDrawerOpen: false,

  /**
   * 更新布局设置
   * 说明：与默认配置浅合并，避免外部传入的设置缺 title/logo 时被整体覆盖
   */
  setSettings: (settings) =>
    set({
      settings: { ...defaultSettings, ...settings },
    }),

  /** 开关设置面板 */
  setSettingDrawerOpen: (settingDrawerOpen) => set({ settingDrawerOpen }),
}));
