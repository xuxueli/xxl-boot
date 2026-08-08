<!--
  页面：LogDetail（日志详情弹窗）
  功能：展示单条日志的详细信息
-->
<template>
  <el-dialog title="日志详细" v-model="visible" width="700px" append-to-body>
    <div class="detail-wrap">
      <!-- 基本信息 -->
      <div class="detail-card">
        <div class="detail-card-title">
          <el-icon><InfoFilled /></el-icon> 基本信息
        </div>
        <el-row class="detail-row">
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">日志类型</span
              ><span class="detail-value">{{ row.type === 0 ? '操作日志' : row.type === 1 ? '登陆日志' : row.type }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">系统模块</span><span class="detail-value">{{ moduleMap[row.module] || row.module }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row class="detail-row">
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">日志编号</span><span class="detail-value">{{ row.id }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">日志标题</span><span class="detail-value">{{ row.title }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 操作人信息 -->
      <div class="detail-card">
        <div class="detail-card-title">
          <el-icon><User /></el-icon> 操作人信息
        </div>
        <el-row class="detail-row">
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">操作人</span><span class="detail-value">{{ row.operator }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">操作时间</span><span class="detail-value">{{ row.addTime }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row class="detail-row">
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">操作IP</span><span class="detail-value">{{ row.ip }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">操作地址</span><span class="detail-value">{{ row.ipAddress || row.ip }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 日志内容 -->
      <div class="detail-card">
        <div class="detail-card-title">
          <el-icon><Document /></el-icon> 日志内容
        </div>
        <div class="code-body">
          <div class="code-wrap">
            <div class="code-action">
              <el-button size="small" icon="CopyDocument" @click="copyText(row.content)">复制</el-button>
            </div>
            <pre class="code-pre">{{ row.content || '（无数据）' }}</pre>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
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
    navigator.clipboard.writeText(text).then(() => modal.msgSuccess('已复制'))
  } else {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    modal.msgSuccess('已复制')
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
