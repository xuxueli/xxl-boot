<!--
  组件：HeaderMessageDetail（站内消息详情抽屉）
  功能：从右侧滑出抽屉展示消息完整详情内容
-->
<template>
  <!-- 右侧滑出抽屉，半屏展示 -->
  <el-drawer v-model="visible" title="站内消息详情" direction="rtl" size="50%" append-to-body :before-close="handleClose" class="message-detail-drawer">
    <div v-loading="loading" class="message-detail-drawer__body">
      <!-- 无数据状态 -->
      <div v-if="!detail" class="message-empty">
        <el-icon><Document /></el-icon>
        <span>暂无数据</span>
      </div>

      <!-- 详情内容 -->
      <div v-else class="message-page">

        <!-- 类型标签：通知 / 公告 / 消息 -->
        <div class="message-type-wrap">
          <span v-if="detail.category === 1" class="message-type-tag type-notify">
            <el-icon><Bell /></el-icon> 通知
          </span>
          <span v-else-if="detail.category === 2" class="message-type-tag type-announce">
            <el-icon><Message /></el-icon> 公告
          </span>
          <span v-else class="message-type-tag type-notify">
            <el-icon><Document /></el-icon> 消息
          </span>
        </div>

        <!-- 公告标题 -->
        <h1 class="message-title">{{ detail.title }}</h1>

        <!-- 公告元数据：发布人 / 发布时间 / 状态 -->
        <div class="message-meta">
          <span class="meta-item">
            <el-icon><User /></el-icon>
            <span>{{ detail.sender || '—' }}</span>
          </span>
          <span class="meta-item">
            <el-icon><Clock /></el-icon>
            <span>{{ detail.addTime || '—' }}</span>
          </span>
          <span class="meta-item">
            <span :class="['status-dot', isStatusNormal ? 'status-ok' : 'status-off']"></span>
            <span>{{ isStatusNormal ? '正常' : '已关闭' }}</span>
          </span>
        </div>

        <!-- 装饰分隔线 -->
        <div class="message-divider">
          <span class="message-divider-dot"></span>
          <span class="message-divider-dot"></span>
          <span class="message-divider-dot"></span>
        </div>

        <!-- 公告正文 -->
        <div class="message-body">
          <div v-if="hasContent" class="message-content" v-html="detail.content" />
          <div v-else class="message-empty message-empty--inner">
            <el-icon><Document /></el-icon> 暂无内容
          </div>
        </div>

      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { getMessage } from '@/api/system/message.js'

const visible = ref(false)  /* 抽屉显隐 */
const loading = ref(false)  /* 接口加载状态 */
const detail = ref(null)    /* 消息详情数据 */

/*
* 公告状态：'0' 为正常
*/
const isStatusNormal = computed(() => {
  const status = detail.value && detail.value.status
  return status === '0' || status === 0
})

/*
* 是否有正文内容（非空字符串）
*/
const hasContent = computed(() => {
  const content = detail.value && detail.value.content
  return content != null && String(content).trim() !== ''
})

/*
* 打开详情：支持传入完整公告对象（直接展示）或 messageId（请求接口加载）
*   payload 类型分支：
*     - object → 含 messageContent 则直接展示（预设模式），否则只取 id 发请求
*     - string/number → 视为 messageId 请求接口加载
*/
function open(payload) {
  /* 处理入参 */
  let id = null
  let preset = null
  if (payload != null && typeof payload === 'object') {
    id = payload.messageId
    if (payload.messageContent != null) preset = payload
  } else {
    id = payload
  }
  visible.value = true

  /* 传入 object，直接展示模式：已有完整数据，跳过请求 */
  if (preset) {
    detail.value = preset
    return
  }

  /* 无有效 id 时置空返回 */
  if (id == null || id === '') {
    detail.value = null
    return
  }

  /* 传入 messageId：调接口获取详情 */
  loading.value = true
  detail.value = null
  getMessage(id).then(res => {
    detail.value = res.data
  }).catch(() => {
    detail.value = null
  }).finally(() => {
    loading.value = false
  })

}

/*
* 关闭抽屉：清空详情数据
*/
function handleClose() {
  visible.value = false
  detail.value = null
  loading.value = false
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.message-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 8px 8px 20px;
  animation: message-fade-up 0.28s ease both;
}

@keyframes message-fade-up {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-type-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 12px;
  border-radius: 2px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.type-notify {
  background: #fff8e6;
  color: #b7791f;
  border-left: 3px solid #d97706;
}

.type-announce {
  background: #e8f5e9;
  color: #276749;
  border-left: 3px solid #38a169;
}

.message-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a202c;
  line-height: 1.45;
  margin: 0 0 16px;
  letter-spacing: -0.2px;
}

.message-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 12px 0;
  border-top: 1px solid #e9ecef;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 28px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #718096;
}

.meta-item .el-icon {
  font-size: 12px;
  color: #a0aec0;
}

.status-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-right: 4px;
}

.status-ok {
  background: #38a169;
}

.status-off {
  background: #e53e3e;
}

.message-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.message-divider::before,
.message-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, #dee2e6, transparent);
}

.message-divider-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #cbd5e0;
}

.message-body {
  background: #fff;
  border-radius: 6px;
  padding: 28px 32px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
  min-height: 120px;
}

.message-content {
  font-size: 14px;
  line-height: 1.85;
  color: #2d3748;
  word-break: break-word;
}

.message-content :deep(p) {
  margin: 0 0 1em;
}

.message-content :deep(h1),
.message-content :deep(h2),
.message-content :deep(h3) {
  font-weight: 700;
  color: #1a202c;
  margin: 1.4em 0 0.6em;
}

.message-content :deep(h1) {
  font-size: 18px;
}

.message-content :deep(h2) {
  font-size: 16px;
}

.message-content :deep(h3) {
  font-size: 14px;
}

.message-content :deep(a) {
  color: #3182ce;
  text-decoration: underline;
}

.message-content :deep(a:hover) {
  color: #2b6cb0;
}

.message-content :deep(img) {
  max-width: 100%;
  border-radius: 4px;
  margin: 8px 0;
}

.message-content :deep(ul),
.message-content :deep(ol) {
  padding-left: 20px;
  margin: 0 0 1em;
}

.message-content :deep(li) {
  margin-bottom: 4px;
}

.message-content :deep(blockquote) {
  border-left: 3px solid #cbd5e0;
  margin: 1em 0;
  padding: 6px 16px;
  color: #718096;
  background: #f7fafc;
}

.message-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
  font-size: 13px;
}

.message-content :deep(table th),
.message-content :deep(table td) {
  border: 1px solid #e2e8f0;
  padding: 7px 12px;
}

.message-content :deep(table th) {
  background: #f7fafc;
  font-weight: 600;
}

.message-empty {
  text-align: center;
  padding: 40px 0;
  color: #a0aec0;
  font-size: 13px;
}

.message-empty .el-icon {
  font-size: 28px;
  display: inline-flex;
  margin-bottom: 10px;
}

.message-empty--inner {
  padding: 32px 0;
}

.message-detail-drawer__body {
  height: 100%;
  overflow: auto;
  padding: 10px 16px 22px;
}
</style>

<style lang="scss">
.message-detail-drawer {
  .el-drawer__header {
    margin-bottom: 0;
    padding: 16px 20px;
    border-bottom: 1px solid #ebeef5;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }
  
  .el-drawer__body {
    background: #f5f6f8;
    padding: 0;
  }
}
</style>
