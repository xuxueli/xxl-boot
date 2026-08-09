/**
 * useEnumOption - 后端枚举项加载 Hook（基于 TanStack Query 缓存）
 * 能力：从 /system/dict/loadEnumItem 加载枚举项，QueryClient 自动缓存去重。
 */
import { useQuery } from '@tanstack/react-query';
import { loadEnumItem } from '@/services/xxl-boot/system/dict';

export interface EnumOption {
  code: number;
  title?: string;
}

/**
 * 加载后端枚举项（非 Hook 形式，供普通逻辑调用）
 * @param enumName 枚举类名，如 UserStatuEnum
 */
export function loadEnum(enumName: string): Promise<EnumOption[]> {
  return loadEnumItem(enumName).then((res) => res.data || []);
}

/**
 * 获取枚举选项（Hook 形式，TanStack Query 缓存）
 * @param enumName 枚举类名
 * @returns 枚举选项列表
 */
export function useEnumOption(enumName: string): EnumOption[] {
  const { data } = useQuery({
    queryKey: ['enum', enumName],
    queryFn: () => loadEnum(enumName),
    staleTime: Infinity,
  });
  return data || [];
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
