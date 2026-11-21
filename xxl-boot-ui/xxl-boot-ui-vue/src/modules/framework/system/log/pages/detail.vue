<!--
  LogDetail（日志详情弹窗）
  功能：展示单条日志的基本信息、操作人信息与日志内容
  @author xuxueli 2026-11-22
-->
<template>
  <el-dialog :title="t('system.log.detailTitle')" v-model="visible" width="700px" append-to-body :close-on-click-modal="false">
    <div class="detail-wrap">
      <!-- 基本信息 -->
      <div class="detail-card">
        <div class="detail-card-title">
          <el-icon><InfoFilled /></el-icon> {{ t('system.log.basicInfo') }}
        </div>
        <el-row class="detail-row">
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">{{ t('system.log.logType') }}</span
              ><span class="detail-value">{{ row.type === 0 ? t('system.log.operLog') : row.type === 1 ? t('system.log.loginLog') : row.type }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">{{ t('system.log.logModule') }}</span
              ><span class="detail-value">{{ moduleMap[row.module ?? ''] ?? row.module }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row class="detail-row">
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">{{ t('system.log.logId') }}</span><span class="detail-value">{{ row.id }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">{{ t('system.log.logTitle') }}</span><span class="detail-value">{{ row.title }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 操作人信息 -->
      <div class="detail-card">
        <div class="detail-card-title">
          <el-icon><User /></el-icon> {{ t('system.log.operatorInfo') }}
        </div>
        <el-row class="detail-row">
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">{{ t('system.log.operator') }}</span><span class="detail-value">{{ row.operator }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">{{ t('system.log.operateTime') }}</span><span class="detail-value">{{ row.addTime }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row class="detail-row">
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">{{ t('system.log.ip') }}</span><span class="detail-value">{{ row.ip }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">{{ t('system.log.ipAddress') }}</span><span class="detail-value">{{ row.ipAddress || row.ip }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 日志内容 -->
      <div class="detail-card">
        <div class="detail-card-title">
          <el-icon><Document /></el-icon> {{ t('system.log.logContent') }}
        </div>
        <div class="code-body">
          <div class="code-wrap">
            <div class="code-action">
              <el-button size="small" icon="CopyDocument" @click="copyText(row.content)">{{ t('common.copy') }}</el-button>
            </div>
            <pre class="code-pre">{{ row.content || t('system.log.noData') }}</pre>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
defineOptions({ name: 'LogDetail' })
import { t } from '@/i18n'
import modal from '@/utils/modal'
import type { Log } from '../types'

/** 弹窗显隐：与父组件 v-model:visible 双向绑定 */
const visible = defineModel('visible', { type: Boolean, default: false })

/** 组件入参 */
interface DetailProps {
  /** 当前查看的日志行 */
  row?: Log
  /** 系统模块编码 → 名称映射 */
  moduleMap?: Record<number | string, string | undefined>
}

withDefaults(defineProps<DetailProps>(), {
  row: () => ({}),
  moduleMap: () => ({})
})

/**
 * 复制文本到剪贴板
 *
 * @param text 待复制内容，为空时复制空串
 */
function copyText(text?: string) {
  const content = text || ''
  // 优先使用 Clipboard API，不可用或失败时降级为 execCommand
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(content)
      .then(() => modal.msgSuccess(t('system.log.copied')))
      .catch(() => copyByExecCommand(content))
  } else {
    copyByExecCommand(content)
  }
}

/**
 * 兼容旧浏览器的复制实现
 *
 * @param content 待复制内容
 */
function copyByExecCommand(content: string) {
  const textarea = document.createElement('textarea')
  textarea.value = content
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  modal.msgSuccess(t('system.log.copied'))
}
</script>

<style scoped>
.code-body {
  min-height: 350px;
}
.code-wrap {
  min-height: 350px;
}
.code-pre {
  min-height: 350px;
}
</style>
