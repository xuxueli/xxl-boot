<!--
  组件：IconSelect（SVG 图标选择器）
  功能：按名称搜索并选择 SVG 图标，选中后通过 selected 事件返回图标名称。

  用法：<IconSelect ref="iconSelectRef" @selected="selected" />
-->
<template>
  <div class="icon-body">

    <!-- icon输入 -->
    <el-input
        v-model="iconName"
        class="icon-search"
        clearable
        placeholder="请输入图标名称"
    >
      <template #suffix><i class="el-icon-search el-input__icon"/></template>
    </el-input>

    <!-- icon列表 -->
    <div class="icon-list">
      <div class="list-container">
        <div v-for="item in filteredIcons" class="icon-item-wrapper" :key="item" @click="selectedIcon(item)">
          <div :class="['icon-item', { active: activeIcon === item }]">
            <!-- icon -->
            <SvgIcon :icon-class="item" class-name="icon" style="height: 25px;width: 16px;"/>
            <!-- icon 名称 -->
            <span>{{ item }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>

/**
 * Svg Icon全量导入：
 *
 * import.meta.glob：Vite 提供的一个功能，用于在构建时动态导入模块。
 *    - 语法：import.meta.glob(pattern: string, options?: { eager?: boolean, import?: string })
 *    - 返回值：一个对象，键为匹配的文件路径，值为一个函数，调用该函数会返回一个 Promise，解析为模块的默认导出。
 *
 *  例如：
 *  const modules = import.meta.glob('./path/to/files/*.js')
 *  // modules = {
 *  //   './path/to/files/file1.js': () => import('./path/to/files/file1.js'),
 *  //   './path/to/files/file2.js': () => import('./path/to/files/file2.js'),
 *  //   ...
 *  // }
 */
const modules = import.meta.glob('./../../assets/icons/svg/*.svg')
const icons = Object.keys(modules).map(path =>
  path.split('assets/icons/svg/')[1].split('.svg')[0]
)

/**
 * 传入默认选中 icon
 *
 * defineProps：父传子
 */
const props = defineProps({
  activeIcon: {
    type: String
  }
})

/**
 * 更新选中 icon
 *
 * defineEmits：子传父
 */
const emit = defineEmits(['selected'])

// 搜索关键词
const iconName = ref('')

// 关键词，匹配的icon
const filteredIcons = computed(() => {
  if (!iconName.value) return icons
  return icons.filter(item => item.includes(iconName.value))
})

// 选中图标：派发事件并关闭弹窗
function selectedIcon(name) {
  emit('selected', name)
  document.body.click()
}

// 重置搜索状态（供父组件调用）
function reset() {
  iconName.value = ''
}

/**
 * defineExpose：父传子
 */
defineExpose({
  reset
})
</script>

<style lang='scss' scoped>
.icon-body {
  width: 100%;
  padding: 10px;

  .icon-search {
    position: relative;
    margin-bottom: 5px;
  }

  .icon-list {
    height: 200px;
    overflow: auto;

    .list-container {
      display: flex;
      flex-wrap: wrap;

      .icon-item-wrapper {
        width: calc(100% / 3);
        height: 25px;
        line-height: 25px;
        cursor: pointer;
        display: flex;

        .icon-item {
          display: flex;
          max-width: 100%;
          height: 100%;
          padding: 0 5px;

          &:hover {
            background: #ececec;
            border-radius: 5px;
          }

          .icon {
            flex-shrink: 0;
          }

          span {
            display: inline-block;
            vertical-align: -0.15em;
            fill: currentColor;
            padding-left: 2px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .icon-item.active {
          background: #ececec;
          border-radius: 5px;
        }
      }
    }
  }
}
</style>