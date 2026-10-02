/**
 * 布局组件：LayoutSettingDrawer（主题设置面板）
 * 功能：可视化调整布局/主题，设置变更实时写入 settingsStore；底部为自定义"保存/重置"操作区
 */
import type { SettingDrawerProps } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import { App, Button } from 'antd';
import React from 'react';
import { useSettingsStore } from '@/stores/settingsStore';
import { t } from '@/i18n';

/**
 * 设置面板组件：SettingDrawer 封装
 */
const LayoutSettingDrawer = () => {
  const { message } = App.useApp();
  /* 设置面板开关：控制显隐 */
  const settingDrawerOpen = useSettingsStore((s) => s.settingDrawerOpen);
  /* 布局设置：传入面板回显当前配置 */
  const settings = useSettingsStore((s) => s.settings);

  return (
    <SettingDrawer
      disableUrlParams
      enableDarkTheme
      collapse={settingDrawerOpen}
      // 开关设置面板
      onCollapseChange={(open) =>
        useSettingsStore.getState().setSettingDrawerOpen(open)
      }
      settings={settings as SettingDrawerProps['settings']}
      // 设置变更：实时写入 store
      onSettingChange={(s) => useSettingsStore.getState().setSettings(s)}
      // 隐藏内置"复制设置"按钮与"生产环境提示"，由底部自定义保存/重置按钮接管
      hideCopyButton
      hideHintAlert
      // 自定义底部操作区：保存设置 / 重置设置（恢复默认）
      drawerProps={{
        footer: (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              type="primary"
              block
              onClick={() => {
                useSettingsStore.getState().saveSettings();
                message.success(t('layout.settingSaved'));
              }}
            >
              {t('layout.saveSetting')}
            </Button>
            <Button
              block
              onClick={() => {
                useSettingsStore.getState().resetSettings();
                message.success(t('layout.settingReset'));
              }}
            >
              {t('layout.resetSetting')}
            </Button>
          </div>
        ),
      }}
    />
  );
};

export default LayoutSettingDrawer;
