/**
 * useEnumOption - 批量加载枚举选项
 *
 * 封装 loadEnumItem 接口，为页面下拉/单选等选项提供响应式数据，
 * 避免各页面重复编写 "loadEnumItem(...).then(res => options.value = res.data)"。
 *
 * 用法：
 *   const { MessageCategoryEnum: categoryOptions, MessageStatusEnum: statusOptions } =
 *     useEnumOption('MessageCategoryEnum', 'MessageStatusEnum')
 */
import { ref, type Ref } from 'vue'
import { loadEnumItem } from '@/api/system/dict/data'
import type { EnumOption } from '@/types'

/**
 * 批量加载枚举选项
 * @param enumNames 枚举类名列表，如 'MessageCategoryEnum'
 * @returns 以枚举名为 key 的响应式选项对象，如 { MessageCategoryEnum: Ref<EnumOption[]> }
 */
export function useEnumOption(...enumNames: string[]): Record<string, Ref<EnumOption[]>> {
  const options: Record<string, Ref<EnumOption[]>> = {}
  enumNames.forEach(name => {
    options[name] = ref<EnumOption[]>([])
    loadEnumItem(name).then(res => {
      options[name].value = res.data
    })
  })
  return options
}
