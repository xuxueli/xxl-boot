/**
 * 组件：ThemeColorPicker（主题色选择器）
 * 功能：在 SettingDrawer 的「主题色」标签行内注入颜色选择器触发器，点击弹出自定义选色面板
 *    - 面板布局：顶部取色区 → 8 个流行色按钮 → hex 输入框 + 确认按钮；确认后应用并关闭
 *    - SettingDrawer 为第三方组件无插槽，采用 portal 注入到主题色区块内，由全局 CSS 将该区块变为「标签 + 选择器」水平一行的布局
 */
import { Button, ColorPicker, Input } from 'antd';
import { createGlobalStyle, createStyles } from 'antd-style';
import { clsx } from 'clsx';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { t } from '@/i18n';
import { useSettingsStore } from '@/stores/settingsStore';

/**
 * 全局样式：覆盖 SettingDrawer / antd ColorPicker 内部 DOM（portal 渲染，需全局注入）
 *  - 隐藏 SettingDrawer 内置的 8 色板
 *  - 主题色区块改为「标签 + 选择器」水平一行
 *  - 隐藏 antd ColorPicker 内置的格式/色值/透明度输入行与模式切换条
 */
const GlobalOverride = createGlobalStyle`
  .ant-pro-setting-drawer-theme-color {
    display: none;
  }

  .ant-pro-setting-drawer-drawer-content > div:has(.ant-pro-setting-drawer-theme-color) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .ant-color-picker-operation,
  .ant-color-picker-input-container {
    display: none !important;
  }
`;

/** 流行色板：Tailwind 500 级色板中精选，现代管理后台常用的 8 个主色 */
const trendyColors = [
  '#1677ff' /* 拂晓蓝 */,
  '#0ea5e9' /* 天蓝 */,
  '#14b8a6' /* 青 */,
  '#22c55e' /* 绿 */,
  '#eab308' /* 黄 */,
  '#f97316' /* 橙 */,
  '#ef4444' /* 红 */,
  '#8b5cf6' /* 紫 */,
];

/** 自定义选色面板样式 */
const useStyles = createStyles(({ token, css }) => ({
  trigger: css`
    width: 24px;
    height: 24px;
    border-radius: 4px;
    cursor: pointer;
    box-shadow:
      inset 0 0 0 1px rgba(0, 0, 0, 0.08),
      0 0 0 1px rgba(0, 0, 0, 0.04);
  `,
  panel: css`
    width: 240px;
  `,
  swatches: css`
    display: flex;
    gap: 6px;
    padding: 10px 12px 6px;
  `,
  swatch: css`
    width: 20px;
    height: 20px;
    border-radius: 6px;
    cursor: pointer;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);

    &:hover {
      transform: scale(1.12);
    }

    &.active {
      box-shadow:
        0 0 0 2px ${token.colorBgElevated},
        0 0 0 4px ${token.colorPrimary};
    }
  `,
  confirmRow: css`
    display: flex;
    gap: 8px;
    padding: 8px 12px 12px;
  `,
}));

/** 校验并归一化 hex 文本：合法返回 #rrggbb，否则返回 null */
const normalizeHex = (text: string): string | null => {
  const trimmed = text.trim().replace(/^#/, '');
  return /^[0-9a-fA-F]{6}$/.test(trimmed) ? `#${trimmed.toLowerCase()}` : null;
};

/**
 * 主题色选择器组件：仅当设置抽屉展开且主题色区块存在时渲染
 */
const ThemeColorPicker = () => {
  const { styles } = useStyles();
  const settingDrawerOpen = useSettingsStore((s) => s.settingDrawerOpen);
  const colorPrimary =
    useSettingsStore((s) => s.settings.colorPrimary) ?? '#1677ff';
  /* 主题色区块元素：触发器注入点 */
  const [sectionEl, setSectionEl] = useState<HTMLElement | null>(null);
  /* 选择器实例版本：确认后自增，通过重挂载关闭弹框 */
  const [pickVersion, setPickVersion] = useState(0);
  /* 待确认颜色（面板内编辑，确认后才写入设置） */
  const [pendingColor, setPendingColor] = useState(colorPrimary);
  /* hex 输入框文本（不含 #） */
  const [hexText, setHexText] = useState(colorPrimary.replace('#', ''));

  /* 抽屉展开后定位到「主题色」区块；抽屉关闭时清空 */
  useEffect(() => {
    if (!settingDrawerOpen) {
      setSectionEl(null);
      return;
    }
    /* 抽屉在 portal 中渲染，需等待其挂载完成后再测量 */
    const timer = setTimeout(() => {
      const title = Array.from(
        document.querySelectorAll('.ant-pro-setting-drawer-body-title'),
      ).find((h) => /主题色/.test(h.textContent || ''));
      if (title?.parentElement) {
        setSectionEl(title.parentElement as HTMLElement);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [settingDrawerOpen]);

  /* 抽屉重新展开时，以当前主题色初始化面板草稿 */
  useEffect(() => {
    if (settingDrawerOpen) {
      setPendingColor(colorPrimary);
      setHexText(colorPrimary.replace('#', ''));
    }
  }, [settingDrawerOpen, colorPrimary]);

  /* 颜色选择变化（取色区/流行色）时，同步 hex 输入框展示最新色值 */
  useEffect(() => {
    setHexText(pendingColor.replace('#', ''));
  }, [pendingColor]);

  /**
   * hex 输入变化：更新输入框文本；输入合法 6 位 hex 时同步待选颜色
   */
  const handleHexChange = (text: string) => {
    setHexText(text);
    const normalized = normalizeHex(text);
    if (normalized) setPendingColor(normalized);
  };

  /**
   * 确认选色：写入设置并关闭弹框
   */
  const handleConfirm = () => {
    const normalized = normalizeHex(hexText);
    const finalColor = normalized || pendingColor;
    useSettingsStore.getState().setSettings({ colorPrimary: finalColor });
    setPickVersion((v) => v + 1);
  };

  /* 抽屉未展开或未定位到主题色区块时不渲染选择器 */
  return (
    <>
      {/* 全局样式：始终注入，覆盖库内部 DOM */}
      <GlobalOverride />
      {settingDrawerOpen &&
        sectionEl &&
        createPortal(
          <ColorPicker
            key={pickVersion}
            size="small"
            value={pendingColor}
            onChange={(color) => setPendingColor(color.toHexString())}
            panelRender={(_, { components: { Picker } }) => (
              <div className={styles.panel}>
                {/* 顶部颜色选择区域 */}
                <Picker />
                {/* 流行色：8 个色块，点击选中 */}
                <div className={styles.swatches}>
                  {trendyColors.map((color) => (
                    <div
                      key={color}
                      className={clsx(
                        styles.swatch,
                        color === pendingColor && 'active',
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => setPendingColor(color)}
                    />
                  ))}
                </div>
                {/* 色值输入 + 确认按钮 */}
                <div className={styles.confirmRow}>
                  <Input
                    size="small"
                    prefix="#"
                    value={hexText}
                    onChange={(e) => handleHexChange(e.target.value)}
                  />
                  <Button size="small" onClick={handleConfirm}>
                    {t('modal.confirmButton')}
                  </Button>
                </div>
              </div>
            )}
          >
            {/* 自定义触发器：展示已提交的主题色，不随面板选色变化 */}
            <div
              className={styles.trigger}
              style={{ backgroundColor: colorPrimary }}
            />
          </ColorPicker>,
          sectionEl,
        )}
    </>
  );
};

export default ThemeColorPicker;
