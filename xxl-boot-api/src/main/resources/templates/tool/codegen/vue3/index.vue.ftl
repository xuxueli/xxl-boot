<#function tsType javaType>
  <#local t = (javaType!"")?string />
  <#if t == "String"><#return "string" /></#if>
  <#if t == "Integer" || t == "int" || t == "Long" || t == "long" || t == "Short" || t == "Byte" || t == "Double" || t == "double" || t == "Float" || t == "BigDecimal" || t == "Character"><#return "number" /></#if>
  <#if t == "Boolean" || t == "boolean"><#return "boolean" /></#if>
  <#if t == "Date" || t == "LocalDate" || t == "LocalDateTime" || t == "LocalTime"><#return "string" /></#if>
  <#return "any" />
</#function>
<#assign hasIdField = false>
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if field.javaField == "id"><#assign hasIdField = true></#if>
</#list>
</#if>
<#assign hasImageUpload = false>
<#assign hasFileUpload = false>
<#assign hasEditor = false>
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if field.htmlType == "imageUpload"><#assign hasImageUpload = true></#if>
<#if field.htmlType == "fileUpload"><#assign hasFileUpload = true></#if>
<#if field.htmlType == "editor"><#assign hasEditor = true></#if>
</#list>
</#if>
<!--
  ${codegen.functionName}（列表页）
  功能：列表查询、新增、修改、删除
  @author ${codegen.functionAuthor} ${.now?string('yyyy-MM-dd')}
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="table.showSearch" label-width="auto">
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if field.isQuery == "1">
<#assign comment = field.columnComment!field.javaField />
<#if field.htmlType == "input">
      <el-form-item label="${comment}" prop="${field.javaField}">
        <el-input v-model="queryParams.${field.javaField}" placeholder="请输入${comment}" clearable @keyup.enter="handleQuery" />
      </el-form-item>
<#elseif field.htmlType == "select" || field.htmlType == "radio">
      <el-form-item label="${comment}" prop="${field.javaField}">
        <el-select v-model="queryParams.${field.javaField}" placeholder="请选择${comment}" clearable>
<#if field.dictType?has_content>
          <el-option v-for="dict in (dicts.${field.dictType} || [])" :key="dict.value" :label="dict.label" :value="dict.value" />
<#else>
          <el-option label="请选择字典生成" value="" />
</#if>
        </el-select>
      </el-form-item>
<#elseif field.htmlType == "datetime">
<#if field.queryType == "BETWEEN">
      <el-form-item label="${comment}">
        <el-date-picker v-model="dateRange${field.javaField?cap_first}" value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
      </el-form-item>
<#else>
      <el-form-item label="${comment}" prop="${field.javaField}">
        <el-date-picker v-model="queryParams.${field.javaField}" type="date" value-format="YYYY-MM-DD" placeholder="选择${comment}" />
      </el-form-item>
</#if>
</#if>
</#if>
</#list>
</#if>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">{{ t('common.search') }}</el-button>
        <el-button icon="Refresh" @click="resetQuery">{{ t('common.reset') }}</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['${codegen.moduleName}:${codegen.businessName?lower_case}:add']">{{ t('common.add') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="table.single" @click="handleUpdate" v-hasPermi="['${codegen.moduleName}:${codegen.businessName?lower_case}:edit']">{{ t('common.modify') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="table.multiple" @click="handleDelete" v-hasPermi="['${codegen.moduleName}:${codegen.businessName?lower_case}:remove']">{{ t('common.delete') }}</el-button>
      </el-col>
      <RightToolbar v-model:showSearch="table.showSearch" @queryTable="getList" />
    </el-row>

    <!-- 数据列表 -->
    <el-table v-loading="table.loading" :data="table.list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :label="t('common.id')" prop="id" width="100" align="center" />
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if field.isList == "1">
      <el-table-column label="${field.columnComment!field.javaField}" prop="${field.javaField}" :show-overflow-tooltip="true" />
</#if>
</#list>
</#if>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['${codegen.moduleName}:${codegen.businessName?lower_case}:edit']">{{ t('common.modify') }}</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['${codegen.moduleName}:${codegen.businessName?lower_case}:remove']">{{ t('common.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination v-show="table.total > 0" :total="table.total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改${codegen.functionName}对话框 -->
    <el-dialog :title="formState.title" v-model="formState.visible" width="600px" append-to-body :close-on-click-modal="false" @closed="reset">
<#assign formColNum = codegen.formColNum!1 />
<#if formColNum lt 1><#assign formColNum = 1 /></#if>
<#assign colSpan = (24 / formColNum)?int />
      <el-form ref="${codegen.businessName?uncap_first}Ref" :model="formState.form" :rules="formState.rules" label-width="80px">
      <el-row :gutter="10">
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if (field.isInsert == "1" || field.isEdit == "1") && field.javaField != "id" && field.javaField != "addTime" && field.javaField != "updateTime">
<#assign comment = field.columnComment!field.javaField />
    <el-col :span="${colSpan}">
<#if field.htmlType == "input">
        <el-form-item label="${comment}" prop="${field.javaField}">
<#if tsType(field.javaType) == "number">
          <el-input :model-value="formState.form.${field.javaField}" @input="handleNumInput('${field.javaField}', $event)" placeholder="请输入${comment}" />
<#else>
          <el-input v-model="formState.form.${field.javaField}" placeholder="请输入${comment}" />
</#if>
        </el-form-item>
<#elseif field.htmlType == "textarea">
        <el-form-item label="${comment}" prop="${field.javaField}">
          <el-input v-model="formState.form.${field.javaField}" type="textarea" placeholder="请输入${comment}" />
        </el-form-item>
<#elseif field.htmlType == "select">
        <el-form-item label="${comment}" prop="${field.javaField}">
          <el-select v-model="formState.form.${field.javaField}" placeholder="请选择${comment}">
            <el-option v-for="dict in <#if field.dictType?has_content>(dicts.${field.dictType} || [])<#else>[]</#if>" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
<#elseif field.htmlType == "radio">
        <el-form-item label="${comment}" prop="${field.javaField}">
          <el-radio-group v-model="formState.form.${field.javaField}">
            <el-radio v-for="dict in <#if field.dictType?has_content>(dicts.${field.dictType} || [])<#else>[]</#if>" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
<#elseif field.htmlType == "checkbox">
        <el-form-item label="${comment}" prop="${field.javaField}">
          <el-checkbox-group v-model="formState.form.${field.javaField}">
            <el-checkbox v-for="dict in <#if field.dictType?has_content>(dicts.${field.dictType} || [])<#else>[]</#if>" :key="dict.value" :value="dict.value">{{ dict.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
<#elseif field.htmlType == "datetime">
        <el-form-item label="${comment}" prop="${field.javaField}">
          <el-date-picker v-model="formState.form.${field.javaField}" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="选择${comment}" />
        </el-form-item>
<#elseif field.htmlType == "imageUpload">
        <el-form-item label="${comment}" prop="${field.javaField}">
          <image-upload v-model="formState.form.${field.javaField}" />
        </el-form-item>
<#elseif field.htmlType == "fileUpload">
        <el-form-item label="${comment}" prop="${field.javaField}">
          <file-upload v-model="formState.form.${field.javaField}" />
        </el-form-item>
<#elseif field.htmlType == "editor">
        <el-form-item label="${comment}" prop="${field.javaField}">
          <editor v-model="formState.form.${field.javaField}" />
        </el-form-item>
</#if>
    </el-col>
</#if>
</#list>
</#if>
      </el-row>
    </el-form>
      <template #footer>
        <el-button type="primary" @click="submitForm">{{ t('modal.confirmButton') }}</el-button>
        <el-button @click="cancel">{{ t('modal.cancelButton') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: '${codegen.businessName}' })
import type { FormInstance } from 'element-plus'
import { ${codegen.businessName?uncap_first}Api } from '../api'
import type { ${codegen.businessName}, ${codegen.businessName}Form, ${codegen.businessName}Query } from '../types'
import { addDateRange } from '@/utils/common'
import { t } from '@/i18n'
import modal from '@/utils/modal'
import type { FormState, TableState } from '@/types'
import { ref } from 'vue'
import { Pagination, RightToolbar } from '@/components'
<#if hasImageUpload>
import { ImageUpload } from '@/components'
</#if>
<#if hasFileUpload>
import { FileUpload } from '@/components'
</#if>
<#if hasEditor>
import { Editor } from '@/components'
</#if>

// 字典选项兜底映射：dictType 字段在此注册空数组，如需字典数据用 useDict 加载替换
const dicts: Record<string, Array<{ value: any; label: string }>> = {}

// 表单 ref
const queryRef = ref<FormInstance>() /* 搜索栏表单 ref */
const ${codegen.businessName?uncap_first}Ref = ref<FormInstance>() /* 编辑表单 ref */

// 搜索栏：查询参数
const queryParams = ref<${codegen.businessName}Query>({
  pageNum: 1, /* 当前页码 */
  pageSize: 10, /* 每页条数 */
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if field.isQuery == "1" && (field.htmlType == "input" || field.htmlType == "select" || field.htmlType == "radio" || (field.htmlType == "datetime" && field.queryType != "BETWEEN"))>
  ${field.javaField}: undefined, /* ${field.columnComment!field.javaField} */
</#if>
</#list>
</#if>
})

// 日期范围：between 查询字段的日期区间
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if field.isQuery == "1" && field.htmlType == "datetime" && field.queryType == "BETWEEN">
const dateRange${field.javaField?cap_first} = ref<string[]>([]) /* ${field.columnComment!field.javaField} 查询区间 */
</#if>
</#list>
</#if>

// 表格：UI 数据
const table = ref<TableState<${codegen.businessName}>>({
  list: [], /* 数据列表 */
  total: 0, /* 总条数 */
  loading: true, /* 加载状态 */
  showSearch: true, /* 是否显示搜索栏 */
  ids: [], /* 选中行 ID 数组 */
  single: true, /* 是否单选 */
  multiple: true /* 是否多选 */
})

// 编辑表单默认值：新增初始值与每次重置共用
const FORM_DEFAULTS: Readonly<${codegen.businessName}Form> = {
  id: undefined, /* 编号 */
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if (field.isInsert == "1" || field.isEdit == "1") && field.javaField != "id" && field.javaField != "addTime" && field.javaField != "updateTime">
  ${field.javaField}: undefined, /* ${field.columnComment!field.javaField} */
</#if>
</#list>
</#if>
}

// 编辑表单：数据状态
const formState = ref<FormState<${codegen.businessName}Form>>({
  visible: false, /* 对话框显隐 */
  title: '', /* 对话框标题 */
  form: { ...FORM_DEFAULTS }, /* 表单数据 */
  rules: {
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if (field.isInsert == "1" || field.isEdit == "1") && (field.isRequired!"0") == "1" && field.javaField != "id" && field.javaField != "addTime" && field.javaField != "updateTime">
    ${field.javaField}: [{ required: true, message: '${field.columnComment!field.javaField}不能为空', trigger: '<#if field.htmlType == "input" || field.htmlType == "textarea">blur<#else>change</#if>' }],
</#if>
</#list>
</#if>
  } /* 校验规则（isRequired=1 字段必填） */
})

/** 查询${codegen.functionName}列表 */
function getList() {
  table.value.loading = true
  // 分页与筛选参数由 API 内部转换为 offset/pagesize
  const params = { ...queryParams.value } as ${codegen.businessName}Query & Record<string, unknown>
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if field.isQuery == "1" && field.htmlType == "datetime" && field.queryType == "BETWEEN">
  addDateRange(params, dateRange${field.javaField?cap_first}.value, '${field.javaField?cap_first}')
</#if>
</#list>
</#if>
  ${codegen.businessName?uncap_first}Api.pageList(params)
    .then((response) => {
      table.value.list = response.data.data
      table.value.total = response.data.total
    })
    .catch(() => {
      // 错误已由请求层提示，继续走到 finally 复位 loading
    })
    .finally(() => {
      table.value.loading = false
    })
}

/** 取消按钮 */
function cancel() {
  formState.value.visible = false
  reset()
}

/** 表单重置：恢复默认值并清除校验状态 */
function reset() {
  formState.value.form = { ...FORM_DEFAULTS }
  ${codegen.businessName?uncap_first}Ref.value?.clearValidate()
}

/** 数字输入过滤：仅允许数字并同步表单（空值置 undefined） */
function handleNumInput(key: string, value: string) {
  const filtered = String(value ?? '').replace(/[^0-9]/g, '')
  ;(formState.value.form as Record<string, unknown>)[key] = filtered === '' ? undefined : Number(filtered)
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if field.isQuery == "1" && field.htmlType == "datetime" && field.queryType == "BETWEEN">
  dateRange${field.javaField?cap_first}.value = []
</#if>
</#list>
</#if>
  queryRef.value?.resetFields()
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection: ${codegen.businessName}[]) {
  table.value.ids = selection.map((item) => item.id as number)
  table.value.single = selection.length !== 1
  table.value.multiple = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  formState.value.visible = true
  formState.value.title = t('common.titleAdd', ['${codegen.functionName}'])
}

/** 修改按钮操作（顶部按钮 @click 传事件对象，需取勾选 id） */
function handleUpdate(row: any) {
  reset()
  // 顶部按钮点击传入的是事件对象而非行数据，此时取勾选 id
  const id = row?.id ?? table.value.ids[0]
  if (id == null) {
    return
  }
  ${codegen.businessName?uncap_first}Api.load(id).then((response) => {
    // 表单只保留可编辑字段，避免把时间/联查字段回传到后端
    const { addTime, updateTime, ...form } = response.data
    formState.value.form = form
    formState.value.visible = true
    formState.value.title = t('common.titleEdit', ['${codegen.functionName}'])
  })
}

/** 提交按钮 */
function submitForm() {
  ${codegen.businessName?uncap_first}Ref.value?.validate((valid) => {
    if (valid) {
      // 已有 id 走更新，否则走新增
      if (formState.value.form.id != null) {
        ${codegen.businessName?uncap_first}Api.update(formState.value.form).then(() => {
          modal.msgSuccess(t('common.updateSuccess'))
          formState.value.visible = false
          getList()
        })
      } else {
        ${codegen.businessName?uncap_first}Api.insert(formState.value.form).then(() => {
          modal.msgSuccess(t('common.addSuccess'))
          formState.value.visible = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作（顶部按钮 @click 传事件对象，需取勾选 ids） */
function handleDelete(row: any) {
  const ${codegen.businessName?uncap_first}Ids = row?.id ?? table.value.ids
  if (${codegen.businessName?uncap_first}Ids == null || (Array.isArray(${codegen.businessName?uncap_first}Ids) && ${codegen.businessName?uncap_first}Ids.length === 0)) {
    return
  }
  modal.confirm(t('common.confirmDelete', [${codegen.businessName?uncap_first}Ids])).then(() => {
    return ${codegen.businessName?uncap_first}Api.delete(${codegen.businessName?uncap_first}Ids)
  }).then(() => {
    getList()
    modal.msgSuccess(t('common.deleteSuccess'))
  }).catch(() => {})
}

// 页面初始化：加载${codegen.functionName}列表
getList()
</script>
