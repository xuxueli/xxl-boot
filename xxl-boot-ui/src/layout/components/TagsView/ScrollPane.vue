<!--
  组件：ScrollPane（标签页滚动容器）
  功能：水平滚动容器，支持滚轮/按钮滚动、平滑滚动到指定标签、
        自动定位标签使目标标签完整可见
-->
<template>
  <!--
    el-scrollbar: Element Plus 提供的自定义滚动条组件。封装了原生滚动条，提供了更美观且可定制的滚动体验。
  -->
  <el-scrollbar
    ref="scrollContainer"
    :vertical="false"
    class="scroll-container"
    @wheel.prevent="handleScroll"
  >
    <!--
      slot: 默认插槽。
      父组件传入的内容（如一系列标签、卡片等）将渲染在此处。
      为了实现横向滚动，插槽内的根元素通常需要设置为 display: inline-block 或 flex 布局，
      且总宽度需超过 el-scrollbar 的可视宽度。
    -->
    <slot />
  </el-scrollbar>
</template>

<script setup>
import { useTagsViewStore } from '@/store'

const tagAndTagSpacing = ref(4)
const scrollContainer = ref(null)
const scrollWrapper = computed(() => scrollContainer.value.$refs.wrapRef)
const emits = defineEmits(['scroll', 'updateArrows'])

onMounted(() => {
  scrollWrapper.value.addEventListener('scroll', emitScroll, true)
})
onBeforeUnmount(() => {
  scrollWrapper.value.removeEventListener('scroll', emitScroll)
})

/*
* 触发父组件箭头状态更新
*/
const emitScroll = () => {
  emits('scroll')
  emits('updateArrows')
}

/*
* 缓动函数：easeInOutQuad
*/
function ease(t, b, c, d) {
  t /= d / 2
  if (t < 1) return c / 2 * t * t + b
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
}

/*
* 平滑滚动到指定位置，300ms 动画
*/
function smoothScrollTo(target) {
  const $scrollWrapper = scrollWrapper.value
  const start = $scrollWrapper.scrollLeft
  const distance = target - start
  const duration = 300
  let startTime = null

  function step(timestamp) {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime
    $scrollWrapper.scrollLeft = ease(elapsed, start, distance, duration)
    if (elapsed < duration) {
      requestAnimationFrame(step)
    } else {
      $scrollWrapper.scrollLeft = target
      emits('updateArrows')
    }
  }
  requestAnimationFrame(step)
}

/*
* 滚轮事件：累积 scrollLeft
*/
function handleScroll(e) {
  const eventDelta = e.wheelDelta || -e.deltaY * 40
  scrollWrapper.value.scrollLeft += eventDelta / 4
  emits('updateArrows')
}

const tagsViewStore = useTagsViewStore()
const visitedViews = computed(() => tagsViewStore.visitedViews)

/*
* 将目标标签滚动到可视区域
*/
function moveToTarget(currentTag) {
  const $container = scrollContainer.value.$el
  const $containerWidth = $container.offsetWidth
  const $scrollWrapper = scrollWrapper.value

  if (visitedViews.value.length === 0) return
  const firstTag = visitedViews.value[0]
  const lastTag = visitedViews.value[visitedViews.value.length - 1]

  /* 首尾标签直接滚动到起点/终点 */
  if (firstTag === currentTag) {
    smoothScrollTo(0)
  } else if (lastTag === currentTag) {
    smoothScrollTo($scrollWrapper.scrollWidth - $containerWidth)
  } else {
    /* 中间标签：计算前后相邻标签位置，确保目标完整可见 */
    const tagListDom = document.getElementsByClassName('tags-view-item')
    const currentIndex = visitedViews.value.findIndex(item => item === currentTag)
    let prevTag = null
    let nextTag = null
    for (const k in tagListDom) {
      if (k !== 'length' && Object.hasOwnProperty.call(tagListDom, k)) {
        if (tagListDom[k].dataset.path === visitedViews.value[currentIndex - 1].path) prevTag = tagListDom[k]
        if (tagListDom[k].dataset.path === visitedViews.value[currentIndex + 1].path) nextTag = tagListDom[k]
      }
    }
    /* 目标超出右侧可见区 -> 向右滚；超出左侧 -> 向左滚 */
    const afterNext = nextTag.offsetLeft + nextTag.offsetWidth + tagAndTagSpacing.value
    const beforePrev = prevTag.offsetLeft - tagAndTagSpacing.value
    if (afterNext > $scrollWrapper.scrollLeft + $containerWidth) {
      smoothScrollTo(afterNext - $containerWidth)
    } else if (beforePrev < $scrollWrapper.scrollLeft) {
      smoothScrollTo(beforePrev)
    }
  }
}

/*
* 滚动到最左 / 最右
*/
function scrollToStart() { smoothScrollTo(0) }
function scrollToEnd() { smoothScrollTo(scrollWrapper.value.scrollWidth - scrollWrapper.value.clientWidth) }
/*
* 返回左右箭头是否可用
*/
function getScrollState() {
  const $scrollWrapper = scrollWrapper.value
  return {
    canLeft: $scrollWrapper.scrollLeft > 0,
    canRight: $scrollWrapper.scrollLeft < $scrollWrapper.scrollWidth - $scrollWrapper.clientWidth - 1
  }
}

/**
 * defineExpose：‌显式地向父组件暴露子组件内部属性或方法的编译宏。
 *
 *  <pre>
 *      <ScrollPane ref="scrollPaneRef" />
 *      ...
 *      const scrollPaneRef = ref(null)
 *      ...
 *      scrollPaneRef.value.xxx(param)
 *  </pre>
 */
defineExpose({ moveToTarget, scrollToStart, scrollToEnd, getScrollState })
</script>


<style lang='scss' scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  :deep(.el-scrollbar__bar) {
    bottom: 0px;
  }
  :deep(.el-scrollbar__wrap) {
    height: 34px;
    display: flex;
    align-items: center;
  }
}
</style>