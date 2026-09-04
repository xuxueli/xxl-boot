<!--
  组件：代码生成编辑弹框
  功能：修改已导入表的配置信息（基本信息 + 生成信息 + 字段配置）
-->
<template>
  <el-dialog v-model="visible" :title="t('tool.codegen.editGenConfig')" width="90%" top="3vh" append-to-body destroy-on-close>
    <el-tabs v-model="activeName">
      <!-- TAB1：配置信息（基本信息 + 生成信息） -->
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

      <!-- TAB2：字段信息 -->
      <el-tab-pane :label="t('tool.codegen.columnInfo')" name="columnInfo">
        <!-- 拖拽区域 -->
        <el-table ref="dragTableRef" :data="columns" row-key="id" max-height="420">
          <el-table-column :label="t('common.serialNo')" type="index" min-width="5%" class-name="allowDrag" />
          <el-table-column :label="t('tool.codegen.columnName')" prop="columnName" min-width="10%" :show-overflow-tooltip="true" class-name="allowDrag" />
          <el-table-column :label="t('tool.codegen.columnComment')" min-width="10%">
            <template #default="scope">
              <el-input v-model="scope.row.columnComment"></el-input>
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
              <el-input v-model="scope.row.javaField"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="t('tool.codegen.isInsert')" min-width="5%">
            <template #default="scope">
              <el-checkbox
                true-value="1"
                false-value="0"
                v-model="scope.row.isInsert"
                :disabled="scope.row.javaField === 'id'"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column :label="t('common.edit')" min-width="5%">
            <template #default="scope">
              <el-checkbox true-value="1" false-value="0" v-model="scope.row.isEdit" :disabled="scope.row.javaField === 'id'"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column :label="t('tool.codegen.isList')" min-width="5%">
            <template #default="scope">
              <el-checkbox true-value="1" false-value="0" v-model="scope.row.isList" :disabled="scope.row.javaField === 'id'"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column :label="t('common.query')" min-width="5%">
            <template #default="scope">
              <el-checkbox
                true-value="1"
                false-value="0"
                v-model="scope.row.isQuery"
                :disabled="scope.row.javaField === 'id'"
              ></el-checkbox>
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
              <el-checkbox true-value="1" false-value="0" v-model="scope.row.isRequired"></el-checkbox>
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
                <el-option v-for="dict in dictOptions" :key="dict.dictType" :label="dict.dictName" :value="dict.dictType">
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
      <el-button type="primary" @click="submitForm">{{ t('tool.codegen.submit') }}</el-button>
      <el-button @click="visible = false">{{ t('modal.cancelButton') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
defineOptions({ name: 'GenEdit' })
import { t } from '@/i18n'
import { getGenTable, updateGenTable } from '../api'
import { queryDictList } from '@/modules/framework/system/dict/api'
import type { FormInstance } from 'element-plus'
import modal from '@/utils/modal'
import Sortable from 'sortablejs'
import { nextTick, ref, watch } from 'vue'

/* 组件回调 */
const emit = defineEmits(['ok']) /* 提交成功后通知父组件刷新列表 */

/* 表单 ref */
const basicFormRef = ref<FormInstance>() /* 基本信息表单 */
const genFormRef = ref<FormInstance>() /* 生成信息表单 */

/* 状态变量 */
const activeName = ref('basic') /* 当前 TAB */
const columns = ref<any[]>([]) /* 字段列表 */
const dictOptions = ref<any[]>([]) /* 字典类型选项 */
const info = ref<Record<string, any>>({}) /* 表配置信息 */
const visible = ref(false) /* 弹框显隐 */
const tableId = ref(0) /* 当前编辑的表 ID */
const dragTableRef = ref<any>(null) /* 字段表格 ref，用于拖拽排序 */

/** 基本信息 - 表单校验规则 */
const basicRules = {
  tableName: [{ required: true, message: t('common.inputPlaceholder', [t('tool.codegen.tableName')]), trigger: 'blur' }]
}

/** 生成信息 - 表单校验规则 */
const genRules = {
  packageName: [{ required: true, message: t('common.inputPlaceholder', [t('tool.codegen.packageName')]), trigger: 'blur' }],
  moduleName: [{ required: true, message: t('common.inputPlaceholder', [t('tool.codegen.moduleName')]), trigger: 'blur' }],
  businessName: [{ required: true, message: t('common.inputPlaceholder', [t('tool.codegen.businessName')]), trigger: 'blur' }],
  functionName: [{ required: true, message: t('common.inputPlaceholder', [t('tool.codegen.functionName')]), trigger: 'blur' }]
}

/**
 * 打开编辑弹框 （暴露 组件方法）
 * @param {number} id 表编码
 */
function open(id: number) {
  tableId.value = id
  activeName.value = 'basic'
  info.value = { formColNum: 1, tplWebType: 'element-plus-typescript' }
  visible.value = true

  /* 加载表配置 + 字段列表 */
  getGenTable(id).then((res) => {
    const { fieldList, ...rest } = (res.data || {}) as { fieldList?: any[]; [key: string]: any }
    info.value = { formColNum: 1, tplWebType: 'element-plus-typescript', ...rest }
    columns.value = fieldList || []
    /* id 主键字段：插入/编辑不可勾选，强制置 0（自增主键不参与新增/编辑） */
    columns.value.forEach((col) => {
      if (col.javaField === 'id') {
        col.isInsert = '0'
        col.isEdit = '0'
      }
    })
    /* 校验默认值是否在可选范围内 */
    if (![1, 2, 3].includes(info.value.formColNum)) info.value.formColNum = 1
    if (info.value.tplWebType !== 'element-plus-typescript') info.value.tplWebType = 'element-plus-typescript'
  })

  /* 加载字典类型下拉 */
  queryDictList().then((response) => {
    dictOptions.value = response.data || []
  })
}

/** 提交保存 */
function submitForm() {
  /* 校验两个表单 */
  Promise.all([basicFormRef.value!.validate(), genFormRef.value!.validate()]).then((res) => {
    if (res.every(Boolean)) {
      const genTable = Object.assign({}, info.value)
      genTable.fieldList = columns.value
      updateGenTable(genTable).then((res) => {
        if (res.code === 200) {
          modal.msgSuccess(res.msg)
          visible.value = false
          emit('ok')
        }
      })
    } else {
      modal.msgError(t('tool.codegen.formValidateFail'))
    }
  })
}

/** 拖拽排序：切换到字段信息 tab 时初始化，确保 DOM 已渲染 */
watch(activeName, (name) => {
  if (name !== 'columnInfo' || !columns.value || columns.value.length === 0) return
  nextTick(() => {
    const tbody = dragTableRef.value?.$el?.querySelector('tbody') as HTMLElement | null
    if (!tbody || (tbody as any).__sortable) return
    ;(tbody as any).__sortable = Sortable.create(tbody, {
      handle: '.allowDrag',
      animation: 150,
      ghostClass: 'sortable-ghost',
      onStart: () => (document.onselectstart = () => false),
      onEnd: (evt) => {
        document.onselectstart = null
        const item = columns.value.splice(evt.oldIndex!, 1)[0]
        columns.value.splice(evt.newIndex!, 0, item)
        columns.value.forEach((c, i) => (c.sort = i + 1))
      }
    })
  })
})

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
