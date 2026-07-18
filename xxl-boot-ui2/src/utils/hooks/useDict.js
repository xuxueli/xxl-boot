/**
 * 字典数据工具模块（dict.js）
 *
 * 职责：
 *   - 提供 Vue 组合式 API 风格的 useDict() 钩子，用于在组件中便捷地获取数据字典。
 *   - 优先从 Pinia dict store 的内存缓存中读取，命中则直接返回，避免重复请求。
 *   - 缓存未命中时，调用后端字典数据接口，响应后同步写入缓存并更新响应式数据。
 *   - 支持一次传入多个字典类型（可变参数），批量初始化字典数据。
 *
 * 依赖：
 *   - @/store/modules/dict   Pinia 字典缓存 store（getDict / setDict）
 *   - @/api/sys/dict/data    字典数据查询接口（getDicts）
 *
 * 典型用法：
 *   import { useDict } from '@/utils/hooks/useDict'
 *   const { sys_user_sex, sys_normal_disable } = useDict('sys_user_sex', 'sys_normal_disable')
 *   // 在模板中直接使用 sys_user_sex 作为 el-select 选项数据源
 */
import { useDictStore } from '@/store'
import { getDicts } from '@/api/sys/dict/data'

/**
 * 批量获取字典数据（组合式 API 钩子）
 *
 * 接收任意数量的字典类型名称，对每个类型：
 *   1. 先尝试从 dict store 内存缓存读取，命中则直接填充响应式数据。
 *   2. 未命中时发起后端请求，成功后规范化字段名（label/value/elTagType/elTagClass），
 *      并写入 store 缓存以供后续复用。
 * 最终返回以字典类型名为键的响应式引用对象，支持解构使用。
 *
 * @param {...string} args - 字典类型名称列表（如 'sys_user_sex', 'sys_normal_disable'）
 * @returns {Object} 以字典类型名为键、字典项数组（Ref<Array>）为值的对象
 */
export function useDict(...args) {
  const res = ref({})
  return (() => {
    args.forEach((dictType, index) => {
      // 初始化该字典类型对应的响应式数组（空数组占位，避免模板访问报错）
      res.value[dictType] = []
      // 优先读取 store 缓存
      const dicts = useDictStore().getDict(dictType)
      if (dicts) {
        // 缓存命中，直接赋值
        res.value[dictType] = dicts
      } else {
        // 缓存未命中，发起接口请求
        getDicts(dictType).then(resp => {
          // 规范化字段：将后端字段映射为前端通用字段名，适配 el-select / el-tag 等组件
          res.value[dictType] = resp.data.map(p => ({ label: p.dictLabel, value: p.dictValue, elTagType: p.listClass, elTagClass: p.cssClass }))
          // 写入 store 缓存，下次同类型请求直接命中
          useDictStore().setDict(dictType, res.value[dictType])
        })
      }
    })
    // toRefs 将 res.value 中每个属性转换为独立的 Ref，支持解构后仍保持响应性
    return toRefs(res.value)
  })()
}