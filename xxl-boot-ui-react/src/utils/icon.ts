/**
 * 图标工具：将 antd 图标名称（如 TeamOutlined）映射为图标组件
 */
import * as Icons from '@ant-design/icons';
import type { ComponentType } from 'react';

/**
 * 根据图标名称获取 antd 图标组件
 * @param name 图标名称，如 HomeOutlined
 * @returns 图标组件；未命中返回 undefined
 */
export function getIconComponent(
  name?: string,
): ComponentType<{ style?: React.CSSProperties }> | undefined {
  if (!name) return undefined;
  const icon = (Icons as Record<string, unknown>)[name];
  return typeof icon === 'object' || typeof icon === 'function'
    ? (icon as ComponentType<{ style?: React.CSSProperties }>)
    : undefined;
}

/** 资源管理-图标选择：可选的 antd 图标清单 */
export const iconList: string[] = [
  'HomeOutlined',
  'DashboardOutlined',
  'TeamOutlined',
  'UserOutlined',
  'SafetyOutlined',
  'SettingOutlined',
  'ToolOutlined',
  'BookOutlined',
  'MessageOutlined',
  'NotificationOutlined',
  'FileTextOutlined',
  'DatabaseOutlined',
  'AppstoreOutlined',
  'MenuOutlined',
  'ProfileOutlined',
  'LockOutlined',
  'UnlockOutlined',
  'PlusOutlined',
  'EditOutlined',
  'DeleteOutlined',
  'SearchOutlined',
  'ReloadOutlined',
  'EyeOutlined',
  'EyeInvisibleOutlined',
  'DownloadOutlined',
  'UploadOutlined',
  'StarOutlined',
  'HeartOutlined',
  'FlagOutlined',
  'BellOutlined',
  'ExclamationCircleOutlined',
  'QuestionCircleOutlined',
  'InfoCircleOutlined',
  'CheckCircleOutlined',
  'CloseCircleOutlined',
  'CloudOutlined',
  'CodeOutlined',
  'FolderOutlined',
  'TagsOutlined',
  'BarChartOutlined',
  'LineChartOutlined',
  'PieChartOutlined',
  'TableOutlined',
  'CalendarOutlined',
  'ClockCircleOutlined',
];
