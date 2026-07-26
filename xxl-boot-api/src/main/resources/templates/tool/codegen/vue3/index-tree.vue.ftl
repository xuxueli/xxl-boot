<!--
  ${codegen.functionName} 树表列表页
  Created by ${codegen.functionAuthor} on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.
-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
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
    </el-row>

    <el-table v-loading="loading" :data="${codegen.businessName?uncap_first}List" row-key="id" default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="名称" prop="name" :show-overflow-tooltip="true" />
<#if fields?? && fields?size gt 0>
<#list fields as field>
      <el-table-column label="${field.columnComment}" prop="${field.javaField}" :show-overflow-tooltip="true" />
</#list>
</#if>
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="${codegen.businessName?uncap_first}Ref" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级" prop="parentId">
          <el-tree-select v-model="form.parentId" :data="${codegen.businessName?uncap_first}Options"
            :props="{value: 'id', label: 'name', children: 'children'}" placeholder="请选择上级" check-strictly />
        </el-form-item>
<#if fields?? && fields?size gt 0>
<#list fields as field>
        <el-form-item label="${field.columnComment}" prop="${field.javaField}">
          <el-input v-model="form.${field.javaField}" placeholder="请输入${field.columnComment}" />
        </el-form-item>
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

<script setup name="${codegen.businessName}Tree">
import { list${codegen.businessName}, get${codegen.businessName}, add${codegen.businessName}, update${codegen.businessName}, del${codegen.businessName} } from "@/api/${codegen.moduleName}/${codegen.businessName?lower_case}"
import { useFormReset } from '@/composables/useFormReset'
import modal from '@/utils/modal'

const resetForm = useFormReset()

const ${codegen.businessName?uncap_first}List = ref([])
const ${codegen.businessName?uncap_first}Options = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    name: undefined,
    pageNum: 1,
    pageSize: 10
  },
  rules: {}
})

const { queryParams, form, rules } = toRefs(data)

/** 查询${codegen.functionName}列表 */
function getList() {
  loading.value = true
  list${codegen.businessName}(queryParams.value).then(res => {
    ${codegen.businessName?uncap_first}List.value = res.data
    loading.value = false
  })
}

/** 查询树选项 */
function get${codegen.businessName}Treeselect() {
  list${codegen.businessName}({pageSize: 999}).then(res => {
    ${codegen.businessName?uncap_first}Options.value = res.data
  })
}

/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}

/** 表单重置 */
function reset() {
  form.value = { id: undefined, parentId: 0 }
  resetForm("${codegen.businessName?uncap_first}Ref")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  resetForm("queryRef")
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd(row) {
  reset()
  get${codegen.businessName}Treeselect()
  if (row) form.value.parentId = row.id
  open.value = true
  title.value = "添加${codegen.functionName}"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  get${codegen.businessName}Treeselect()
  const id = row.id || ids.value[0]
  get${codegen.businessName}(id).then(res => {
    form.value = res.data
    open.value = true
    title.value = "修改${codegen.functionName}"
  })
}

/** 提交按钮 */
function submitForm() {
  ${codegen.businessName?uncap_first}Ref.value.validate(valid => {
    if (valid) {
      if (form.value.id != undefined) {
        update${codegen.businessName}(form.value).then(() => {
          modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        add${codegen.businessName}(form.value).then(() => {
          modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const delIds = row.id || ids.value
  modal.confirm('是否确认删除编号为"' + delIds + '"的数据项？').then(() => {
    return del${codegen.businessName}(delIds)
  }).then(() => {
    getList()
    modal.msgSuccess("删除成功")
  }).catch(() => {})
}

getList()
</script>
