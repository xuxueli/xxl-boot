<!--
  组件：画布可拖拽表单项
  功能：渲染单个表单项/行容器，支持选中、复制、删除
-->
<template>
  <el-col :span="element.span" :class="className" @click.stop="activeItem(element)">
    <!-- 表单项 -->
    <el-form-item
      :label="element.label"
      :label-width="element.labelWidth ? element.labelWidth + 'px' : undefined"
      :required="element.required"
      v-if="element.layout === 'colFormItem'"
    >
      <render :key="element.tag" :conf="element" v-model="element.defaultValue" />
    </el-form-item>

    <!--    行容器 -->
    <el-row :gutter="element.gutter" :class="element.class" @click.stop="activeItem(element)" v-else>
      <span class="component-name"> {{ element.componentName }} </span>
      <draggable
        group="componentsGroup"
        :animation="340"
        :list="element.children"
        class="drag-wrapper"
        item-key="label"
        ref="draggableItemRef"
        :component-data="getComponentData()"
      >
        <template #item="scoped">
          <DraggableItem
            :key="scoped.element.renderKey"
            :drawing-list="element.children!"
            :element="scoped.element"
            :index="index"
            :active-id="activeId"
            :form-conf="formConf"
            @activeItem="activeItem(scoped.element)"
            @copyItem="copyItem(scoped.element, element.children)"
            @deleteItem="deleteItem(scoped.index, element.children)"
          />
        </template>
      </draggable>
    </el-row>

    <!-- 操作按钮 -->
    <span class="drawing-item-copy" title="复制" @click.stop="copyItem(element)">
      <el-icon><CopyDocument /></el-icon>
    </span>
    <span class="drawing-item-delete" title="删除" @click.stop="deleteItem(index)">
      <el-icon><Delete /></el-icon>
    </span>
  </el-col>
</template>
<script setup lang="ts" name="DraggableItem">
/** 可拖拽表单项 - 逻辑 */
import type { FormConf, FormItemConf } from '@/utils/generator/config'
import draggable from 'vuedraggable'
import render from '@/utils/generator/render'
import { ref, watch } from 'vue'
import type { PropType } from 'vue'

/* 组件属性 */
const props = defineProps({
  element: { type: Object as PropType<FormItemConf>, required: true },
  index: Number,
  drawingList: { type: Array as PropType<FormItemConf[]>, required: true },
  activeId: {
    type: [String, Number] as PropType<string | number>
  },
  formConf: { type: Object as PropType<FormConf>, required: true }
})
const className = ref('') /* 组件样式类名（选中/拖拽态） */
const draggableItemRef = ref<HTMLElement | null>(null) /* 拖拽项元素 ref */

/*
 * 组件回调：选中 / 复制 / 删除组件
 */
const emits = defineEmits(['activeItem', 'copyItem', 'deleteItem'])

/** 选中当前组件 */
function activeItem(item: FormItemConf) {
  emits('activeItem', item)
}

/** 复制当前组件 */
function copyItem(item: FormItemConf, parent?: FormItemConf[]) {
  emits('copyItem', item, parent ?? props.drawingList)
}

/** 删除当前组件 */
function deleteItem(item: number | undefined, parent?: FormItemConf[]) {
  emits('deleteItem', item, parent ?? props.drawingList)
}

/** 获取行容器的组件数据（栅格属性） */
function getComponentData() {
  return {
    gutter: props.element.gutter,
    justify: props.element.justify,
    align: props.element.align
  }
}

/* 监听激活 ID，更新选中样式 */
watch(
  () => props.activeId,
  (val) => {
    className.value =
      (props.element.layout === 'rowFormItem' ? 'drawing-row-item' : 'drawing-item') +
      (val === props.element.formId ? ' active-from-item' : '')
    if (props.formConf.unFocusedComponentBorder) {
      className.value += ' unfocus-bordered'
    }
  },
  { immediate: true }
)
</script>
