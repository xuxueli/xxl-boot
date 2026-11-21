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
              ><span class="detail-value">{{ enumTitle(typeOptions, row.type) }}</span>
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
              <el-button size="small" icon="CopyDocument" v-copyText="row.content || ''" v-copyText:callback="copyTextSuccess">{{ t('common.copy') }}</el-button>
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
import { enumTitle, useEnumOption } from '@/composables/useEnumOption'
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

// 组件入参默认值
withDefaults(defineProps<DetailProps>(), {
  row: () => ({}),
  moduleMap: () => ({})
})

// 日志类型选项，由后端枚举接口加载
const { LogTypeEnum: typeOptions } = useEnumOption('LogTypeEnum')

/** 复制成功提示 */
function copyTextSuccess() {
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
