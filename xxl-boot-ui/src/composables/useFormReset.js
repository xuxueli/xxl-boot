/**
 * useFormReset - 重置 el-form 表单
 *
 * 用法：
 *   const { resetForm } = useFormReset()
 *   resetForm('queryRef')
 */
import { getCurrentInstance } from 'vue'

/**
 * 获取表单重置函数
 * @returns {Function} resetForm(refName) - 按 el-form ref 名称重置表单
 */
export function useFormReset() {
  const { proxy } = getCurrentInstance()
  return function resetForm(refName) {
    // 确保 ref 存在后再重置，避免 null 报错
    if (proxy.$refs[refName]) {
      proxy.$refs[refName].resetFields()
    }
  }
}
