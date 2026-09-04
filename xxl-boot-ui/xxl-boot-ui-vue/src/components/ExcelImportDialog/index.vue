<!--
  组件：ExcelImportDialog（Excel 导入弹窗）
  功能：Excel 文件导入对话框，支持文件拖拽上传、模板下载、覆盖更新选项。
  用法：<ExcelImportDialog ref="importRef" title="用户导入" action="/system/user/importData"
          @success="getList" />
-->
<template>
  <el-dialog :title="title" v-model="visible" :width="width" append-to-body @close="handleClose">
    <el-upload
      ref="uploadRef"
      :limit="1"
      accept=".xlsx, .xls"
      :headers="headers"
      :action="uploadUrl"
      :disabled="isUploading"
      :on-progress="handleProgress"
      :on-change="handleFileChange"
      :on-remove="handleFileRemove"
      :on-success="handleSuccess"
      :auto-upload="false"
      drag
    >
      <el-icon class="el-icon--upload">
        <UploadFilled />
      </el-icon>
      <div class="el-upload__text">{{ t('components.excelImport.dragTip') }}<em>{{ t('components.excelImport.clickUpload') }}</em></div>
      <template #tip>
        <div class="el-upload__tip text-center">
          <div class="el-upload__tip">
            <el-checkbox v-model="updateSupport"> {{ updateSupportLabel }}</el-checkbox>
          </div>
          <span>{{ t('components.excelImport.formatTip') }}</span>
          <el-link
            v-if="templateUrl"
            type="primary"
            underline="never"
            style="font-size: 12px; vertical-align: baseline"
            @click="handleDownloadTemplate"
            >{{ t('components.excelImport.downloadTemplate') }}
          </el-link>
        </div>
      </template>
    </el-upload>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">{{ t('modal.confirmButton') }}</el-button>
        <el-button @click="visible = false">{{ t('modal.cancelButton') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { getAuthHeaders } from '@/utils/auth'
import { download } from '@/utils/download'
import modal from '@/utils/modal'
import { t } from '@/i18n'
import { ElMessageBox } from 'element-plus'
import type { UploadFile, UploadFiles } from 'element-plus'
import { computed, nextTick, ref } from 'vue'

/**
 * defineProps：父传子
 */
const props = defineProps({
  // 对话框标题
  title: {
    type: String,
    default: t('components.excelImport.title')
  },
  // 对话框宽度
  width: {
    type: String,
    default: '400px'
  },
  // 上传接口地址（必传）
  action: {
    type: String,
    required: true
  },
  // 模板下载接口地址，不传则不显示下载模板链接
  templateAction: {
    type: String,
    default: ''
  },
  // 模板文件名前缀
  templateFileName: {
    type: String,
    default: 'template'
  },
  // 覆盖更新勾选框的说明文字
  updateSupportLabel: {
    type: String,
    default: t('components.excelImport.updateSupport')
  }
})

/**
 * 暴露 open 方法供父组件调用
 *
 * defineExpose：父传子
 */
defineExpose({ open })

/**
 * defineEmits：子传父
 */
const emit = defineEmits(['success'])

const uploadRef = ref<any>(null) // el-upload 组件引用
const visible = ref(false) // 弹窗显示/隐藏
const selectedFile = ref<any>(null) // 当前选中的文件
const isUploading = ref(false) // 是否正在上传中
const updateSupport = ref(false) // 是否覆盖更新已有数据
const headers = getAuthHeaders() // 上传请求头（el-upload 不走 axios 拦截器，需手动注入）

// 上传地址（拼接 updateSupport 参数）
const uploadUrl = computed(() => {
  return import.meta.env.VITE_APP_BASE_API + props.action + '?updateSupport=' + (updateSupport.value ? 1 : 0)
})

// 是否有模板下载地址
const templateUrl = computed(() => !!props.templateAction)

// 打开对话框（供父组件通过 ref 调用）
function open() {
  updateSupport.value = false
  isUploading.value = false
  visible.value = true
  nextTick(() => {
    selectedFile.value = null
    uploadRef.value?.clearFiles()
  })
}

// 关闭时清理上传状态
function handleClose() {
  isUploading.value = false
  selectedFile.value = null
  uploadRef.value?.clearFiles()
}

// 下载导入模板文件
function handleDownloadTemplate() {
  download(props.templateAction, {}, `${props.templateFileName}_${new Date().getTime()}.xlsx`)
}

// 上传进度中：禁用提交按钮
function handleProgress() {
  isUploading.value = true
}

// 文件选择处理：记录选中文件
const handleFileChange = (file: UploadFile, fileList: UploadFiles) => {
  selectedFile.value = file
}

// 文件删除处理：清空选中文件
const handleFileRemove = (file: UploadFile, fileList: UploadFiles) => {
  selectedFile.value = null
}

// 上传成功：关闭弹窗，弹出导入结果消息
function handleSuccess(response: any) {
  visible.value = false
  isUploading.value = false
  selectedFile.value = null
  uploadRef.value?.clearFiles()
  ElMessageBox.alert(
    "<div style='overflow:auto;overflow-x:hidden;max-height:70vh;padding:10px 20px 0;'>" + response.msg + '</div>',
    t('components.excelImport.result'),
    { dangerouslyUseHTMLString: true }
  )
  emit('success')
}

// 提交上传：校验文件格式后执行上传
function handleSubmit() {
  const file = selectedFile.value
  if (!file || file.length === 0 || (!file.name.toLowerCase().endsWith('.xls') && !file.name.toLowerCase().endsWith('.xlsx'))) {
    modal.msgError(t('components.excelImport.selectFile'))
    return
  }
  uploadRef.value.submit()
}
</script>
