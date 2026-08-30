/**
 * useEnumOption - 后端枚举项加载 Hook（基于 TanStack Query 缓存）
 * 能力：从 /system/dict/loadEnumItem 加载枚举项，QueryClient 自动缓存去重。
 */
import { useQuery } from '@tanstack/react-query';
import { loadEnumItem } from '@/services/system/dict';

export interface EnumOption {
  code: number;
  title?: string;
}

/**
 * 加载后端枚举项（非 Hook 形式，供普通逻辑调用）
 * @param enumName 枚举类名，如 UserStatuEnum
 */
export function loadEnum(enumName: string): Promise<EnumOption[]> {
  /**
   *  API数据获取函数：
   *      - 职责‌：负责实际的 HTTP 请求或 API 调用。
   *      - 特点‌：
   *         - 非 Hook 形式‌：普通的异步函数，可以在任何地方调用。不依赖 React 生命周期。
   *         - 返回 Promise‌：返回一个 Promise，解析为枚举选项数组。
   */
  return loadEnumItem(enumName).then((res) => res.data || []);
}

/**
 * 获取枚举选项（Hook 形式，TanStack Query 缓存）
 * @param enumName 枚举类名
 * @returns 枚举选项列表
 */
export function useEnumOption(enumName: string): EnumOption[] {
  /**
   * useQuery 缓存机制：（React Hook 封装）
   *      - 1. queryKey 唯一标识枚举项，缓存去重。
   *      - 2. queryFn 调用 loadEnum 加载枚举项。
   *      - 3. staleTime 设置为 Infinity，表示数据永不过期，避免重复请求。
   */
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
