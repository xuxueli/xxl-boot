<!--
  组件：树节点添加弹窗
  功能：为级联选择器（cascader）添加树形选项节点
-->
<template>
  <div>
    <el-dialog title="添加选项" v-model="open" width="800px" :close-on-click-modal="false" :modal-append-to-body="false"
      @open="onOpen" @close="onClose">

      <!-- 表单 -->
      <el-form ref="treeNodeForm" :model="formData" :rules="rules" label-width="100px">
        <el-col :span="24">
          <el-form-item label="选项名" prop="label">
            <el-input v-model="formData.label" placeholder="请输入选项名" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="选项值" prop="value">
            <el-input v-model="formData.value" placeholder="请输入选项值" clearable>
              <template #append>
                <el-select v-model="dataType" :style="{ width: '100px' }">
                  <el-option v-for="(item, index) in dataTypeOptions" :key="index" :label="item.label" :value="item.value"
                    :disabled="item.disabled" />
                </el-select>
              </template>

            </el-input>
          </el-form-item>
        </el-col>
      </el-form>

      <!-- btn -->
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handelConfirm">确 定</el-button>
          <el-button @click="onClose">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
/** 树节点添加弹窗 - 逻辑 */
const open = defineModel()
const emit = defineEmits(['commit'])
const formData = ref({
  label: undefined,
  value: undefined
})
const rules = {
  label: [{
    required: true,
    message: '请输入选项名',
    trigger: 'blur'
  }],
  value: [{
    required: true,
    message: '请输入选项值',
    trigger: 'blur'
  }]
}
const dataType = ref('string')       /* 值类型 */
const dataTypeOptions = ref([
  { label: '字符串', value: 'string' },
  { label: '数字',   value: 'number' }
])
const id = ref(100)                  /* 节点 ID 自增 */
const treeNodeForm = ref()

/** 弹窗打开：重置表单 */
function onOpen() {
  formData.value = {
    label: undefined,
    value: undefined
  }
}

/** 弹窗关闭 */
function onClose() {
  open.value = false
}

/** 确认添加节点 */
function handelConfirm() {
  treeNodeForm.value.validate(valid => {
    if (!valid) return
    if (dataType.value === 'number') {
      formData.value.value = parseFloat(formData.value.value)
    }
    formData.value.id = id.value++
    emit('commit', formData.value)
    onClose()
  })
}
</script>
