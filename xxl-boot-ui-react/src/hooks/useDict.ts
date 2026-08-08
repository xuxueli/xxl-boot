/**
 * useDict - 批量获取数据字典
 *
 * 优先从 dict store 缓存读取，未命中时调用后端接口并写入缓存。
 *
 * 用法：
 *   const { sys_user_sex, sys_normal_disable } = useDict('sys_user_sex', 'sys_normal_disable')
 */
import { useEffect, useState } from 'react'
import { useDictStore } from '@/stores'
import { loadDictItem } from '@/api/system/dict/data'
import type { DictTagOption } from '@/types'

/**
 * 批量获取字典数据
 * @param args - 字典类型名，如 'sys_user_sex', 'sys_normal_disable'
 * @returns 以字典类型名为 key、DictTagOption[] 为 value 的对象
 */
export function useDict(...args: string[]): Record<string, DictTagOption[]> {
  const dictStore = useDictStore()
  // 存字典类型 → 字典项数组的映射
  const [res, setRes] = useState<Record<string, DictTagOption[]>>({})

  useEffect(() => {
    args.forEach((dictType) => {
      // 初始化空数组占位，避免访问报错
      setRes((prev) => ({ ...prev, [dictType]: [] }))
      const dicts = dictStore.getDict(dictType)
      if (dicts) {
        // 缓存命中，直接赋值
        setRes((prev) => ({ ...prev, [dictType]: dicts }))
      } else {
        // 缓存未命中，请求接口并写入缓存
        loadDictItem(dictType).then((resp) => {
          // 后端字段 → 前端通用字段名
          const items = resp.data.map((p) => ({
            label: p.name,
            value: p.code,
            elTagType: undefined, // p.listClass,
            elTagClass: undefined // p.cssClass
          }))
          // 写入 store 缓存，下次同类型请求直接命中
          dictStore.setDict(dictType, items)
          setRes((prev) => ({ ...prev, [dictType]: items }))
        })
      }
    })
     
  }, [])

  return res
}
