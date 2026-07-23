<!--
  组件：ImageUpload（图片上传）
  功能：图片墙模式上传，支持多图、拖拽排序、预览大图、类型/大小校验。
  用法：<ImageUpload v-model="form.images" :limit="5" />
-->
<template>
  <div class="component-upload-image">
    <!-- 上传组件 -->
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
      <el-icon class="avatar-uploader-icon">
        <plus/>
      </el-icon>
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

    <!-- 预览弹窗 -->
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
import {getToken} from "@/utils/auth"
import {isExternal} from "@/utils/validate"
import Sortable from 'sortablejs'
import modal from '@/utils/modal'

/**
 * defineProps
 */
const props = defineProps({
  /**
   * 图片列表，初始值 / 回写值
   *   String: "url1,url2" — 逗号分隔的相对路径字符串
   *   Array:  ["url1", "url2"] | [{name, url}, ...]
   *   输出时自动去掉 baseUrl 前缀和 blob 临时路径
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

// defineEmits：子传父（modelValue 通过 update:modelValue 回传）
const emit = defineEmits()

const imageUpload = ref(null)                  // el-upload 组件引用
const number = ref(0)                          // 正在上传的图片计数
const uploadList = ref([])                     // 本次上传成功的图片列表
const dialogImageUrl = ref("")                 // 预览大图的 URL
const dialogVisible = ref(false)               // 预览弹窗显示/隐藏
const baseUrl = import.meta.env.VITE_APP_BASE_API                                   // API 基础地址
const uploadImgUrl = ref(import.meta.env.VITE_APP_BASE_API + props.action)          // 上传接口完整地址
const headers = ref({Authorization: "Bearer " + getToken()})                        // 上传请求头（携带 token）
const fileList = ref([])                       // 已上传图片列表 [{name, url}]
const showTip = computed(                      // 是否显示格式/大小提示
    () => props.isShowTip && (props.fileType || props.fileSize)
)

// 监听外部 modelValue 变化，同步到文件列表，自动补齐 baseUrl
watch(() => props.modelValue, val => {
  if (val) {
    // 统一转为数组：字符串按逗号分割，数组直接使用
    const list = Array.isArray(val) ? val : String(val).split(",")
    fileList.value = list.map(item => {
      if (typeof item === "string") {
        // 缺少 baseUrl 且非外链时补齐，如 "2024/01/abc.jpg" → "/dev-api/2024/01/abc.jpg"
        if (item.indexOf(baseUrl) === -1 && !isExternal(item)) {
          item = {name: baseUrl + item, url: baseUrl + item}
        } else {
          item = {name: item, url: item}
        }
      }
      return item
    })
  } else {
    // 无值时清空列表
    fileList.value = []
  }
}, {deep: true, immediate: true})

// 上传前校验：图片格式、文件名、文件大小，通过后显示 loading
function handleBeforeUpload(file) {
  let isImg = false
  if (props.fileType.length) {
    // 从 file.type（MIME）和文件扩展名双重校验
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
    // 未指定 fileType 时，按 MIME 类型判断是否为图片
    isImg = file.type.indexOf("image") > -1
  }
  if (!isImg) {
    modal.msgError(`文件格式不正确，请上传${props.fileType.join("/")}图片格式文件!`)
    return false
  }
  // 文件名不能含逗号（v-model 以逗号分隔）
  if (file.name.includes(',')) {
    modal.msgError('文件名不正确，不能包含英文逗号!')
    return false
  }
  // 校验文件大小
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize
    if (!isLt) {
      modal.msgError(`上传图片大小不能超过 ${props.fileSize} MB!`)
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

// 上传成功回调：后端返回 200 则记录；否则回滚计数并从列表中移除
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
    imageUpload.value.handleRemove(file)
    uploadedSuccessfully()
  }
}

// 处理删除图片：仅在上传全部完成后允许删除，删除后同步 v-model
function handleDelete(file) {
  // 找到当前文件在 fileList 中的索引（按 name 匹配）
  const findex = fileList.value.map(f => f.name).indexOf(file.name)
  // 仅在所有文件上传完毕时允许删除（uploadList.length === number.value 表示无进行中的上传）
  if (findex > -1 && uploadList.value.length === number.value) {
    fileList.value.splice(findex, 1)
    emit("update:modelValue", listToString(fileList.value))
    return false
  }
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

// 上传失败处理：关闭 loading 并提示
function handleUploadError() {
  modal.msgError("上传图片失败")
  modal.closeLoading()
}

// 预览大图：设置预览 URL 并打开弹窗
function handlePictureCardPreview(file) {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}

// 图片列表转逗号分隔的相对路径字符串（去掉 baseUrl 和 blob 临时路径）
function listToString(list, separator) {
  let strs = ""
  separator = separator || ","
  for (let i in list) {
    // 跳过 blob 临时路径（未上传完成的本地预览图）
    if (undefined !== list[i].url && list[i].url.indexOf("blob:") !== 0) {
      // 去掉 baseUrl 前缀，仅保存相对路径
      strs += list[i].url.replace(baseUrl, "") + separator
    }
  }
  return strs !== "" ? strs.substr(0, strs.length - 1) : ""
}

// 初始化拖拽排序（sortablejs）
onMounted(() => {

  if (props.drag && !props.disabled) {
    nextTick(() => {
      // 获取 el-upload 内部的图片列表容器
      const element = imageUpload.value?.$el?.querySelector('.el-upload-list')
      Sortable.create(element, {
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
// .el-upload--picture-card 控制加号部分
:deep(.hide .el-upload--picture-card) {
  display: none;
}

:deep(.el-upload.el-upload--picture-card.is-disabled) {
  display: none !important;
}
</style>