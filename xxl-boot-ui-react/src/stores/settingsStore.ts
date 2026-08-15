/**
 * settingsStore - 全局设置状态（Zustand）
 * 功能：管理布局设置与设置面板开关（SettingDrawer），并支持设置持久化（localStorage）
 *    - 布局设置默认取自 default-settings.ts；通过 SettingDrawer 修改后实时生效，
 *    - 点击"保存设置"写入 localStorage，刷新后自动恢复；"重置设置"恢复默认并清除缓存；
 *    - 侧边栏折叠状态：点击折叠开关即时持久化，刷新后保持。
 */
import { create } from 'zustand';
import type { ProLayoutProps } from '@ant-design/pro-components';
import defaultSettings from '@/default-settings';

/** 主题设置持久化：localStorage 键名 */
const SETTINGS_KEY = 'boot-layout-setting';
/** 侧边栏折叠状态持久化：localStorage 键名 */
const COLLAPSED_KEY = 'boot-layout-collapsed';

/**
 * 读取持久化设置
 * @returns 优先返回 localStorage 中保存的设置（与默认配置浅合并）；无缓存或解析失败时返回默认配置
 */
const loadSettings = (): ProLayoutProps => {
  try {
    const cached = localStorage.getItem(SETTINGS_KEY);
    if (cached) {
      // 与默认配置浅合并，避免外部传入的设置缺 title/logo 时被整体覆盖
      return { ...defaultSettings, ...JSON.parse(cached) };
    }
  } catch {
    /* 缓存解析失败：忽略并回退默认配置 */
  }
  return defaultSettings as ProLayoutProps;
};

/**
 * 读取持久化折叠状态
 * @returns 优先返回 localStorage 保存的折叠状态；无缓存时返回默认展开
 */
const loadCollapsed = (): boolean => {
  return localStorage.getItem(COLLAPSED_KEY) === 'true';
};

/**
 * 设置状态结构
 */
interface SettingsState {
  /** 布局设置：默认来自 defaultSettings，可能被 localStorage 覆盖 */
  settings: ProLayoutProps;
  /** 设置面板开关：true 为展开 */
  settingDrawerOpen: boolean;
  /** 侧边栏折叠状态：true 为收起 */
  collapsed: boolean;
  /** 更新布局设置：与默认配置浅合并后覆盖 */
  setSettings: (settings: ProLayoutProps) => void;
  /** 开关设置面板 */
  setSettingDrawerOpen: (open: boolean) => void;
  /** 更新折叠状态：即时写入 localStorage */
  setCollapsed: (collapsed: boolean) => void;
  /** 保存设置：将当前设置持久化到 localStorage */
  saveSettings: () => void;
  /** 重置设置：恢复默认配置并清除 localStorage 缓存 */
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()((set, get) => ({

  /* 初始布局设置：优先取 localStorage 缓存，否则用默认配置 */
  settings: loadSettings(),
  /* 初始设置面板：关闭 */
  settingDrawerOpen: false,
  /* 初始折叠状态：优先取 localStorage 缓存，否则展开 */
  collapsed: loadCollapsed(),

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

  /** 保存设置：将当前设置序列化写入 localStorage */
  saveSettings: () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(get().settings));
  },

  /** 重置设置：清除 localStorage 缓存并恢复默认配置 */
  resetSettings: () => {
    localStorage.removeItem(SETTINGS_KEY);
    set({ settings: { ...defaultSettings } });
  },

  /** 更新折叠状态：即时持久化，无需点击"保存设置" */
  setCollapsed: (collapsed) => {
    localStorage.setItem(COLLAPSED_KEY, String(collapsed));
    set({ collapsed });
  }

}));
