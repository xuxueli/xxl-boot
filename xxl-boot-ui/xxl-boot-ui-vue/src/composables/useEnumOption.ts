/**
 * useEnumOption - 批量加载枚举选项
 *
 * 封装 loadEnumItem 接口，为页面下拉/单选等选项提供响应式数据，
 * 避免各页面重复编写 "dictApi.loadEnum(...).then(res => options.value = res.data)"。
 *
 * 用法：
 *   1、const { MessageCategoryEnum: categoryOptions, MessageStatusEnum: statusOptions } =
 *     useEnumOption('MessageCategoryEnum', 'MessageStatusEnum')
 *   2、enumTitle(statusOptions, row.status)   // 编码 → 文案
 */
import { ref, unref, type Ref } from 'vue'
import { dictApi } from '@/modules/framework/system/dict/api'
import type { EnumOption } from '@/types'

/**
 * 批量加载枚举选项
 *
 * @param enumNames 枚举类名列表，如 'MessageCategoryEnum'
 * @returns 以枚举名为 key 的响应式选项对象，如 { MessageCategoryEnum: Ref<EnumOption[]> }
 */
export function useEnumOption(...enumNames: string[]): Record<string, Ref<EnumOption[]>> {
  const options: Record<string, Ref<EnumOption[]>> = {}
  enumNames.forEach((name) => {
    options[name] = ref<EnumOption[]>([])
    dictApi.loadEnum(name)
      .then((res) => {
        options[name].value = res.data
      })
      .catch(() => {
        // 错误已由请求层提示，枚举加载失败时保持空选项
      })
  })
  return options
}

/**
 * 按编码取枚举展示标题
 *
 * @param options 枚举选项，支持 ref 或数组（模板中 ref 会自动解包）
 * @param code 枚举编码；为空返回空串，未匹配时回退显示编码
 * @returns 枚举标题
 */
export function enumTitle(options: Ref<EnumOption[]> | EnumOption[], code?: number | string): string {
  const item = unref(options).find((option) => option.code === code)
  return item?.title ?? (code == null ? '' : String(code))
}
