<!--
  组件：HeaderMessage（站内消息）
  功能：顶部导航栏铃铛图标，hover 弹出未读消息列表，支持标记已读、全部已读、预览详情
-->
<template>
  <div>
    <!-- popover 面板：鼠标悬停触发 -->
    <el-popover
      ref="messagePopover"
      placement="bottom-end"
      :width="320"
      :trigger="'manual' as any"
      v-model:visible="messageVisible"
      popper-class="message-popover"
    >
      <!-- popover 触发器 -->
      <template #reference>
        <div class="right-menu-item hover-effect message-trigger" @mouseenter="onMessageEnter" @mouseleave="onMessageLeave">
          <!-- 图标：铃铛 -->
          <SvgIcon icon-class="bell" />
          <!-- 未读数量角标 -->
          <span v-if="unreadCount > 0" class="message-badge">{{ unreadCount }}</span>
        </div>
      </template>

      <!-- 面板头部：标题 + 全部已读按钮 -->
      <div class="message-header">
        <span class="message-title">站内消息</span>
        <span class="message-mark-all" @click="markAllRead">全部已读</span>
      </div>

      <!-- 加载中 -->
      <div v-if="messageLoading" class="message-loading">
        <el-icon class="is-loading">
          <Loading />
        </el-icon>
        加载中...
      </div>

      <!-- 空状态 -->
      <div v-else-if="messageList.length === 0" class="message-empty">
        <el-icon style="font-size: 24px; display: block; margin-bottom: 6px">
          <Postcard />
        </el-icon>
        暂无公告
      </div>

      <!-- 公告列表 -->
      <div v-else>
        <div
          v-for="item in messageList"
          :key="item.id"
          class="message-item"
          :class="{ 'is-read': item.isRead }"
          @click="previewMessage(item)"
        >
          <!-- 公告标签 -->
          <el-tag size="small" :type="item.category === 1 ? 'warning' : 'success'" class="message-tag">
            {{ item.category === 1 ? '通知' : '公告' }}
          </el-tag>
          <!-- 标题 / 时间 -->
          <span class="message-item-title">{{ item.title }}</span>
          <span class="message-item-date">{{ item.addTime }}</span>
        </div>
      </div>
    </el-popover>

    <!-- 公告详情抽屉 -->
    <HeaderMessageDetail ref="messageViewRef" />
  </div>
</template>

<script setup lang="ts">
import HeaderMessageDetail from './HeaderMessageDetail.vue'
import { listMessageTop, markMessageRead, markMessageReadAll } from '@/api/system/message'
import type { Message } from '@/types/api'
import type { PopoverInstance } from 'element-plus'
import { onMounted, ref } from 'vue'

/*
 * 站内消息项：Message + 本地已读标记
 */
type MessageItem = Message & { isRead?: boolean }

const messagePopover = ref<PopoverInstance | null>(null) /* popover 实例引用 */
const messageList = ref<MessageItem[]>([]) /* 公告列表 */
const unreadCount = ref(0) /* 未读数量 */
const messageLoading = ref(false) /* 加载状态 */
const messageVisible = ref(false) /* popover 显隐 */
const messageLeaveTimer = ref<ReturnType<typeof setTimeout> | null>(null) /* 延时关闭定时器 */
const messageViewRef = ref<InstanceType<typeof HeaderMessageDetail> | null>(null) /* 抽屉组件引用 */

/*
 * 加载顶部公告列表，统计未读数
 */
function loadMessageTop() {
  messageLoading.value = true
  listMessageTop()
    .then((res) => {
      messageList.value = res.data || []
      unreadCount.value = messageList.value.filter((n) => !n.isRead).length
    })
    .finally(() => {
      messageLoading.value = false
    })
}

onMounted(() => loadMessageTop())

/*
 * 鼠标移入铃铛：显示 popover，绑定 popover 内的 hover 事件实现延时关闭
 */
function onMessageEnter() {
  clearTimeout(messageLeaveTimer.value ?? undefined)
  messageVisible.value = true

  // DOM加载完成后触发
  /*nextTick(() => {
    // 鼠标移入 popover 时清除定时器，移出时重新设置定时器
    const popper = messagePopover.value?.popperRef?.contentRef
    if (popper && !popper._messageBound) {
      popper._messageBound = true
      popper.addEventListener('mouseenter', () => clearTimeout(messageLeaveTimer.value))
      popper.addEventListener('mouseleave', () => {
        messageLeaveTimer.value = setTimeout(() => {
          messageVisible.value = false
        }, 300)
      })
    }
  })*/
}

/*
 * 鼠标移出铃铛：延迟关闭，给移入 popover 留出时间
 */
function onMessageLeave() {
  messageLeaveTimer.value = setTimeout(() => {
    messageVisible.value = false
  }, 1000)
}

/*
 * 点击公告：未读则标记已读，预览详情
 */
function previewMessage(item: MessageItem) {
  if (!item.isRead) {
    // 已读标记
    markMessageRead(item.id as number).catch(() => {})

    // 更新已读列表
    const idx = messageList.value.indexOf(item)
    if (idx !== -1) messageList.value[idx] = { ...item, isRead: true }

    // 未读数更新
    unreadCount.value = Math.max(0, unreadCount.value - 1)
  }

  // 预览公告
  messageViewRef.value?.open(item.id as number)
}

/*
 * 全部已读：批量标记并更新本地状态
 */
function markAllRead() {
  // 标记全部已读
  const ids = messageList.value.map((n) => n.id).join(',')
  if (!ids) return
  markMessageReadAll(ids).catch(() => {})

  // 本地处理：数据 + 计数
  messageList.value = messageList.value.map((n) => ({ ...n, isRead: true }))
  unreadCount.value = 0
}
</script>

<style lang="scss" scoped>
.message-trigger {
  position: relative;
  transform: translateX(-6px);

  .svg-icon {
    width: 1.2em;
    height: 1.2em;
    vertical-align: -0.2em;
  }

  .message-badge {
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

.message-popover {
  padding: 0 !important;
}

.message-popover .message-header {
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

.message-popover .message-mark-all {
  font-size: 12px;
  color: var(--el-color-primary);
  font-weight: normal;
  cursor: pointer;
}

.message-popover .message-mark-all:hover {
  color: #2b7cc1;
}

.message-popover .message-loading,
.message-popover .message-empty {
  padding: 24px;
  text-align: center;
  color: #bbb;
  font-size: 12px;
  line-height: 1.8;
}

.message-popover .message-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background 0.15s;
}

.message-popover .message-item:last-child {
  border-bottom: none;
}

.message-popover .message-item:hover {
  background: #f7f9fb;
}

.message-popover .message-item.is-read .message-tag,
.message-popover .message-item.is-read .message-item-title,
.message-popover .message-item.is-read .message-item-date {
  opacity: 0.45;
  filter: grayscale(1);
  color: #999;
}

.message-popover .message-tag {
  flex-shrink: 0;
}

.message-popover .message-item-title {
  flex: 1;
  font-size: 12px;
  color: #333;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.message-popover .message-item-date {
  flex-shrink: 0;
  font-size: 11px;
  color: #bbb;
}
</style>
