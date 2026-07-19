<!--
  组件：Editor（富文本编辑器）
  功能：基于 Quill 的富文本编辑器，支持工具栏、图片上传（url/base64）、粘贴图片、
        自定义高度/只读模式。
  用法：<Editor v-model="form.content" :min-height="192" />
-->
<template>
  <div>
    <el-upload
      :action="uploadUrl"
      :before-upload="handleBeforeUpload"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      name="file"
      :show-file-list="false"
      :headers="headers"
      class="editor-img-uploader"
      v-if="type == 'url'"
    >
      <i ref="uploadRef" class="editor-img-uploader"></i>
    </el-upload>
  </div>
  <div class="editor">
    <quill-editor
      ref="quillEditorRef"
      v-model:content="content"
      contentType="html"
      @ready="onEditorReady"
      @textChange="(e) => $emit('update:modelValue', content)"
      :options="options"
      :style="styles"
    />
  </div>
</template>

<script setup>
import axios from 'axios'
import { QuillEditor } from "@vueup/vue-quill"
import "@vueup/vue-quill/dist/vue-quill.snow.css"
import { getToken } from "@/utils/auth"
import modal from '@/utils/modal'

const quillEditorRef = ref()
const uploadRef = ref(null)
const uploadUrl = ref(import.meta.env.VITE_APP_BASE_API + "/common/upload")
const headers = ref({
  Authorization: "Bearer " + getToken()
})

const props = defineProps({
  // 编辑器的内容（v-model 双向绑定）
  modelValue: {
    type: String,
  },
  // 编辑器高度（px），不传则自适应
  height: {
    type: Number,
    default: null,
  },
  // 编辑器最小高度（px）
  minHeight: {
    type: Number,
    default: null,
  },
  // 是否只读
  readOnly: {
    type: Boolean,
    default: false,
  },
  // 上传文件大小限制（MB）
  fileSize: {
    type: Number,
    default: 5,
  },
  // 图片上传方式：url（上传到服务器拿链接）/ base64（转 base64 直接嵌入）
  type: {
    type: String,
    default: "url",
  }
})

// Quill 编辑器配置：主题、工具栏、只读模式
const options = ref({
  theme: "snow",
  bounds: document.body,
  debug: "warn",
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["clean"],
      ["link", "image", "video"]
    ],
  },
  placeholder: "请输入内容",
  readOnly: props.readOnly
})

const styles = computed(() => {
  let style = {}
  if (props.minHeight) {
    style.minHeight = `${props.minHeight}px`
  }
  if (props.height) {
    style.height = `${props.height}px`
  }
  return style
})

const content = ref("")
watch(() => props.modelValue, (v) => {
  if (v !== content.value) {
    content.value = v == undefined ? "<p></p>" : v
  }
}, { immediate: true })

// url 模式下：劫持图片上传按钮（触发隐藏 file input）+ 监听粘贴图片事件
function onEditorReady(quill) {
  if (props.type === 'url') {
    let toolbar = quill.getModule("toolbar")
    toolbar.addHandler("image", (value) => {
      if (value) {
        uploadRef.value.click()
      } else {
        quill.format("image", false)
      }
    })
    quill.root.addEventListener('paste', handlePasteCapture, true)
  }
}

// 编辑器销毁时移除粘贴监听
onBeforeUnmount(() => {
  if (props.type == 'url' && quillEditorRef.value) {
    try {
      let quill = quillEditorRef.value.getQuill()
      quill.root.removeEventListener('paste', handlePasteCapture, true)
    } catch { /* editor may not have been initialized */ }
  }
})

// 上传前校验格式和大小
function handleBeforeUpload(file) {
  const type = ["image/jpeg", "image/jpg", "image/png", "image/svg"]
  const isJPG = type.includes(file.type)
  //检验文件格式
  if (!isJPG) {
    modal.msgError(`图片格式错误!`)
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
  return true
}

// 上传成功：在光标位置插入图片
function handleUploadSuccess(res, file) {
  if (res.code == 200) {
    let quill = toRaw(quillEditorRef.value).getQuill()
    // 获取光标位置
    let length = quill.selection.savedRange.index
    // 插入图片，res.url为服务器返回的图片链接地址
    quill.insertEmbed(length, "image", import.meta.env.VITE_APP_BASE_API + res.fileName)
    // 调整光标到最后
    quill.setSelection(length + 1)
  } else {
    modal.msgError("图片插入失败")
  }
}

// 上传失败处理
function handleUploadError() {
  modal.msgError("图片插入失败")
}

// 粘贴板包含图片时：阻止默认粘贴，改为直接上传图片
function handlePasteCapture(e) {
  const clipboard = e.clipboardData || window.clipboardData
  if (clipboard && clipboard.items) {
    for (let i = 0; i < clipboard.items.length; i++) {
      const item = clipboard.items[i]
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault()
        const file = item.getAsFile()
        insertImage(file)
      }
    }
  }
}

function insertImage(file) {
  const formData = new FormData()
  formData.append("file", file)
  axios.post(uploadUrl.value, formData, { headers: { "Content-Type": "multipart/form-data", Authorization: headers.value.Authorization } }).then(res => {
    handleUploadSuccess(res.data)
  })
}
</script>

<style>
.editor-img-uploader {
  display: none;
}
.editor, .ql-toolbar {
  white-space: pre-wrap !important;
  line-height: normal !important;
}
.quill-img {
  display: none;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}
.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}
.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}
.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}
.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>
