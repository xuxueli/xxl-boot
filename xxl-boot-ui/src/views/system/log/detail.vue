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
            <div class="detail-item"><span class="detail-label">日志类型</span><span class="detail-value">{{
              form.type === 0 ? '操作日志' : form.type === 1 ? '登陆日志' : form.type }}</span></div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item"><span class="detail-label">系统模块</span><span class="detail-value">{{ moduleMap[form.module] || form.module }}</span></div>
          </el-col>
        </el-row>
        <el-row class="detail-row">
          <el-col :span="12">
            <div class="detail-item"><span class="detail-label">日志编号</span><span class="detail-value">{{ form.id }}</span></div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item"><span class="detail-label">日志标题</span><span class="detail-value">{{ form.title }}</span></div>
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
            <div class="detail-item"><span class="detail-label">操作时间</span><span class="detail-value">{{ form.addTime }}</span></div>
          </el-col>
        </el-row>
        <el-row class="detail-row">
          <el-col :span="12">
            <div class="detail-item"><span class="detail-label">操作IP</span><span class="detail-value">{{ form.ip }}</span></div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item"><span class="detail-label">操作地址</span><span class="detail-value">{{ form.ipAddress || form.ip }}</span></div>
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
import modal from '@/utils/modal'

/**
 * 组件入参（父->子）：defineProps
 *
 * <pre>
 *     <LogDetail
 *        v-model:visible="detail.visible"
 *        :row="detail.row"
 *        :module-map="moduleDict.map"
 *      />
 *
 *      - :row="..." → 传入 prop row
 *      - :module-map="..." → kebab-case 会自动对应 prop moduleMap（驼峰）
 *      - v-model:visible 本质是 :visible + @update:visible 两条绑定的语法糖
 *           - 说明：v-model:xxx 本质上是 prop 传递 + 事件监听‌（:xxx + @update:xxx） 的语法糖：
 *
 * </pre>
 */
const props = defineProps({
  visible: { type: Boolean, default: false },  /* 弹窗可见性 */
  row: { type: Object, default: () => ({}) },  /* 当前行数据 */
  moduleMap: { type: Object, default: () => ({}) } /* 系统模块编码 → 名称映射 */
})

/**
 * 组件事件（子->父）：defineEmits
 *
 * <pre>
 *      子组件声明并触发（detail.vue）：
 *      const emit = defineEmits(['update:visible'])
 *
 *      // 模板里：el-dialog 关闭时
 *      @close="$emit('update:visible', false)"
 *      // 或 computed 的 set 里
 *      set: (val) => emit('update:visible', val)
 *
 *      - 事件名约定：update:xxx 对应父的 v-model:xxx，是双向绑定的另一半。
 *      - emit('事件名', 参数) 只是发通知，真正改状态的是父。
 * </pre>
 */
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
