/**
 * useEnumOption - 批量加载枚举选项
 *
 * 封装 loadEnumItem 接口，为页面下拉/单选等选项提供数据，
 * 避免各页面重复编写 "loadEnumItem(...).then(res => options = res.data)"。
 *
 * 用法：
 *   const { MessageCategoryEnum: categoryOptions, MessageStatusEnum: statusOptions } =
 *     useEnumOption('MessageCategoryEnum', 'MessageStatusEnum')
 */
import { useEffect, useState } from 'react'
import { loadEnumItem } from '@/api/system/dict/data'
import type { EnumOption } from '@/types'

/**
 * 批量加载枚举选项
 * @param enumNames 枚举类名列表，如 'MessageCategoryEnum'
 * @returns 以枚举名为 key 的选项对象，如 { MessageCategoryEnum: EnumOption[] }
 */
export function useEnumOption(...enumNames: string[]): Record<string, EnumOption[]> {
  const [options, setOptions] = useState<Record<string, EnumOption[]>>({})

  useEffect(() => {
    enumNames.forEach((name) => {
      setOptions((prev) => ({ ...prev, [name]: [] }))
      loadEnumItem(name).then((res) => {
        setOptions((prev) => ({ ...prev, [name]: res.data }))
      })
    })
     
  }, [])

  return options
}
