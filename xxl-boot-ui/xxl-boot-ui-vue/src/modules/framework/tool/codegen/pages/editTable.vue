<!--
  CodegenEdit（代码生成配置编辑）
  功能：修改已导入表的配置信息（基本信息 + 生成信息 + 字段配置）
  @author xuxueli 2026-11-21
-->
<template>
  <el-dialog v-model="visible" :title="t('tool.codegen.editGenConfig')" width="90%" top="3vh" append-to-body destroy-on-close :close-on-click-modal="false" @closed="resetForm">
    <el-tabs v-model="activeName">
      <!-- 配置信息（基本信息 + 生成信息） -->
      <el-tab-pane :label="t('tool.codegen.configInfo')" name="basic">
        <!-- 基本信息 -->
        <h4 style="margin: 0 0 8px 0; font-weight: 600">{{ t('tool.codegen.baseInfo') }}</h4>
        <el-form ref="basicFormRef" :model="info" :rules="basicRules" label-width="150px">
          <el-row>
            <el-col :span="12">
              <el-form-item :label="t('tool.codegen.tableName')" prop="tableName">
                <el-input :placeholder="t('common.inputPlaceholder', [t('tool.codegen.tableName')])" v-model="info.tableName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="t('tool.codegen.tableComment')" prop="tableComment">
                <el-input :placeholder="t('common.inputPlaceholder', [t('tool.codegen.tableComment')])" v-model="info.tableComment" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-divider style="margin: 8px 0" />

        <!-- 生成信息 -->
        <h4 style="margin: 0 0 8px 0; font-weight: 600">{{ t('tool.codegen.generateInfo') }}</h4>
        <el-form ref="genFormRef" :model="info" :rules="genRules" label-width="150px">
          <el-row>
            <el-col :span="12">
              <el-form-item :label="t('tool.codegen.packageName')" prop="packageName">
                <el-input v-model="info.packageName" placeholder="com.xxl.boot.api.business" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="t('tool.codegen.moduleName')" prop="moduleName">
                <el-input v-model="info.moduleName" placeholder="system" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="t('tool.codegen.businessName')" prop="businessName">
                <el-input v-model="info.businessName" placeholder="User" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="t('tool.codegen.functionName')" prop="functionName">
                <el-input v-model="info.functionName" :placeholder="t('tool.codegen.functionNameInputPlaceholder')" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="t('tool.codegen.functionAuthor')" prop="functionAuthor">
                <el-input v-model="info.functionAuthor" placeholder="xuxueli" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="t('tool.codegen.formLayout')" prop="formColNum">
                <el-select v-model="info.formColNum">
                  <el-option :label="t('tool.codegen.formLayoutSingle')" :value="1" />
                  <el-option :label="t('tool.codegen.formLayoutDouble')" :value="2" />
                  <el-option :label="t('tool.codegen.formLayoutTriple')" :value="3" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="t('tool.codegen.tplCategory')" prop="tplCategory">
                <el-select v-model="info.tplCategory">
                  <el-option :label="t('tool.codegen.tplCrud')" value="crud" />
                  <el-option :label="t('tool.codegen.tplTree')" value="tree" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="t('tool.codegen.tplWebType')" prop="tplWebType">
                <el-select v-model="info.tplWebType">
                  <el-option label="Element Plus + TypeScript" value="element-plus-typescript" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="t('common.remark')" prop="remark">
                <el-input type="textarea" :rows="2" v-model="info.remark" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>

      <!-- 字段信息 -->
      <el-tab-pane :label="t('tool.codegen.columnInfo')" name="columnInfo">
        <!-- 字段列表：支持拖拽排序 -->
        <el-table ref="dragTableRef" :data="columns" row-key="id" max-height="420">
          <el-table-column :label="t('common.serialNo')" type="index" min-width="5%" class-name="allowDrag" />
          <el-table-column :label="t('tool.codegen.columnName')" prop="columnName" min-width="10%" show-overflow-tooltip class-name="allowDrag" />
          <el-table-column :label="t('tool.codegen.columnComment')" min-width="10%">
            <template #default="scope">
              <el-input v-model="scope.row.columnComment" />
            </template>
          </el-table-column>
          <el-table-column :label="t('tool.codegen.javaType')" min-width="11%">
            <template #default="scope">
              <el-select v-model="scope.row.javaType">
                <el-option label="Long" value="Long" />
                <el-option label="String" value="String" />
                <el-option label="Integer" value="Integer" />
                <el-option label="Double" value="Double" />
                <el-option label="BigDecimal" value="BigDecimal" />
                <el-option label="Date" value="Date" />
                <el-option label="Boolean" value="Boolean" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="t('tool.codegen.javaField')" min-width="10%">
            <template #default="scope">
              <el-input v-model="scope.row.javaField" />
            </template>
          </el-table-column>
          <el-table-column :label="t('tool.codegen.isInsert')" min-width="5%">
            <template #default="scope">
              <el-checkbox true-value="1" false-value="0" v-model="scope.row.isInsert" :disabled="scope.row.javaField === 'id'" />
            </template>
          </el-table-column>
          <el-table-column :label="t('common.edit')" min-width="5%">
            <template #default="scope">
              <el-checkbox true-value="1" false-value="0" v-model="scope.row.isEdit" :disabled="scope.row.javaField === 'id'" />
            </template>
          </el-table-column>
          <el-table-column :label="t('tool.codegen.isList')" min-width="5%">
            <template #default="scope">
              <el-checkbox true-value="1" false-value="0" v-model="scope.row.isList" :disabled="scope.row.javaField === 'id'" />
            </template>
          </el-table-column>
          <el-table-column :label="t('common.query')" min-width="5%">
            <template #default="scope">
              <el-checkbox true-value="1" false-value="0" v-model="scope.row.isQuery" :disabled="scope.row.javaField === 'id'" />
            </template>
          </el-table-column>
          <el-table-column :label="t('tool.codegen.queryType')" min-width="10%">
            <template #default="scope">
              <el-select v-model="scope.row.queryType">
                <el-option label="=" value="EQ" />
                <el-option label="!=" value="NE" />
                <el-option label=">" value="GT" />
                <el-option label=">=" value="GTE" />
                <el-option label="<" value="LT" />
                <el-option label="<=" value="LTE" />
                <el-option label="LIKE" value="LIKE" />
                <el-option label="BETWEEN" value="BETWEEN" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="t('tool.codegen.isRequired')" min-width="5%">
            <template #default="scope">
              <el-checkbox true-value="1" false-value="0" v-model="scope.row.isRequired" />
            </template>
          </el-table-column>
          <el-table-column :label="t('tool.codegen.displayType')" min-width="12%">
            <template #default="scope">
              <el-select v-model="scope.row.htmlType">
                <el-option :label="t('tool.codegen.htmlInput')" value="input" />
                <el-option :label="t('tool.codegen.htmlTextarea')" value="textarea" />
                <el-option :label="t('tool.codegen.htmlSelect')" value="select" />
                <el-option :label="t('tool.codegen.htmlRadio')" value="radio" />
                <el-option :label="t('tool.codegen.htmlCheckbox')" value="checkbox" />
                <el-option :label="t('tool.codegen.htmlDatetime')" value="datetime" />
                <el-option :label="t('tool.codegen.htmlImageUpload')" value="imageUpload" />
                <el-option :label="t('tool.codegen.htmlFileUpload')" value="fileUpload" />
                <el-option :label="t('tool.codegen.htmlEditor')" value="editor" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="t('tool.codegen.dictType')" min-width="12%">
            <template #default="scope">
              <el-select v-model="scope.row.dictType" clearable filterable :placeholder="t('common.selectPlaceholder')">
                <el-option v-for="dict in dictOptions" :key="dict.dictType ?? ''" :label="dict.dictName" :value="dict.dictType ?? ''">
                  <span style="float: left">{{ dict.dictName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ dict.dictType }}</span>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 底部按钮 -->
    <template #footer>
      <el-button type="primary" @click="saveForm">{{ t('tool.codegen.submit') }}</el-button>
      <el-button @click="closeForm">{{ t('modal.cancelButton') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
defineOptions({ name: 'CodegenEdit' })
import { nextTick, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import Sortable from 'sortablejs'
import { t } from '@/i18n'
import modal from '@/utils/modal'
import { dictApi } from '@/modules/framework/system/dict/api'
import type { DictSelectOption } from '@/modules/framework/system/dict/types'
import { codegenApi } from '../api'
import type { CodegenDetail, CodegenField, CodegenForm } from '../types'

/** 字段表格组件暴露的最小型结构（仅用于拖拽排序） */
interface TableRef {
  /** 组件根 DOM */
  $el?: HTMLElement
}

/** 挂载 Sortable 实例的 tbody */
interface SortableTableBody extends HTMLElement {
  /** Sortable 实例，避免重复初始化 */
  __sortable?: Sortable
}

// ---------------------- 响应式数据 ----------------------

/* 组件回调：提交成功后通知父组件刷新列表 */
const emit = defineEmits(['ok'])

/* 表单 ref */
const basicFormRef = ref<FormInstance>() /* 基本信息表单 */
const genFormRef = ref<FormInstance>() /* 生成信息表单 */

/* 状态变量 */
const activeName = ref('basic') /* 当前 TAB */
const columns = ref<CodegenField[]>([]) /* 字段列表 */
const dictOptions = ref<DictSelectOption[]>([]) /* 字典类型选项 */
const visible = ref(false) /* 弹框显隐 */
const dragTableRef = ref<TableRef | null>(null) /* 字段表格 ref，用于拖拽排序 */

// 生成配置默认值：打开与关闭时共用，保证默认项始终有效
const FORM_DEFAULTS: Readonly<CodegenDetail> = { formColNum: 1, tplWebType: 'element-plus-typescript' }

const info = ref<CodegenDetail>({ ...FORM_DEFAULTS }) /* 表配置信息 */

/** 基本信息 - 表单校验规则 */
const basicRules: FormRules = {
  tableName: [{ required: true, message: t('common.requiredMsg', [t('tool.codegen.tableName')]), trigger: 'blur' }]
}

/** 生成信息 - 表单校验规则 */
const genRules: FormRules = {
  packageName: [{ required: true, message: t('common.requiredMsg', [t('tool.codegen.packageName')]), trigger: 'blur' }],
  moduleName: [{ required: true, message: t('common.requiredMsg', [t('tool.codegen.moduleName')]), trigger: 'blur' }],
  businessName: [{ required: true, message: t('common.requiredMsg', [t('tool.codegen.businessName')]), trigger: 'blur' }],
  functionName: [{ required: true, message: t('common.requiredMsg', [t('tool.codegen.functionName')]), trigger: 'blur' }]
}

// ---------------------- 表单操作（打开/重置/保存） ----------------------

/**
 * 打开编辑弹框（暴露给父组件调用）
 *
 * @param id 生成表主键
 */
function open(id: number) {
  activeName.value = 'basic'
  info.value = { ...FORM_DEFAULTS }
  columns.value = []
  visible.value = true

  // 加载表配置与字段列表
  codegenApi
    .detail(id)
    .then((response) => {
      if (!response.data) return
      const { fieldList, ...rest } = response.data
      info.value = { ...FORM_DEFAULTS, ...rest }
      columns.value = fieldList || []
      // id 主键字段不参与新增/编辑，强制置 0
      columns.value.forEach((column) => {
        if (column.javaField === 'id') {
          column.isInsert = '0'
          column.isEdit = '0'
        }
      })
      // 校验默认值是否在可选范围内
      if (![1, 2, 3].includes(info.value.formColNum ?? 0)) info.value.formColNum = 1
      if (info.value.tplWebType !== 'element-plus-typescript') info.value.tplWebType = 'element-plus-typescript'
    })
    .catch(() => {})

  // 加载字典类型下拉
  dictApi
    .queryDictList()
    .then((response) => {
      dictOptions.value = response.data || []
    })
    .catch(() => {})
}

/** 重置编辑表单：恢复默认配置 + 清空字段列表与校验状态 */
function resetForm() {
  info.value = { ...FORM_DEFAULTS }
  columns.value = []
  activeName.value = 'basic'
  basicFormRef.value?.clearValidate()
  genFormRef.value?.clearValidate()
}

/** 校验基本信息与生成信息后提交保存 */
function saveForm() {
  const basicValid = basicFormRef.value ? basicFormRef.value.validate().catch(() => false) : Promise.resolve(false)
  const genValid = genFormRef.value ? genFormRef.value.validate().catch(() => false) : Promise.resolve(false)
  Promise.all([basicValid, genValid]).then(([basicPassed, genPassed]) => {
    // 任一表单校验失败时保持弹窗打开，等待用户修正
    if (!basicPassed || !genPassed) {
      modal.msgError(t('tool.codegen.formValidateFail'))
      return
    }
    const payload: CodegenForm = { ...info.value, fieldList: columns.value }
    codegenApi
      .update(payload)
      .then((response) => {
        // 仅成功时提示并通知父组件刷新列表
        if (response.code === 200) {
          modal.msgSuccess(t('common.updateSuccess'))
          closeForm()
          emit('ok')
        }
      })
      .catch(() => {})
  })
}

/** 关闭弹窗：表单重置统一交给 @closed，保证按钮与右上角关闭行为一致 */
function closeForm() {
  visible.value = false
}

// ---------------------- 字段拖拽排序 ----------------------

// 拖拽排序：切换到字段信息卡片时初始化，确保 DOM 已渲染
watch(activeName, (name) => {
  if (name !== 'columnInfo' || columns.value.length === 0) return
  nextTick(() => {
    const tbody = dragTableRef.value?.$el?.querySelector('tbody') as SortableTableBody | null
    // 已经初始化过则跳过，避免重复绑定
    if (!tbody || tbody.__sortable) return
    tbody.__sortable = Sortable.create(tbody, {
      handle: '.allowDrag',
      animation: 150,
      ghostClass: 'sortable-ghost',
      onStart: () => (document.onselectstart = () => false),
      onEnd: (event) => {
        document.onselectstart = null
        // 拖拽索引缺失时不做重排，避免数组越界
        if (event.oldIndex == null || event.newIndex == null) return
        const [movedItem] = columns.value.splice(event.oldIndex, 1)
        if (!movedItem) return
        columns.value.splice(event.newIndex, 0, movedItem)
        columns.value.forEach((column, index) => {
          column.sort = index + 1
        })
      }
    })
  })
})

// ---------------------- 组件暴露 ----------------------

// 向父组件暴露打开编辑弹窗方法
defineExpose({ open })
</script>

<style scoped>
:deep(.sortable-ghost) {
  opacity: 0.3;
}

:deep(.sortable-chosen) {
  background: #f5f7fa;
}
</style>
