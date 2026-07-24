/**
 * useDict - 批量获取数据字典
 *
 * 优先从 Pinia dict store 缓存读取，未命中时调用后端接口并写入缓存。
 *
 * 用法：
 *   const { sys_user_sex, sys_normal_disable } = useDict('sys_user_sex', 'sys_normal_disable')
 */
import { ref, toRefs } from 'vue'
import { useDictStore } from '@/store'
import { getDicts } from '@/api/system/dict/data'

const dictStore = useDictStore()

/**
 * 批量获取字典数据
 * @param {...string} args - 字典类型名，如 'sys_user_sex', 'sys_normal_disable'
 * @returns {Object} 以字典类型名为 key、Ref<Array> 为 value 的对象
 */
export function useDict(...args) {
  // 存字典类型 → 字典项数组的映射
  const res = ref({})
  // IIFE 确保同步返回 ref 对象，异步数据在请求完成后填充
  return (() => {
    args.forEach(dictType => {
      // 初始化空数组占位，避免模板访问报错
      res.value[dictType] = []
      const dicts = dictStore.getDict(dictType)
      if (dicts) {
        // 缓存命中，直接赋值
        res.value[dictType] = dicts
      } else {
        // 缓存未命中，请求接口并写入缓存
        getDicts(dictType).then(resp => {
          // 后端字段 → 前端通用字段名
          res.value[dictType] = resp.data.map(p => ({
            label: p.dictLabel,
            value: p.dictValue,
            elTagType: p.listClass,
            elTagClass: p.cssClass
          }))
          // 写入 store 缓存，下次同类型请求直接命中
          dictStore.setDict(dictType, res.value[dictType])
        })
      }
    })
    // toRefs 将 res.value 每个属性转为独立 Ref，解构后保持响应性
    return toRefs(res.value)
  })()
}
