<!--
  组件：FileUpload（文件上传）
  功能：通用文件上传组件，支持多文件、拖拽排序、类型/大小校验、可下载文件列表。
  用法：<FileUpload v-model="form.files" :limit="5" :file-size="10" />
-->
<template>
  <div class="upload-file">

    <!-- 文件上传组件 -->
    <el-upload
        multiple
        :action="uploadFileUrl"
        :before-upload="handleBeforeUpload"
        :file-list="fileList"
        :data="data"
        :limit="limit"
        :on-error="handleUploadError"
        :on-exceed="handleExceed"
        :on-success="handleUploadSuccess"
        :show-file-list="false"
        :headers="headers"
        class="upload-file-uploader"
        ref="fileUpload"
        v-if="!disabled"
    >
      <!-- 上传按钮 -->
      <el-button type="primary">选取文件</el-button>
    </el-upload>

    <!-- 上传提示 -->
    <div class="el-upload__tip" v-if="showTip && !disabled">
      请上传
      <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b></template>
      <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b></template>
      的文件
    </div>

    <!-- 文件列表 -->
    <transition-group ref="uploadFileList" class="upload-file-list el-upload-list el-upload-list--text"
                      name="el-fade-in-linear" tag="ul">
      <li :key="file.uid" class="el-upload-list__item ele-upload-list__item-content" v-for="(file, index) in fileList">
        <el-link :href="`${baseUrl}${file.url}`" underline="never" target="_blank">
          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
        </el-link>
        <div class="ele-upload-list__item-content-action">
          <el-link underline="never" @click="handleDelete(index)" type="danger" v-if="!disabled">&nbsp;删除</el-link>
        </div>
      </li>
    </transition-group>

  </div>
</template>

<script setup>
import {getAuthHeaders} from "@/utils/auth"
import Sortable from 'sortablejs'
import modal from '@/utils/modal'

/**
 * defineProps
 */
const props = defineProps({
  /**
   * 文件列表，支持三种格式：
   *    String: "url1,url2"（逗号分隔的 URL 字符串）
   *    Object: {name, url}
   *    Array:  ["url1", "url2"] 或 [{name, url}, ...]
   */
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
  // 文件数量上限
  limit: {
    type: Number,
    default: 5
  },
  // 单个文件大小上限（MB）
  fileSize: {
    type: Number,
    default: 5
  },
  // 允许的文件后缀列表，例：['png', 'jpg', 'pdf']
  fileType: {
    type: Array,
    default: () => ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "pdf"]
  },
  // 是否显示文件格式/大小提示
  isShowTip: {
    type: Boolean,
    default: true
  },
  // 禁用上传（仅展示已上传文件列表）
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

// defineEmits：子传父（modelValue 通过 update:modelValue 回传）
const emit = defineEmits()

const fileUpload = ref(null)                  // el-upload 组件引用
const uploadFileList = ref(null)              // 文件列表 DOM 引用（用于 sortablejs 拖拽）
const number = ref(0)                         // 正在上传的文件计数
const uploadList = ref([])                    // 本次上传成功的文件列表
const baseUrl = import.meta.env.VITE_APP_BASE_API                                   // API 基础地址
const uploadFileUrl = ref(import.meta.env.VITE_APP_BASE_API + props.action)         // 上传接口完整地址
const headers = ref(getAuthHeaders())                                          // 上传请求头（携带 token）
const fileList = ref([])                      // 已上传文件列表 [{name, url}]
const showTip = computed(                     // 是否显示文件格式/大小提示
    () => props.isShowTip && (props.fileType || props.fileSize)
)

// 监听外部 modelValue 变化，同步到文件列表
watch(() => props.modelValue, val => {
  if (val) {
    // 统一转为数组：字符串按逗号分割，数组直接使用
    const list = Array.isArray(val) ? val : String(val).split(',')
    let temp = 1
    // 转为内部格式 [{name, url, uid}]，纯字符串补齐为对象
    fileList.value = list.map(item => {
      if (typeof item === "string") {
        item = {name: item, url: item}
      }
      // 为每个文件生成唯一 uid（el-upload 依赖 key）
      item.uid = item.uid || new Date().getTime() + temp++
      return item
    })
  } else {
    // 无值时清空列表
    fileList.value = []
    return []
  }
}, {deep: true, immediate: true})

// 上传前置校验：文件类型、文件名、文件大小，全部通过后显示 loading
function handleBeforeUpload(file) {
  // 校检文件类型
  if (props.fileType.length) {
    const fileName = file.name.split('.')
    const fileExt = fileName[fileName.length - 1]
    const isTypeOk = props.fileType.indexOf(fileExt) >= 0
    if (!isTypeOk) {
      modal.msgError(`文件格式不正确，请上传${props.fileType.join("/")}格式文件!`)
      return false
    }
  }
  // 校检文件名是否包含特殊字符
  if (file.name.includes(',')) {
    modal.msgError('文件名不正确，不能包含英文逗号!')
    return false
  }
  // 校检文件大小
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize
    if (!isLt) {
      modal.msgError(`上传文件大小不能超过 ${props.fileSize} MB!`)
      return false
    }
  }
  modal.loading("正在上传文件，请稍候...")
  number.value++
  return true
}

// 文件数量超出限制提示
function handleExceed() {
  modal.msgError(`上传文件数量不能超过 ${props.limit} 个!`)
}

// 上传失败处理
function handleUploadError(err) {
  modal.msgError("上传文件失败")
  modal.closeLoading()
}

// 上传成功回调：
function handleUploadSuccess(res, file) {
  if (res.code === 200) {
    // 上传成功，添加到本次成功列表
    uploadList.value.push({name: res.fileName, url: res.fileName})
    uploadedSuccessfully()
  } else {
    // 上传失败（后端业务异常），减少计数、关闭 loading、移除该文件
    number.value--
    modal.closeLoading()
    modal.msgError(res.msg)
    fileUpload.value.handleRemove(file)
    uploadedSuccessfully()
  }
}

// 删除文件列表中的指定项
function handleDelete(index) {
  fileList.value.splice(index, 1)
  emit("update:modelValue", listToString(fileList.value))
}

// 全部上传完毕时：合并新旧文件列表，输出到 v-model
// 条件：number > 0（有文件在上传）且 成功数 === 总文件数
function uploadedSuccessfully() {
  if (number.value > 0 && uploadList.value.length === number.value) {
    // 合并已有文件（过滤掉没有 url 的占位项）和本次上传成功的文件
    fileList.value = fileList.value.filter(f => f.url !== undefined).concat(uploadList.value)
    uploadList.value = []
    number.value = 0
    // 回写 v-model
    emit("update:modelValue", listToString(fileList.value))
    modal.closeLoading()
  }
}

// 从 URL 或文件名中提取纯文件名（去掉路径前缀）
function getFileName(name) {
  // 含路径时取最后一段，如 "/path/to/file.pdf" → "file.pdf"
  if (name.lastIndexOf("/") > -1) {
    return name.slice(name.lastIndexOf("/") + 1)
  } else {
    return name
  }
}

// 文件列表转逗号分隔的 URL 字符串（v-model 输出格式）
function listToString(list, separator) {
  let strs = ""
  separator = separator || ","
  for (let i in list) {
    if (list[i].url) {
      strs += list[i].url + separator
    }
  }
  // 去掉末尾多余的分隔符
  return strs !== '' ? strs.substr(0, strs.length - 1) : ''
}

// 初始化拖拽排序（sortablejs）
onMounted(() => {

  if (props.drag && !props.disabled) {
    nextTick(() => {
      // 获取文件列表容器，支持 transition-group 的 $el
      const element = uploadFileList.value?.$el || uploadFileList.value
      Sortable.create(element, {
        ghostClass: 'file-upload-darg',
        // 拖拽结束后更新 fileList 顺序并同步 v-model
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
.file-upload-darg {
  opacity: 0.5;
  background: #c8ebfb;
}

.upload-file-uploader {
  margin-bottom: 5px;
}

.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
  transition: none !important;
}

.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}

.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}
</style>
