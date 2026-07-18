<!--
  组件：SizeSelect（布局尺寸选择器）
  功能：顶部导航栏下拉菜单，切换 large / default / small 三种布局尺寸
-->
<template>
  <div>
    <el-dropdown trigger="click" @command="handleSetSize">
      <div class="size-icon--style">
        <svg-icon class-name="size-icon" icon-class="size" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item of sizeOptions" :key="item.value" :disabled="size === item.value" :command="item.value">
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { useAppStore } from '@/store'
import modal from '@/utils/modal'

const appStore = useAppStore()
const size = computed(() => appStore.size)
const sizeOptions = ref([
  { label: "较大", value: "large" },
  { label: "默认", value: "default" },
  { label: "稍小", value: "small" },
])

/*
* 切换布局尺寸：保存后刷新页面生效
*/
function handleSetSize(size) {
  modal.loading("正在设置布局大小，请稍候...")
  appStore.setSize(size)
  setTimeout("window.location.reload()", 1000)
}
</script>

<style lang='scss' scoped>
.size-icon--style {
  font-size: 18px;
  line-height: 50px;
  padding-right: 7px;
}
</style>
