<!--
  TreeNodeDialog（树节点添加弹窗）
  功能：为级联选择器（cascader）添加树形选项节点
  @author xuxueli 2026-11-22
-->
<template>
  <div>
    <el-dialog
      v-model="open"
      :title="t('tool.pagegen.addOption')"
      width="800px"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      @close="onClose"
      @closed="resetForm"
    >
      <!-- 表单 -->
      <el-form ref="treeNodeForm" :model="formData" :rules="rules" label-width="100px">
        <el-col :span="24">
          <el-form-item :label="t('tool.pagegen.optionName')" prop="label">
            <el-input v-model="formData.label" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.optionName')])" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="t('tool.pagegen.optionValue')" prop="value">
            <el-input v-model="formData.value" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.optionValue')])" clearable>
              <template #append>
                <el-select v-model="dataType" :style="{ width: '100px' }">
                  <el-option v-for="item in dataTypeOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-form>

      <!-- 底部按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handelConfirm">{{ t('modal.confirmButton') }}</el-button>
          <el-button @click="onClose">{{ t('modal.cancelButton') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { t } from '@/i18n'
import type { FormInstance } from 'element-plus'
import { ref } from 'vue'

/** 弹窗显隐 */
const open = defineModel<boolean>()

/** 组件事件：确认提交节点 */
const emit = defineEmits<{ commit: [node: TreeNodeForm] }>()

/** 节点表单数据结构 */
interface TreeNodeForm {
  /** 选项名 */
  label?: string
  /** 选项值 */
  value?: string | number
  /** 节点 ID */
  id?: number
}

/** 值类型选项 */
interface DataTypeOption {
  /** 展示文案 */
  label: string
  /** 类型值 */
  value: 'string' | 'number'
  /** 是否禁用 */
  disabled?: boolean
}

// ---------------------- 响应式数据 ----------------------

const treeNodeForm = ref<FormInstance>() /* 表单实例 */

/** 表单默认值：新增初始值与每次重置共用 */
const FORM_DEFAULTS: Readonly<TreeNodeForm> = {
  label: undefined,
  value: undefined
}

const formData = ref<TreeNodeForm>({ ...FORM_DEFAULTS })
const dataType = ref<'string' | 'number'>('string') /* 值类型 */
const id = ref(100) /* 节点 ID 自增 */

const dataTypeOptions = ref<DataTypeOption[]>([
  { label: t('tool.pagegen.dataTypeString'), value: 'string' },
  { label: t('tool.pagegen.dataTypeNumber'), value: 'number' }
])

const rules = {
  label: [{ required: true, message: t('common.requiredMsg', [t('tool.pagegen.optionName')]), trigger: 'blur' }],
  value: [{ required: true, message: t('common.requiredMsg', [t('tool.pagegen.optionValue')]), trigger: 'blur' }]
}

// ---------------------- 数据操作 ----------------------

/** 重置表单：恢复默认值并清除校验状态 */
function resetForm() {
  formData.value = { ...FORM_DEFAULTS }
  dataType.value = 'string'
  treeNodeForm.value?.clearValidate()
}

/** 弹窗关闭 */
function onClose() {
  open.value = false
}

/** 确认添加节点：校验通过后按值类型转换并抛出节点数据 */
function handelConfirm() {
  treeNodeForm.value?.validate((valid) => {
    // 校验失败时保持弹窗打开，等待用户修正
    if (!valid) return
    if (dataType.value === 'number') {
      formData.value.value = parseFloat(String(formData.value.value))
    }
    formData.value.id = id.value++
    emit('commit', formData.value)
    onClose()
  })
}
</script>
