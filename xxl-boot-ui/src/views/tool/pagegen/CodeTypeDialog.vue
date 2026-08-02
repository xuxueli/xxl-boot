<!--
  组件：代码生成类型选择弹窗
  功能：选择生成页面或弹窗类型，可输入文件名
-->
<template>
  <el-dialog v-model="open" width="500px" title="选择生成类型" @open="onOpen" @close="onClose">
    <el-form ref="codeTypeForm" :model="formData" :rules="rules" label-width="100px">

      <!-- 生成类型选择 -->
      <el-form-item label="生成类型" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio-button v-for="(item, index) in typeOptions" :key="index" :label="item.value">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <!-- 文件名输入 -->
      <el-form-item v-if="showFileName" label="文件名" prop="fileName">
        <el-input v-model="formData.fileName" placeholder="请输入文件名" clearable />
      </el-form-item>
    </el-form>

    <!-- 弹窗底部按钮 -->
    <template #footer>
      <el-button type="primary" @click="handelConfirm">确定</el-button>
      <el-button @click="onClose">取消</el-button>
    </template>

  </el-dialog>
</template>

<script setup>
/** 弹窗：显示状态 */
const open = defineModel()

// 组件属性
const props = defineProps({
  showFileName: Boolean   /* 是否显示文件名输入 */
})

/**
 * 组件回调
 *
 * 组件事件：确认提交
 */
const emit = defineEmits(['confirm'])

// 响应式数据
const formData = ref({
  fileName: undefined,            /* 文件名 */
  type: 'file'                    /* 默认生成页面 */
})

// 表单 + 规则
const codeTypeForm = ref()        /* 表单 ref */
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

// 生成类型
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