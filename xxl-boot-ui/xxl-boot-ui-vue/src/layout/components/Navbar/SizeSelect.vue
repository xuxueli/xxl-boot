<!--
  组件：SizeSelect（布局尺寸选择器）
  功能：顶部导航栏下拉菜单，切换 large / default / small 三种布局尺寸
-->
<template>
  <div>
    <el-dropdown trigger="click" @command="handleSetSize">
      <!-- icon -->
      <div class="size-icon--style">
        <SvgIcon class-name="size-icon" icon-class="size" />
      </div>
      <!-- 下拉菜单 -->
      <template #dropdown>
        <el-dropdown-menu>
          <!-- 当前选中项 disabled，不可再点击 -->
          <el-dropdown-item v-for="item of sizeOptions" :key="item.value" :disabled="size === item.value" :command="item.value">
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store'
import modal from '@/utils/modal'
import { computed, ref } from 'vue'
import { t } from '@/i18n'
import { SvgIcon } from '@/components'

const appStore = useAppStore()
const size = computed(() => appStore.size)
/* 可选尺寸列表 */
const sizeOptions = ref([
  { label: t('layout.size.large'), value: 'large' },
  { label: t('layout.size.default'), value: 'default' },
  { label: t('layout.size.small'), value: 'small' }
])

/*
 * 切换布局尺寸：保存后刷新页面生效
 */
function handleSetSize(size: string) {
  modal.loading(t('layout.size.setting'))
  appStore.setSize(size)
  setTimeout(function () {
    window.location.reload()
  }, 500)
}
</script>

<style lang="scss" scoped>
.size-icon--style {
  font-size: 18px;
  line-height: 50px;
  padding-right: 7px;
}
</style>
