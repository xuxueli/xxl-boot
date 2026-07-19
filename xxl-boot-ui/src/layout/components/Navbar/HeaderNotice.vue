<!--
  组件：HeaderNotice（通知公告）
  功能：顶部导航栏铃铛图标，hover 弹出未读公告列表，支持标记已读、全部已读、预览详情
-->
<template>
  <div>
    <!-- popover 面板：鼠标悬停触发 -->
    <el-popover ref="noticePopover" placement="bottom-end" :width="320" trigger="manual" v-model:visible="noticeVisible"
                popper-class="notice-popover">

      <!-- popover 触发器 -->
      <template #reference>
        <div class="right-menu-item hover-effect notice-trigger" @mouseenter="onNoticeEnter"
             @mouseleave="onNoticeLeave">
          <!-- 图标：铃铛 -->
          <svg-icon icon-class="bell"/>
          <!-- 未读数量角标 -->
          <span v-if="unreadCount > 0" class="notice-badge">{{ unreadCount }}</span>
        </div>
      </template>

      <!-- 面板头部：标题 + 全部已读按钮 -->
      <div class="notice-header">
        <span class="notice-title">通知公告</span>
        <span class="notice-mark-all" @click="markAllRead">全部已读</span>
      </div>

      <!-- 加载中 -->
      <div v-if="noticeLoading" class="notice-loading">
        <el-icon class="is-loading">
          <Loading/>
        </el-icon>
        加载中...
      </div>

      <!-- 空状态 -->
      <div v-else-if="noticeList.length === 0" class="notice-empty">
        <el-icon style="font-size:24px;display:block;margin-bottom:6px;">
          <Postcard/>
        </el-icon>
        暂无公告
      </div>

      <!-- 公告列表 -->
      <div v-else>
        <div v-for="item in noticeList" :key="item.noticeId" class="notice-item" :class="{ 'is-read': item.isRead }"
             @click="previewNotice(item)">
          <!-- 公告标签 -->
          <el-tag size="small" :type="item.noticeType === '1' ? 'warning' : 'success'" class="notice-tag">
            {{ item.noticeType === '1' ? '通知' : '公告' }}
          </el-tag>
          <!-- 标题 / 时间 -->
          <span class="notice-item-title">{{ item.noticeTitle }}</span>
          <span class="notice-item-date">{{ item.createTime }}</span>
        </div>
      </div>

    </el-popover>

    <!-- 公告详情抽屉 -->
    <HeaderNoticeDetail ref="noticeViewRef"/>

  </div>
</template>

<script setup>
import {Loading, Postcard} from '@element-plus/icons-vue'
import HeaderNoticeDetail from './HeaderNoticeDetail.vue'
import {listNoticeTop, markNoticeRead, markNoticeReadAll} from '@/api/sys/notice'

const noticePopover = ref(null)         /* popover 实例引用 */
const noticeList = ref([])              /* 公告列表 */
const unreadCount = ref(0)              /* 未读数量 */
const noticeLoading = ref(false)        /* 加载状态 */
const noticeVisible = ref(false)        /* popover 显隐 */
const noticeLeaveTimer = ref(null)      /* 延时关闭定时器 */
const noticeViewRef = ref(null)         /* 抽屉组件引用 */

/*
* 加载顶部公告列表，统计未读数
*/
function loadNoticeTop() {
  noticeLoading.value = true
  listNoticeTop().then(res => {
    noticeList.value = res.data || []
    unreadCount.value = res.unreadCount !== undefined ? res.unreadCount : noticeList.value.filter(n => !n.isRead).length
  }).finally(() => {
    noticeLoading.value = false
  })
}

onMounted(() => loadNoticeTop())

/*
* 鼠标移入铃铛：显示 popover，绑定 popover 内的 hover 事件实现延时关闭
*/
function onNoticeEnter() {
  clearTimeout(noticeLeaveTimer.value)
  noticeVisible.value = true

  // DOM加载完成后触发
  /*nextTick(() => {
    // 鼠标移入 popover 时清除定时器，移出时重新设置定时器
    const popper = noticePopover.value?.popperRef?.contentRef
    if (popper && !popper._noticeBound) {
      popper._noticeBound = true
      popper.addEventListener('mouseenter', () => clearTimeout(noticeLeaveTimer.value))
      popper.addEventListener('mouseleave', () => {
        noticeLeaveTimer.value = setTimeout(() => {
          noticeVisible.value = false
        }, 300)
      })
    }
  })*/
}

/*
* 鼠标移出铃铛：延迟关闭，给移入 popover 留出时间
*/
function onNoticeLeave() {
  noticeLeaveTimer.value = setTimeout(() => {
    noticeVisible.value = false
  }, 500)
}

/*
* 点击公告：未读则标记已读，预览详情
*/
function previewNotice(item) {
  if (!item.isRead) {
    // 已读标记
    markNoticeRead(item.noticeId).catch(() => {
    })

    // 更新已读列表
    const idx = noticeList.value.indexOf(item)
    if (idx !== -1) noticeList.value[idx] = {...item, isRead: true}

    // 未读数更新
    unreadCount.value = Math.max(0, unreadCount.value - 1)
  }

  // 预览公告
  noticeViewRef.value.open(item.noticeId)
}

/*
* 全部已读：批量标记并更新本地状态
*/
function markAllRead() {
  // 标记全部已读
  const ids = noticeList.value.map(n => n.noticeId).join(',')
  if (!ids) return
  markNoticeReadAll(ids).catch(() => {
  })

  // 本地处理：数据 + 计数
  noticeList.value = noticeList.value.map(n => ({...n, isRead: true}))
  unreadCount.value = 0
}
</script>

<style lang="scss" scoped>
.notice-trigger {
  position: relative;
  transform: translateX(-6px);

  .svg-icon {
    width: 1.2em;
    height: 1.2em;
    vertical-align: -0.2em;
  }

  .notice-badge {
    position: absolute;
    top: 7px;
    right: -3px;
    background: #f56c6c;
    color: #fff;
    border-radius: 10px;
    font-size: 10px;
    height: 16px;
    line-height: 16px;
    padding: 0 4px;
    min-width: 16px;
    text-align: center;
    white-space: nowrap;
    pointer-events: none;
  }
}

.notice-popover {
  padding: 0 !important;
}

.notice-popover .notice-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #f7f9fb;
  border-bottom: 1px solid #eee;
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.notice-popover .notice-mark-all {
  font-size: 12px;
  color: var(--el-color-primary);
  font-weight: normal;
  cursor: pointer;
}

.notice-popover .notice-mark-all:hover {
  color: #2b7cc1;
}

.notice-popover .notice-loading,
.notice-popover .notice-empty {
  padding: 24px;
  text-align: center;
  color: #bbb;
  font-size: 12px;
  line-height: 1.8;
}

.notice-popover .notice-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background 0.15s;
}

.notice-popover .notice-item:last-child {
  border-bottom: none;
}

.notice-popover .notice-item:hover {
  background: #f7f9fb;
}

.notice-popover .notice-item.is-read .notice-tag,
.notice-popover .notice-item.is-read .notice-item-title,
.notice-popover .notice-item.is-read .notice-item-date {
  opacity: 0.45;
  filter: grayscale(1);
  color: #999;
}

.notice-popover .notice-tag {
  flex-shrink: 0;
}

.notice-popover .notice-item-title {
  flex: 1;
  font-size: 12px;
  color: #333;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.notice-popover .notice-item-date {
  flex-shrink: 0;
  font-size: 11px;
  color: #bbb;
}
</style>
