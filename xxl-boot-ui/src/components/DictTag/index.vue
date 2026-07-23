<!--
  组件：DictTag（字典标签）
  功能：根据字典选项数组，将字典值渲染为 el-tag 或纯文本。
        支持 "单值、数组、逗号分隔" 字符串三种输入格式。

  用法：<DictTag :options="sys_normal_disable" :value="scope.row.status" />
-->
<template>
  <div>
    <!-- 遍历字典选项，匹配当前值则渲染标签 -->
    <template v-for="(item, index) in options">
      <template v-if="isValueMatch(item.value)">
        <!-- 默认样式(tagType=default 且无自定义class)时使用纯文本，免去多余 el-tag 结构 -->
        <span
          v-if="(item.elTagType === 'default' || item.elTagType === '') && (item.elTagClass === '' || item.elTagClass === null)"
          :key="item.value"
          :index="index"
          :class="item.elTagClass"
        >{{ item.label + " " }}</span>
        <!-- 有自定义样式时用 el-tag 渲染 -->
        <el-tag
          v-else
          :disable-transitions="true"
          :key="item.value + ''"
          :index="index"
          :type="item.elTagType"
          :class="item.elTagClass"
        >{{ item.label + " " }}</el-tag>
      </template>
    </template>
    <!-- 存在未匹配项且 showValue 开启时，显示原始值 -->
    <template v-if="unmatch && showValue">
      {{ handleArray(unmatchArray) }}
    </template>
  </div>
</template>

<script setup>
// 未匹配字典项的 key 集合
const unmatchArray = ref([])

const props = defineProps({
  // 字典选项列表：[{ value, label, elTagType, elTagClass }]
  options: {
    type: Array,
    default: null,
  },
  // 当前值：支持 Number / String / Array 三种类型
  value: [Number, String, Array],
  // 字符串分隔符：value 为逗号分隔字符串时使用
  separator: {
    type: String,
    default: ",",
  },
  // 未匹配时是否显示原始 value
  showValue: {
    type: Boolean,
    default: true,
  }
})

// 将 props.value 统一转为字符串数组，方便后续匹配
const values = computed(() => {
  if (props.value === null || typeof props.value === 'undefined' || props.value === '') return []
  if (typeof props.value === 'number' || typeof props.value === 'boolean') return [props.value]
  return Array.isArray(props.value) ? props.value.map(item => '' + item) : String(props.value).split(props.separator)
})

// 检测是否存在未匹配的字典项，存在时记录到 unmatchArray
const unmatch = computed(() => {
  unmatchArray.value = []
  if (props.value === null
      || typeof props.value === 'undefined'
      || props.value === ''
      || !Array.isArray(props.options)
      || props.options.length === 0) return false
  // 遍历 value 中的每一项，检查是否在 options 中存在
  let unmatch = false
  values.value.forEach(item => {
    if (!props.options.some(v => v.value === item)) {
      unmatchArray.value.push(item)
      unmatch = true
    }
  })
  return unmatch
})

// 数组转空格分隔字符串，用于显示未匹配项
function handleArray(array) {
  if (array.length === 0) return ""
  return array.reduce((pre, cur) => {
    return pre + " " + cur
  })
}

// 判断某个字典值是否与当前 value 匹配
function isValueMatch(itemValue) {
  return values.value.some(val => val === itemValue)
}
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
