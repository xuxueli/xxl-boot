<!--
  页面：LogDetail（日志详情弹窗）
  功能：展示单条日志的详细信息
-->
<template>
  <el-dialog :title="t('system.log.detailTitle')" v-model="visible" width="700px" append-to-body>
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
              <span class="detail-label">{{ t('system.log.logModule') }}</span><span class="detail-value">{{ moduleMap[row.module] || row.module }}</span>
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
import { t } from '@/i18n'
import modal from '@/utils/modal'

/**
 * 弹窗显隐：v-model:xxx + defineModel 双向绑定
 * ---
 *
 * defineModel，读写自动与父组件 v-model:visible 同步
 *
 * 父组件用法：
 *   <LogDetail
 *     v-model:visible="detail.visible"
 *     :row="detail.row"
 *     :module-map="moduleDict.map"
 *   />
 *
 *   - visible：defineModel，读=父传值，写=自动发 update:visible 给父
 *   - row / moduleMap：普通 props，只读传入
 */
const visible = defineModel('visible', { type: Boolean, default: false })

/** 组件入参类型 */
interface DetailProps {
  row?: any
  moduleMap?: Record<number | string, string | undefined>
}

/**
 * 组件入参: 通过 :xxx + defineProps 单项数据同步
 */
const props = withDefaults(defineProps<DetailProps>(), {
  row: () => ({}) /* 当前行数据 */,
  moduleMap: () => ({}) /* 系统模块编码 → 名称映射 */
})

/**
 * 复制文本到剪贴板
 */
function copyText(str: string | undefined) {
  const text = str || ''
  // 优先使用 Clipboard API，不支持时降级为 execCommand
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => modal.msgSuccess(t('system.log.copied')))
  } else {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    modal.msgSuccess(t('system.log.copied'))
  }
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
