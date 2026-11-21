<!--
  CodeTypeDialog（代码生成类型选择弹窗）
  功能：选择生成页面或弹窗类型，可输入文件名
  @author xuxueli 2026-11-22
-->
<template>
  <el-dialog
    v-model="open"
    width="500px"
    :title="t('tool.pagegen.selectGenType')"
    :close-on-click-modal="false"
    @open="onOpen"
    @close="onClose"
    @closed="resetForm"
  >
    <el-form ref="codeTypeForm" :model="formData" :rules="rules" label-width="100px">
      <!-- 生成类型选择 -->
      <el-form-item :label="t('tool.pagegen.genType')" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio-button v-for="item in typeOptions" :key="item.value" :value="item.value">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <!-- 文件名输入 -->
      <el-form-item v-if="showFileName" :label="t('tool.pagegen.fileName')" prop="fileName">
        <el-input v-model="formData.fileName" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.fileName')])" clearable />
      </el-form-item>
    </el-form>

    <!-- 弹窗底部按钮 -->
    <template #footer>
      <el-button type="primary" @click="handelConfirm">{{ t('modal.confirmButton') }}</el-button>
      <el-button @click="onClose">{{ t('modal.cancelButton') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { t } from '@/i18n'
import type { FormInstance } from 'element-plus'
import { ref } from 'vue'

/** 弹窗显隐 */
const open = defineModel<boolean>()

/** 组件属性 */
const props = defineProps({
  showFileName: Boolean /* 是否显示文件名输入 */
})

/** 表单数据结构 */
interface CodeTypeForm {
  /** 文件名 */
  fileName?: string
  /** 生成类型：file 页面 / dialog 弹窗 */
  type: string
}

/** 生成类型选项 */
interface CodeTypeOption {
  /** 展示文案 */
  label: string
  /** 类型值 */
  value: string
}

/** 组件事件：确认提交 */
const emit = defineEmits<{ confirm: [form: CodeTypeForm] }>()

// ---------------------- 响应式数据 ----------------------

const codeTypeForm = ref<FormInstance>() /* 表单实例 */

/** 表单默认值：新增初始值与每次重置共用 */
const FORM_DEFAULTS: Readonly<CodeTypeForm> = {
  fileName: undefined,
  type: 'file'
}

const formData = ref<CodeTypeForm>({ ...FORM_DEFAULTS })

const rules = {
  fileName: [{ required: true, message: t('common.requiredMsg', [t('tool.pagegen.fileName')]), trigger: 'blur' }],
  type: [{ required: true, message: t('common.requiredMsg', [t('tool.pagegen.genType')]), trigger: 'change' }]
}

// 生成类型选项
const typeOptions = ref<CodeTypeOption[]>([
  { label: t('tool.pagegen.typePage'), value: 'file' },
  { label: t('tool.pagegen.typeDialog'), value: 'dialog' }
])

// ---------------------- 数据操作 ----------------------

/** 重置表单：恢复默认值并清除校验状态 */
function resetForm() {
  formData.value = { ...FORM_DEFAULTS }
  codeTypeForm.value?.clearValidate()
}

/** 弹窗打开：重置表单，需要文件名时生成带时间戳的默认文件名 */
function onOpen() {
  resetForm()
  if (props.showFileName) {
    formData.value.fileName = `${Date.now()}.vue`
  }
}

/** 弹窗关闭 */
function onClose() {
  open.value = false
}

/** 确认生成：校验通过后抛出表单数据 */
function handelConfirm() {
  codeTypeForm.value?.validate((valid) => {
    // 校验失败时保持弹窗打开，等待用户修正
    if (!valid) return
    emit('confirm', { ...formData.value })
    onClose()
  })
}
</script>
