/**
 * 名称：数据字典缓存 Store
 * 描述：负责维护前端运行期的数据字典缓存，统一提供"读取、写入、删除、清空"能力。
 */
import { create } from 'zustand'
import type { DictTagOption } from '@/types'

/** 字典缓存项 */
interface DictCacheItem {
  /** 字典标识 */
  key: string
  /** 字典内容 */
  value: DictTagOption[]
}

interface DictState {
  /** 字典缓存数组（不是 Map，保持与现有调用方式完全兼容） */
  dict: DictCacheItem[]
  /** 获取字典：针对 key 合法性校验 */
  getDict: (key: string) => DictTagOption[] | null
  /** 设置字典：仅在 key 有效时写入缓存 */
  setDict: (key: string, value: DictTagOption[]) => void
  /** 删除字典：按 key 定位后直接移除首个匹配项 */
  removeDict: (key: string) => boolean
  /** 清空字典 */
  cleanDict: () => void
  /** 初始字典：预留初始化入口 */
  initDict: () => void
}

export const useDictStore = create<DictState>((set, get) => ({
  dict: [],

  /**
   * 获取字典：针对 key 合法性校验
   */
  getDict(key: string) {
    if (key === null || key === '') {
      return null
    }
    try {
      for (let i = 0; i < get().dict.length; i++) {
        if (get().dict[i].key === key) {
          return get().dict[i].value
        }
      }
    } catch (e) {
      return null
    }
    return null
  },

  /**
   * 设置字典：仅在 key 有效时写入缓存，保持缓存项结构统一。
   */
  setDict(key: string, value: DictTagOption[]) {
    if (key !== null && key !== '') {
      set({ dict: [...get().dict, { key, value }] })
    }
  },

  /**
   * 删除字典：按 key 定位后直接移除首个匹配项，并返回是否删除成功。
   */
  removeDict(key: string) {
    let bln = false
    try {
      const index = get().dict.findIndex((item) => item.key === key)
      if (index > -1) {
        const dict = [...get().dict]
        dict.splice(index, 1)
        set({ dict })
        return true
      }
    } catch (e) {
      bln = false
    }
    return bln
  },

  /**
   * 清空字典：通过重新赋值新数组的方式清空全部缓存项。
   */
  cleanDict() {
    set({ dict: [] })
  },

  /**
   * 初始字典：预留初始化入口，当前版本暂无默认初始化逻辑。
   */
  initDict() {}
}))
