<!--
  组件：图标选择弹窗
  功能：展示 Element Plus 图标列表，按名称搜索并选择
-->
<template>
  <div class="icon-dialog">
    <el-dialog v-model="value" width="980px" :close-on-click-modal="false" :modal-append-to-body="false" @open="onOpen" @close="onClose">
      <!-- 选择 -->
      <template #header="{ close, titleId, titleClass }">
        选择图标
        <el-input v-model="key" size="small" :style="{ width: '260px' }" placeholder="请输入图标名称" prefix-icon="Search" clearable />
      </template>

      <!-- 图标列表 -->
      <ul class="icon-ul">
        <li v-for="icon in iconList" :key="icon" :class="active === icon ? 'active-item' : ''" @click="onSelect(icon)">
          <div>
            <el-icon :size="30">
              <component :is="icon" />
            </el-icon>
            <div>{{ icon }}</div>
          </div>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
/** 图标选择弹窗 - 逻辑 */
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { ref, watch } from 'vue'

const iconList = ref<string[]>([]) /* 当前展示的图标列表 */
const originList: string[] = [] /* 全量图标列表 */
const key = ref('') /* 搜索关键词 */
const active = ref('') /* 当前选中图标 */
const emit = defineEmits(['select'])
const value = defineModel<boolean>()

/* 初始化：加载所有 Element Plus 图标 */
for (const [key] of Object.entries(ElementPlusIconsVue)) {
  iconList.value.push(key)
  originList.push(key)
}

function onOpen() {}
function onClose() {}

/** 选择图标 */
function onSelect(icon: string) {
  active.value = icon
  emit('select', icon)
  value.value = false
}

/* 搜索过滤 */
watch(key, (val) => {
  if (val) {
    iconList.value = originList.filter((name) => name.indexOf(val) > -1)
  } else {
    iconList.value = originList
  }
})
</script>
<style lang="scss" scoped>
.icon-ul {
  margin: 0;
  padding: 0;
  font-size: 0;

  li {
    list-style-type: none;
    text-align: center;
    font-size: 14px;
    display: inline-flex;
    width: 16.66%;
    box-sizing: border-box;
    height: 108px;
    padding: 6px 6px 6px 6px;
    cursor: pointer;
    overflow: hidden;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #f2f2f2;
    }

    &.active-item {
      background: #e1f3fb;
      color: #7a6df0;
    }

    i {
      font-size: 30px;
      line-height: 50px;
      margin-bottom: 10px;
    }
  }
}

.icon-dialog {
  :deep() {
    .el-dialog {
      border-radius: 8px;
      margin-bottom: 0;
      margin-top: 4vh !important;
      display: flex;
      flex-direction: column;
      max-height: 92vh;
      overflow: hidden;
      box-sizing: border-box;

      .el-dialog__header {
        padding-top: 14px;
      }

      .el-dialog__body {
        margin: 0 20px 20px 20px;
        padding: 0;
        overflow: auto;
      }
    }
  }
}
</style>
