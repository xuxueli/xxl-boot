<!--
  页面：LogDetail（日志详情弹窗）
  功能：展示单条日志的详细信息
-->
<template>
  <el-dialog title="日志详细" v-model="dialogVisible" width="700px" append-to-body
    @close="$emit('update:visible', false)">
    <div class="detail-wrap">
      <!-- 基本信息 -->
      <div class="detail-card">
        <div class="detail-card-title"><el-icon><InfoFilled /></el-icon> 基本信息</div>
        <el-row class="detail-row">
          <el-col :span="12">
            <div class="detail-item"><span class="detail-label">日志ID</span><span class="detail-value">{{ form.id }}</span></div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item"><span class="detail-label">日志类型</span><span class="detail-value">{{
              form.type === 0 ? '操作日志' : form.type === 1 ? '登陆日志' : form.type }}</span></div>
          </el-col>
        </el-row>
        <el-row class="detail-row">
          <el-col :span="12">
            <div class="detail-item"><span class="detail-label">系统模块</span><span class="detail-value">{{ form.module }}</span></div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item"><span class="detail-label">日志标题</span><span class="detail-value">{{ form.title }}</span></div>
          </el-col>
        </el-row>
        <el-row class="detail-row">
          <el-col :span="12">
            <div class="detail-item"><span class="detail-label">新增时间</span><span class="detail-value">{{ form.addTime }}</span></div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item"><span class="detail-label">IP地址</span><span class="detail-value">{{ form.ipAddress || form.ip }}</span></div>
          </el-col>
        </el-row>
      </div>

      <!-- 操作人信息 -->
      <div class="detail-card">
        <div class="detail-card-title"><el-icon><User /></el-icon> 操作人信息</div>
        <el-row class="detail-row">
          <el-col :span="12">
            <div class="detail-item"><span class="detail-label">操作人</span><span class="detail-value">{{ form.operator }}</span></div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item"><span class="detail-label">操作IP</span><span class="detail-value">{{ form.ip }}</span></div>
          </el-col>
        </el-row>
      </div>

      <!-- 日志内容 -->
      <div class="detail-card">
        <div class="detail-card-title"><el-icon><Document /></el-icon> 日志内容</div>
        <div class="code-body">
          <div class="code-wrap">
            <div class="code-action">
              <el-button size="small" icon="CopyDocument" @click="copyText(form.content)">复制</el-button>
            </div>
            <pre class="code-pre">{{ form.content || '（无数据）' }}</pre>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
const props = defineProps({
  visible: { type: Boolean, default: false },  /* 弹窗可见性 */
  row: { type: Object, default: () => ({}) }   /* 当前行数据 */
})

const emit = defineEmits(['update:visible'])

// 双向绑定 visible
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const form = computed(() => props.row || {})

/** 复制文本到剪贴板 */
function copyText(str) {
  const text = str || ''
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => ElMessage({ message: '已复制', type: 'success', duration: 1500 }))
  } else {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    ElMessage({ message: '已复制', type: 'success', duration: 1500 })
  }
}
</script>
