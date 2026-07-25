<!--
  组件：代码生成类型选择弹窗
  功能：选择生成页面或弹窗类型，可输入文件名
-->
<template>
  <el-dialog v-model="open" width="500px" title="选择生成类型" @open="onOpen" @close="onClose">
    <el-form ref="codeTypeForm" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="生成类型" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio-button v-for="(item, index) in typeOptions" :key="index" :label="item.value">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="showFileName" label="文件名" prop="fileName">
        <el-input v-model="formData.fileName" placeholder="请输入文件名" clearable />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="primary" @click="handelConfirm">确定</el-button>
      <el-button @click="onClose">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
/** 生成类型弹窗 - 逻辑 */
const open = defineModel()
const props = defineProps({
  showFileName: Boolean   /* 是否显示文件名输入 */
})
const emit = defineEmits(['confirm'])
const formData = ref({
  fileName: undefined,
  type: 'file'            /* 默认生成页面 */
})
const codeTypeForm = ref()
const rules = {
  fileName: [{
    required: true,
    message: '请输入文件名',
    trigger: 'blur'
  }],
  type: [{
    required: true,
    message: '生成类型不能为空',
    trigger: 'change'
  }]
}
const typeOptions = ref([
  { label: '页面', value: 'file' },
  { label: '弹窗', value: 'dialog' }
])

/** 弹窗打开：需要文件名时设置默认值 */
function onOpen() {
  if (props.showFileName) {
    formData.value.fileName = `${+new Date()}.vue`
  }
}

/** 弹窗关闭 */
function onClose() {
  open.value = false
}

/** 确认生成 */
function handelConfirm() {
  codeTypeForm.value.validate(valid => {
    if (!valid) return
    emit('confirm', { ...formData.value })
    onClose()
  })
}
</script>