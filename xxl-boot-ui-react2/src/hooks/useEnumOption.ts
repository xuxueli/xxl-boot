/**
 * useEnumOption - 后端枚举项加载 Hook
 * 能力：从 /system/dict/loadEnumItem 加载枚举项，带模块级缓存，避免重复请求。
 */
import { useEffect, useState } from 'react';
import { loadEnumItem } from '@/services/xxl-boot/system/dict';

export interface EnumOption {
  code: number;
  title?: string;
}

/** 模块级缓存：枚举名 → Promise<选项> */
const enumCache = new Map<string, Promise<EnumOption[]>>();

/**
 * 加载后端枚举项
 * @param enumName 枚举类名，如 UserStatuEnum
 * @returns 枚举选项列表（code/title）
 */
export function loadEnum(enumName: string): Promise<EnumOption[]> {
  const cached = enumCache.get(enumName);
  if (cached) {
    return cached;
  }
  const promise = loadEnumItem(enumName).then((res) => res.data || []);
  enumCache.set(enumName, promise);
  return promise;
}

/**
 * 获取枚举选项（Hook 形式）
 * @param enumName 枚举类名
 * @returns 枚举选项列表
 */
export function useEnumOption(enumName: string): EnumOption[] {
  const [options, setOptions] = useState<EnumOption[]>([]);
  useEffect(() => {
    let mounted = true;
    loadEnum(enumName).then((data) => {
      if (mounted) setOptions(data);
    });
    return () => {
      mounted = false;
    };
  }, [enumName]);
  return options;
}

/**
 * 将枚举选项转为 ProTable valueEnum 结构
 * @param options 枚举选项
 */
export function toValueEnum(
  options: EnumOption[],
): Record<number, { text: string }> {
  const valueEnum: Record<number, { text: string }> = {};
  options.forEach((o) => {
    valueEnum[o.code] = { text: o.title || '' };
  });
  return valueEnum;
}

/**
 * 将枚举选项转为 antd Select 选项
 * @param options 枚举选项
 */
export function toSelectOptions(
  options: EnumOption[],
): { value: number; label: string }[] {
  return options.map((o) => ({ value: o.code, label: o.title || '' }));
}
