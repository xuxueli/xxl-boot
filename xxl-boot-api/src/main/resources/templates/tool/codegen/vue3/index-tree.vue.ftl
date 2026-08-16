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
  ${codegen.functionName}（树表列表页）
  Created by ${codegen.functionAuthor} on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="table.showSearch" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['${codegen.moduleName}:${codegen.businessName?lower_case}:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="table.single" @click="handleUpdate" v-hasPermi="['${codegen.moduleName}:${codegen.businessName?lower_case}:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="table.multiple" @click="handleDelete" v-hasPermi="['${codegen.moduleName}:${codegen.businessName?lower_case}:remove']">删除</el-button>
      </el-col>
    </el-row>

    <!-- 数据列表 -->
    <el-table v-loading="table.loading" :data="table.list" row-key="id" default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="名称" prop="name" :show-overflow-tooltip="true" />
<#if fields?? && fields?size gt 0>
<#list fields as field>
      <el-table-column label="${field.columnComment!field.javaField}" prop="${field.javaField}" :show-overflow-tooltip="true" />
</#list>
</#if>
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改${codegen.functionName}对话框 -->
    <el-dialog :title="formState.title" v-model="formState.visible" width="600px" append-to-body>
<#assign formColNum = codegen.formColNum!1 />
<#if formColNum lt 1><#assign formColNum = 1 /></#if>
<#assign colSpan = (24 / formColNum)?int />
      <el-form ref="${codegen.businessName?uncap_first}Ref" :model="formState.form" :rules="formState.rules" label-width="80px">
      <el-row :gutter="10">
        <el-form-item label="上级" prop="parentId">
          <el-tree-select v-model="formState.form.parentId" :data="table.options" value-key="id"
            :props="{ label: 'name', children: 'children' }" placeholder="请选择上级" check-strictly />
        </el-form-item>
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if (field.isInsert == "1" || field.isEdit == "1") && field.javaField != "id" && field.javaField != "parentId" && field.javaField != "addTime" && field.javaField != "updateTime">
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
            <el-radio v-for="dict in <#if field.dictType?has_content>(dicts.${field.dictType} || [])<#else>[]</#if>" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
<#elseif field.htmlType == "checkbox">
        <el-form-item label="${comment}" prop="${field.javaField}">
          <el-checkbox-group v-model="formState.form.${field.javaField}">
            <el-checkbox v-for="dict in <#if field.dictType?has_content>(dicts.${field.dictType} || [])<#else>[]</#if>" :key="dict.value" :label="dict.value">{{ dict.label }}</el-checkbox>
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
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: '${codegen.businessName}Tree' })
import type { FormInstance, FormRules } from 'element-plus'
import { list${codegen.businessName}, get${codegen.businessName}, add${codegen.businessName}, update${codegen.businessName}, del${codegen.businessName} } from '@/api/${codegen.moduleName}/${codegen.businessName?lower_case}'
import type { ${codegen.businessName}, ${codegen.businessName}Form, ${codegen.businessName}Query } from '@/types/${codegen.moduleName}/${codegen.businessName?lower_case}'
import { useFormReset } from '@/composables/useFormReset'
import { usePageParams } from '@/composables/usePageParams'
import modal from '@/utils/modal'
import type { FormState, TableState } from '@/types'
import { ref } from 'vue'
<#if hasImageUpload>
import { ImageUpload } from '@/components'
</#if>
<#if hasFileUpload>
import { FileUpload } from '@/components'
</#if>
<#if hasEditor>
import { Editor } from '@/components'
</#if>

const resetForm = useFormReset()

// 字典选项兜底映射：dictType 字段在此注册空数组，如需字典数据用 useDict 加载替换
const dicts: Record<string, Array<{ value: any; label: string }>> = {}


// --------------------------------- ref data ---------------------------------

// 表单 ref
const queryRef = ref<FormInstance>() /* 搜索栏表单 ref */
const ${codegen.businessName?uncap_first}Ref = ref<FormInstance>() /* 编辑表单 ref */

/** 树表表格状态：通用 TableState + 上级选项 */
type ${codegen.businessName}TableState = Omit<TableState<${codegen.businessName}>, 'total'> & { options: ${codegen.businessName}[] }

// 搜索栏：查询参数
const queryParams = ref<${codegen.businessName}Query>({
  pageNum: 1, /* 当前页码 */
  pageSize: 10, /* 每页条数 */
  name: undefined, /* 名称关键词 */
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if field.isQuery == "1" && field.javaField != "name">
  ${field.javaField}: undefined, /* ${field.columnComment!field.javaField} */
</#if>
</#list>
</#if>
})

// 表格：UI 数据
const table = ref<${codegen.businessName}TableState>({
  list: [] as ${codegen.businessName}[], /* 树表数据 */
  options: [] as ${codegen.businessName}[], /* 上级选项数据 */
  loading: true, /* 加载状态 */
  showSearch: true, /* 是否显示搜索栏 */
  ids: [] as number[], /* 选中行 ID 数组 */
  single: true, /* 是否单选 */
  multiple: true /* 是否多选 */
})

// 编辑表单：数据状态
const formState = ref<FormState<${codegen.businessName}Form>>({
  visible: false, /* 对话框显隐 */
  title: '', /* 对话框标题 */
  form: {}, /* 表单数据 */
  rules: {
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if (field.isInsert == "1" || field.isEdit == "1") && (field.isRequired!"0") == "1" && field.javaField != "id" && field.javaField != "parentId" && field.javaField != "addTime" && field.javaField != "updateTime">
    ${field.javaField}: [{ required: true, message: '${field.columnComment!field.javaField}不能为空', trigger: '<#if field.htmlType == "input" || field.htmlType == "textarea">blur<#else>change</#if>' }],
</#if>
</#list>
</#if>
  } /* 校验规则（isRequired=1 字段必填） */
})

/** 查询${codegen.functionName}树表列表 */
function getList() {
  table.value.loading = true
  // 前端分页参数 → 后端请求参数（offset/pagesize）
  const params = usePageParams(queryParams)()
  list${codegen.businessName}(params).then((res) => {
    // 树表接口返回树数组（非分页结构），此处断言处理
    table.value.list = res.data as unknown as ${codegen.businessName}[]
    table.value.loading = false
  })
}


// --------------------------------- fun ---------------------------------

/** 查询上级树选项 */
function get${codegen.businessName}Treeselect() {
  list${codegen.businessName}({ offset: 0, pagesize: 999 }).then((res) => {
    table.value.options = res.data as unknown as ${codegen.businessName}[]
  })
}

/** 取消按钮 */
function cancel() {
  formState.value.visible = false
  reset()
}

/** 表单重置 */
function reset() {
  formState.value.form = {
    id: undefined,
    parentId: 0,
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if (field.isInsert == "1" || field.isEdit == "1") && field.javaField != "id" && field.javaField != "parentId" && field.javaField != "addTime" && field.javaField != "updateTime">
    ${field.javaField}: undefined, /* ${field.columnComment!field.javaField} */
</#if>
</#list>
</#if>
  }
  resetForm('${codegen.businessName?uncap_first}Ref')
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
  resetForm('queryRef')
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection: ${codegen.businessName}[]) {
  table.value.ids = selection.map((item) => item.id as number)
  table.value.single = selection.length !== 1
  table.value.multiple = !selection.length
}

/** 新增按钮操作（不传 row 新增顶级，传 row 新增下级） */
function handleAdd(row: any) {
  reset()
  get${codegen.businessName}Treeselect()
  // 行内新增按钮传入行数据时，指定其为上级
  if (row && row.id != null) {
    formState.value.form.parentId = row.id
  }
  formState.value.visible = true
  formState.value.title = '新增${codegen.functionName}'
}

/** 修改按钮操作（顶部按钮 @click 传事件对象，需取勾选 id） */
function handleUpdate(row: any) {
  reset()
  get${codegen.businessName}Treeselect()
  // 顶部按钮点击传入的是事件对象而非行数据，此时取勾选 id
  const id = row?.id ?? table.value.ids[0]
  if (id == null) {
    return
  }
  get${codegen.businessName}(id).then((res) => {
    formState.value.form = res.data
    formState.value.visible = true
    formState.value.title = '修改${codegen.functionName}'
  })
}

/** 提交按钮 */
function submitForm() {
  ${codegen.businessName?uncap_first}Ref.value?.validate((valid) => {
    if (valid) {
      // 已有 id 走更新，否则走新增
      if (formState.value.form.id != null) {
        update${codegen.businessName}(formState.value.form).then(() => {
          modal.msgSuccess('修改成功')
          formState.value.visible = false
          getList()
        })
      } else {
        add${codegen.businessName}(formState.value.form).then(() => {
          modal.msgSuccess('新增成功')
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
  modal.confirm('是否确认删除${codegen.functionName}编号为"' + ${codegen.businessName?uncap_first}Ids + '"的数据项？').then(() => {
    return del${codegen.businessName}(${codegen.businessName?uncap_first}Ids)
  }).then(() => {
    getList()
    modal.msgSuccess('删除成功')
  }).catch(() => {})
}


// --------------------------------- page init ---------------------------------

// 页面初始化：加载${codegen.functionName}树表列表
getList()
</script>
