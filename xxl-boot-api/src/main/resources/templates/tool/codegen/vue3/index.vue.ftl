<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if field.isQuery == "1">
<#assign comment = field.columnComment!field.javaField />
<#if field.htmlType == "input">
      <el-form-item label="${comment}" prop="${field.javaField}">
        <el-input v-model="queryParams.${field.javaField}" placeholder="请输入${comment}" clearable @keyup.enter="handleQuery" />
      </el-form-item>
<#elseif field.htmlType == "select" || field.htmlType == "radio">
<#if field.dictType?has_content>
      <el-form-item label="${comment}" prop="${field.javaField}">
        <el-select v-model="queryParams.${field.javaField}" placeholder="请选择${comment}" clearable>
          <el-option v-for="dict in ${field.dictType}" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
<#else>
      <el-form-item label="${comment}" prop="${field.javaField}">
        <el-select v-model="queryParams.${field.javaField}" placeholder="请选择${comment}" clearable>
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
</#if>
<#elseif field.htmlType == "datetime">
<#if field.queryType == "BETWEEN">
      <el-form-item label="${comment}">
        <el-date-picker v-model="dateRange${field.javaField?cap_first}" value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
      </el-form-item>
<#else>
      <el-form-item label="${comment}" prop="${field.javaField}">
        <el-date-picker v-model="queryParams.${field.javaField}" type="date" placeholder="选择${comment}" />
      </el-form-item>
</#if>
</#if>
</#if>
</#list>
</#if>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['${codegen.moduleName}:${codegen.businessName?lower_case}:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['${codegen.moduleName}:${codegen.businessName?lower_case}:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['${codegen.moduleName}:${codegen.businessName?lower_case}:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['${codegen.moduleName}:${codegen.businessName?lower_case}:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table ref="tableRef" v-loading="loading" :data="${codegen.businessName?uncap_first}List" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="50" align="center">
        <template #default="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if field.isList == "1">
      <el-table-column label="${field.columnComment!field.javaField}" prop="${field.javaField}" :show-overflow-tooltip="true" />
</#if>
</#list>
</#if>
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['${codegen.moduleName}:${codegen.businessName?lower_case}:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['${codegen.moduleName}:${codegen.businessName?lower_case}:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="主键" prop="id" v-if="false" />
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if field.isInsert == "1" || field.isEdit == "1">
<#assign comment = field.columnComment!field.javaField />
<#if field.htmlType == "input">
        <el-form-item label="${comment}" prop="${field.javaField}">
          <el-input v-model="form.${field.javaField}" placeholder="请输入${comment}" />
        </el-form-item>
<#elseif field.htmlType == "textarea">
        <el-form-item label="${comment}" prop="${field.javaField}">
          <el-input v-model="form.${field.javaField}" type="textarea" placeholder="请输入${comment}" />
        </el-form-item>
<#elseif field.htmlType == "select">
        <el-form-item label="${comment}" prop="${field.javaField}">
          <el-select v-model="form.${field.javaField}" placeholder="请选择${comment}">
            <el-option v-for="dict in ${field.dictType!'[]'}" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
<#elseif field.htmlType == "radio">
        <el-form-item label="${comment}" prop="${field.javaField}">
          <el-radio-group v-model="form.${field.javaField}">
            <el-radio v-for="dict in ${field.dictType!'[]'}" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
<#elseif field.htmlType == "checkbox">
        <el-form-item label="${comment}" prop="${field.javaField}">
          <el-checkbox-group v-model="form.${field.javaField}">
            <el-checkbox v-for="dict in ${field.dictType!'[]'}" :key="dict.value" :label="dict.value">{{ dict.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
<#elseif field.htmlType == "datetime">
        <el-form-item label="${comment}" prop="${field.javaField}">
          <el-date-picker v-model="form.${field.javaField}" type="datetime" placeholder="选择${comment}" />
        </el-form-item>
<#elseif field.htmlType == "imageUpload">
        <el-form-item label="${comment}" prop="${field.javaField}">
          <image-upload v-model="form.${field.javaField}" />
        </el-form-item>
<#elseif field.htmlType == "fileUpload">
        <el-form-item label="${comment}" prop="${field.javaField}">
          <file-upload v-model="form.${field.javaField}" />
        </el-form-item>
<#elseif field.htmlType == "editor">
        <el-form-item label="${comment}" prop="${field.javaField}">
          <editor v-model="form.${field.javaField}" />
        </el-form-item>
</#if>
</#if>
</#list>
</#if>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="${codegen.businessName}">
import { list${codegen.businessName}, get${codegen.businessName}, add${codegen.businessName}, update${codegen.businessName}, del${codegen.businessName} } from "@/api/${codegen.moduleName}/${codegen.businessName?lower_case}"
import downloadPlugin from '@/utils/download'

const tableRef = ref(null)

const ${codegen.businessName?uncap_first}List = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const dateRange = ref([])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10
  },
  rules: {}
})

const { queryParams, form, rules } = toRefs(data)

function getList() {
  loading.value = true
  list${codegen.businessName}(queryParams.value).then(res => {
    ${codegen.businessName?uncap_first}List.value = res.data.data
    total.value = res.data.total
    loading.value = false
  })
}

function cancel() {
  open.value = false
  reset()
}

function reset() {
  form.value = {}
  resetForm("formRef")
}

function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

function resetQuery() {
  queryParams.value = { pageNum: 1, pageSize: 10 }
  dateRange.value = []
  getList()
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

function handleAdd() {
  reset()
  open.value = true
  title.value = "添加${codegen.functionName}"
}

function handleUpdate(row) {
  reset()
  const id = row.id || ids.value[0]
  get${codegen.businessName}(id).then(res => {
    form.value = res.data
    open.value = true
    title.value = "修改${codegen.functionName}"
  })
}

function submitForm() {
  formRef.value.validate(valid => {
    if (valid) {
      const submit = form.value.id ? update${codegen.businessName}(form.value) : add${codegen.businessName}(form.value)
      submit.then(() => {
        ElMessage.success(form.value.id ? "修改成功" : "新增成功")
        open.value = false
        getList()
      })
    }
  })
}

function handleDelete(row) {
  const delIds = row.id || ids.value
  ElMessageBox.confirm('是否确认删除编号为"' + delIds + '"的数据项？').then(() => {
    return del${codegen.businessName}(delIds)
  }).then(() => {
    getList()
    ElMessage.success("删除成功")
  }).catch(() => {})
}

function handleExport() {
  downloadPlugin.zip('/${codegen.moduleName}/${codegen.businessName?lower_case}/export', {
    ...queryParams.value
  }, "${codegen.businessName}_" + new Date().getTime() + ".xlsx")
}

getList()
</script>
