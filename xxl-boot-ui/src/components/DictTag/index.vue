<!--
  组件：DictTag（字典标签）
  功能：根据字典选项数组，将字典值渲染为 el-tag 或纯文本。
        支持单值、数组、逗号分隔字符串三种输入格式。
  用法：<DictTag :options="sys_normal_disable" :value="scope.row.status" />
-->
<template>
  <div>
    <template v-for="(item, index) in options">
      <template v-if="isValueMatch(item.value)">
        <span
          v-if="(item.elTagType == 'default' || item.elTagType == '') && (item.elTagClass == '' || item.elTagClass == null)"
          :key="item.value"
          :index="index"
          :class="item.elTagClass"
        >{{ item.label + " " }}</span>
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
    <template v-if="unmatch && showValue">
      {{ unmatchArray | handleArray }}
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
  // 未匹配时是否显示原始 value
  showValue: {
    type: Boolean,
    default: true,
  },
  // 字符串分隔符：value 为逗号分隔字符串时使用
  separator: {
    type: String,
    default: ",",
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
  // 没有value不显示
  if (props.value === null || typeof props.value === 'undefined' || props.value === '' || !Array.isArray(props.options) || props.options.length === 0) return false
  // 传入值为数组
  let unmatch = false // 添加一个标志来判断是否有未匹配项
  values.value.forEach(item => {
    if (!props.options.some(v => v.value == item)) {
      unmatchArray.value.push(item)
      unmatch = true // 如果有未匹配项，将标志设置为true
    }
  })
  return unmatch // 返回标志的值
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
  return values.value.some(val => val == itemValue)
}
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
