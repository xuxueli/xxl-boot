<!--
  IconsDialog（图标选择弹窗）
  功能：展示 Element Plus 图标列表，按名称搜索并选择
  @author xuxueli 2026-11-22
-->
<template>
  <div class="icon-dialog">
    <el-dialog v-model="value" width="980px" :close-on-click-modal="false" :modal-append-to-body="false">
      <!-- 弹窗标题：内置关键词搜索 -->
      <template #header>
        {{ t('tool.pagegen.selectIcon') }}
        <el-input v-model="key" size="small" :style="{ width: '260px' }" :placeholder="t('common.inputPlaceholder', [t('common.noun.iconName')])" prefix-icon="Search" clearable />
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
import { t } from '@/i18n'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { ref, watch } from 'vue'

/** 当前展示的图标列表 */
const iconList = ref<string[]>([])
/** 全量图标列表，作为搜索过滤的数据源 */
const originList: string[] = []
/** 搜索关键词 */
const key = ref('')
/** 当前选中图标 */
const active = ref('')

const emit = defineEmits<{ select: [icon: string] }>()
const value = defineModel<boolean>()

// 初始化：一次性收集 Element Plus 全部图标名称
for (const [iconName] of Object.entries(ElementPlusIconsVue)) {
  iconList.value.push(iconName)
  originList.push(iconName)
}

/**
 * 选择图标：回写选中态并关闭弹窗
 *
 * @param icon 图标组件名
 */
function onSelect(icon: string) {
  active.value = icon
  emit('select', icon)
  value.value = false
}

// 关键词变化时按名称包含关系过滤，清空则恢复全量
watch(key, (val) => {
  iconList.value = val ? originList.filter((name) => name.indexOf(val) > -1) : originList
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
