import { getCurrentInstance } from 'vue'

export function useFormReset() {
  const { proxy } = getCurrentInstance()
  return function resetForm(refName) {
    if (proxy.$refs[refName]) {
      proxy.$refs[refName].resetFields()
    }
  }
}
