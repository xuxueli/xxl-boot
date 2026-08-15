/**
 * settingsStore - 全局设置状态（Zustand）
 * 功能：管理布局设置与设置面板开关（SettingDrawer）
 */
import { create } from 'zustand';
import type { ProLayoutProps } from '@ant-design/pro-components';
import defaultSettings from '@/defaultSettings';

interface SettingsState {
  /** 布局设置（默认来自 defaultSettings） */
  settings: ProLayoutProps;
  /** 设置面板开关 */
  settingDrawerOpen: boolean;
  /** 更新布局设置 */
  setSettings: (settings: ProLayoutProps) => void;
  /** 开关设置面板 */
  setSettingDrawerOpen: (open: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()((set) => ({
  settings: defaultSettings as ProLayoutProps,
  settingDrawerOpen: false,

  /** 与默认配置合并，避免外部传入的设置缺失 title/logo 时被整体覆盖 */
  setSettings: (settings) =>
    set({
      settings: { ...defaultSettings, ...settings },
    }),
  setSettingDrawerOpen: (settingDrawerOpen) => set({ settingDrawerOpen }),
}));
