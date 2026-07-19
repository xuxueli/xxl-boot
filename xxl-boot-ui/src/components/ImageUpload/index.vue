<!--
  组件：ImageUpload（图片上传）
  功能：图片墙模式上传，支持多图、拖拽排序、预览大图、类型/大小校验。
  用法：<ImageUpload v-model="form.images" :limit="5" />
-->
<template>
  <div class="component-upload-image">
    <el-upload
      multiple
      :disabled="disabled"
      :action="uploadImgUrl"
      list-type="picture-card"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :data="data"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      ref="imageUpload"
      :before-remove="handleDelete"
      :show-file-list="true"
      :headers="headers"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :class="{ hide: fileList.length >= limit }"
    >
      <el-icon class="avatar-uploader-icon"><plus /></el-icon>
    </el-upload>
    <!-- 上传提示 -->
    <div class="el-upload__tip" v-if="showTip && !disabled">
      请上传
      <template v-if="fileSize">
        大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
      </template>
      <template v-if="fileType">
        格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b>
      </template>
      的文件
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="预览"
      width="800px"
      append-to-body
    >
      <img
        :src="dialogImageUrl"
        style="display: block; max-width: 100%; margin: 0 auto"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { getToken } from "@/utils/auth"
import { isExternal } from "@/utils/validate"
import Sortable from 'sortablejs'
import modal from '@/utils/modal'

const props = defineProps({
  // v-model 双向绑定值：图片 URL 逗号分隔字符串 / 数组
  modelValue: [String, Object, Array],
  // 上传接口地址（相对于 base API）
  action: {
    type: String,
    default: "/common/upload"
  },
  // 上传时携带的额外参数
  data: {
    type: Object
  },
  // 图片数量上限
  limit: {
    type: Number,
    default: 5
  },
  // 单张图片大小上限（MB）
  fileSize: {
    type: Number,
    default: 5
  },
  // 允许的图片后缀，例：['png', 'jpg', 'jpeg']
  fileType: {
    type: Array,
    default: () => ["png", "jpg", "jpeg"]
  },
  // 是否显示格式/大小提示
  isShowTip: {
    type: Boolean,
    default: true
  },
  // 禁用上传（仅展示已上传图片）
  disabled: {
    type: Boolean,
    default: false
  },
  // 是否启用拖拽排序
  drag: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits()
const imageUpload = ref(null)
const number = ref(0)
const uploadList = ref([])
const dialogImageUrl = ref("")
const dialogVisible = ref(false)
const baseUrl = import.meta.env.VITE_APP_BASE_API
const uploadImgUrl = ref(import.meta.env.VITE_APP_BASE_API + props.action)
const headers = ref({ Authorization: "Bearer " + getToken() })
const fileList = ref([])
const showTip = computed(
  () => props.isShowTip && (props.fileType || props.fileSize)
)

// 监听外部 modelValue 变化，同步到文件列表，自动补齐 baseUrl
watch(() => props.modelValue, val => {
  if (val) {
    const list = Array.isArray(val) ? val : props.modelValue.split(",")
    fileList.value = list.map(item => {
      if (typeof item === "string") {
        if (item.indexOf(baseUrl) === -1 && !isExternal(item)) {
          item = { name: baseUrl + item, url: baseUrl + item }
        } else {
          item = { name: item, url: item }
        }
      }
      return item
    })
  } else {
    fileList.value = []
    return []
  }
},{ deep: true, immediate: true })

// 上传前校验：图片格式、文件名、文件大小，通过后显示 loading
function handleBeforeUpload(file) {
  let isImg = false
  if (props.fileType.length) {
    let fileExtension = ""
    if (file.name.lastIndexOf(".") > -1) {
      fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1)
    }
    isImg = props.fileType.some(type => {
      if (file.type.indexOf(type) > -1) return true
      if (fileExtension && fileExtension.indexOf(type) > -1) return true
      return false
    })
  } else {
    isImg = file.type.indexOf("image") > -1
  }
  if (!isImg) {
    modal.msgError(`文件格式不正确，请上传${props.fileType.join("/")}图片格式文件!`)
    return false
  }
  if (file.name.includes(',')) {
    modal.msgError('文件名不正确，不能包含英文逗号!')
    return false
  }
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize
    if (!isLt) {
      modal.msgError(`上传头像图片大小不能超过 ${props.fileSize} MB!`)
      return false
    }
  }
  modal.loading("正在上传图片，请稍候...")
  number.value++
}

// 图片数量超出限制提示
function handleExceed() {
  modal.msgError(`上传文件数量不能超过 ${props.limit} 个!`)
}

// 上传成功回调：添加记录或回滚
function handleUploadSuccess(res, file) {
  if (res.code === 200) {
    uploadList.value.push({ name: res.fileName, url: res.fileName })
    uploadedSuccessfully()
  } else {
    number.value--
    modal.closeLoading()
    modal.msgError(res.msg)
    imageUpload.value.handleRemove(file)
    uploadedSuccessfully()
  }
}

// 删除图片：从文件列表中移除
function handleDelete(file) {
  const findex = fileList.value.map(f => f.name).indexOf(file.name)
  if (findex > -1 && uploadList.value.length === number.value) {
    fileList.value.splice(findex, 1)
    emit("update:modelValue", listToString(fileList.value))
    return false
  }
}

// 全部上传完成：合并文件列表并输出最终值
function uploadedSuccessfully() {
  if (number.value > 0 && uploadList.value.length === number.value) {
    fileList.value = fileList.value.filter(f => f.url !== undefined).concat(uploadList.value)
    uploadList.value = []
    number.value = 0
    emit("update:modelValue", listToString(fileList.value))
    modal.closeLoading()
  }
}

// 上传失败处理
function handleUploadError() {
  modal.msgError("上传图片失败")
  modal.closeLoading()
}

// 预览大图对话框
function handlePictureCardPreview(file) {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}

// 图片 URL 列表转逗号分隔字符串（去掉 baseUrl 前缀和 blob 临时路径）
function listToString(list, separator) {
  let strs = ""
  separator = separator || ","
  for (let i in list) {
    if (undefined !== list[i].url && list[i].url.indexOf("blob:") !== 0) {
      strs += list[i].url.replace(baseUrl, "") + separator
    }
  }
  return strs != "" ? strs.substr(0, strs.length - 1) : ""
}

// 初始化拖拽排序（sortablejs）
onMounted(() => {
  if (props.drag && !props.disabled) {
    nextTick(() => {
      const element = imageUpload.value?.$el?.querySelector('.el-upload-list')
      Sortable.create(element, {
        onEnd: (evt) => {
          const movedItem = fileList.value.splice(evt.oldIndex, 1)[0]
          fileList.value.splice(evt.newIndex, 0, movedItem)
          emit('update:modelValue', listToString(fileList.value))
        }
      })
    })
  }
})
</script>

<style scoped lang="scss">
// .el-upload--picture-card 控制加号部分
:deep(.hide .el-upload--picture-card) {
    display: none;
}

:deep(.el-upload.el-upload--picture-card.is-disabled) {
  display: none !important;
} 
</style>