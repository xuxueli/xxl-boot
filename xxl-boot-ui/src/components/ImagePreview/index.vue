<!--
  组件：ImagePreview（图片预览）
  功能：基于 el-image 的图片预览组件，支持单张/多张图片（逗号分隔），自动拼接 API 基础路径。
  用法：<ImagePreview :src="item.url" width="100px" height="100px" />
-->
<template>
  <el-image
    :src="`${realSrc}`"
    fit="cover"
    :style="`width:${realWidth};height:${realHeight};`"
    :preview-src-list="realSrcList"
    preview-teleported
  >
    <template #error>
      <div class="image-slot">
        <el-icon><picture-filled /></el-icon>
      </div>
    </template>
  </el-image>
</template>

<script setup>
import { isExternal } from "@/utils/validate"

const props = defineProps({
  // 图片 URL，多张用逗号分隔（第一张为主图，全部进入预览列表）
  src: {
    type: String,
    default: ""
  },
  // 显示宽度，如 "100px" 或 100
  width: {
    type: [Number, String],
    default: ""
  },
  // 显示高度，如 "100px" 或 100
  height: {
    type: [Number, String],
    default: ""
  }
})

// 主图 src：取第一张，外部 URL 不拼接 base API
const realSrc = computed(() => {
  if (!props.src) {
    return
  }
  let real_src = props.src.split(",")[0]
  if (isExternal(real_src)) {
    return real_src
  }
  return import.meta.env.VITE_APP_BASE_API + real_src
})

// 预览列表：所有图片，外部 URL 原样保留，内部路径拼接 base API
const realSrcList = computed(() => {
  if (!props.src) {
    return
  }
  let real_src_list = props.src.split(",")
  let srcList = []
  real_src_list.forEach(item => {
    if (isExternal(item)) {
      return srcList.push(item)
    }
    return srcList.push(import.meta.env.VITE_APP_BASE_API + item)
  })
  return srcList
})

const realWidth = computed(() =>
  typeof props.width == "string" ? props.width : `${props.width}px`
)

const realHeight = computed(() =>
  typeof props.height == "string" ? props.height : `${props.height}px`
)
</script>

<style lang="scss" scoped>
.el-image {
  border-radius: 5px;
  background-color: #ebeef5;
  box-shadow: 0 0 5px 1px #ccc;
  :deep(.el-image__inner) {
    transition: all 0.3s;
    cursor: pointer;
    &:hover {
      transform: scale(1.2);
    }
  }
  :deep(.image-slot) {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: #909399;
    font-size: 30px;
  }
}
</style>
