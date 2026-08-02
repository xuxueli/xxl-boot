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

    <!-- 添加或修改${codegen.functionName}对话框 -->
    <el-dialog :title="formState.title" v-model="formState.visible" width="600px" append-to-body>
      <el-form ref="${codegen.businessName?uncap_first}Ref" :model="formState.form" :rules="formState.rules" label-width="80px">
        <el-form-item label="上级" prop="parentId">
          <el-tree-select v-model="formState.form.parentId" :data="table.options"
            :props="{value: 'id', label: 'name', children: 'children'}" placeholder="请选择上级" check-strictly />
        </el-form-item>
<#if fields?? && fields?size gt 0>
<#list fields as field>
        <el-form-item label="${field.columnComment}" prop="${field.javaField}">
          <el-input v-model="formState.form.${field.javaField}" placeholder="请输入${field.columnComment}" />
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


// --------------------------------- ref data ---------------------------------

// 搜索栏：查询参数
const queryParams = ref({
  name: undefined, /* 名称关键词 */
  pageNum: 1,      /* 当前页码 */
  pageSize: 10     /* 每页条数 */
})

// 表格：UI 数据
const table = ref({
  list: [],          /* 树表数据 */
  options: [],       /* 上级选项数据 */
  loading: true,     /* 加载状态 */
  showSearch: true,  /* 是否显示搜索栏 */
  ids: [],           /* 选中行 ID 数组 */
  single: true,      /* 是否单选 */
  multiple: true     /* 是否多选 */
})

// 编辑表单：数据状态
const formState = ref({
  visible: false,  /* 对话框显隐 */
  title: "",       /* 对话框标题 */
  form: {},        /* 表单数据 */
  rules: {}        /* 校验规则 */
})


// --------------------------------- fun ---------------------------------

/** 查询${codegen.functionName}树表列表 */
function getList() {
  table.value.loading = true
  list${codegen.businessName}(queryParams.value).then(res => {
    table.value.list = res.data
    table.value.loading = false
  })
}

/** 查询上级树选项 */
function get${codegen.businessName}Treeselect() {
  list${codegen.businessName}({ pageSize: 999 }).then(res => {
    table.value.options = res.data
  })
}

/** 取消按钮 */
function cancel() {
  formState.value.visible = false
  reset()
}

/** 表单重置 */
function reset() {
  formState.value.form = { id: undefined, parentId: 0 }
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
  table.value.ids = selection.map(item => item.id)
  table.value.single = selection.length !== 1
  table.value.multiple = !selection.length
}

/** 新增按钮操作（行内新增按钮点击传入行数据，用于指定上级） */
function handleAdd(row) {
  reset()
  get${codegen.businessName}Treeselect()
  // 行内新增按钮传入行数据时，指定其为上级
  if (row && row.id != null) {
    formState.value.form.parentId = row.id
  }
  formState.value.visible = true
  formState.value.title = "添加${codegen.functionName}"
}

/** 修改按钮操作（顶部按钮 @click 传事件对象，需取勾选 id） */
function handleUpdate(row) {
  reset()
  get${codegen.businessName}Treeselect()
  // 顶部按钮点击传入的是事件对象而非行数据，此时取勾选 id
  const id = row && row.id != null ? row.id : table.value.ids[0]
  if (id == null) {
    return
  }
  get${codegen.businessName}(id).then(res => {
    formState.value.form = res.data
    formState.value.visible = true
    formState.value.title = "修改${codegen.functionName}"
  })
}

/** 提交按钮 */
function submitForm() {
  ${codegen.businessName?uncap_first}Ref.value.validate(valid => {
    if (valid) {
      // 已有 id 走更新，否则走新增
      if (formState.value.form.id != undefined) {
        update${codegen.businessName}(formState.value.form).then(res => {
          modal.msgSuccess("修改成功")
          formState.value.visible = false
          getList()
        })
      } else {
        add${codegen.businessName}(formState.value.form).then(res => {
          modal.msgSuccess("新增成功")
          formState.value.visible = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作（顶部按钮 @click 传事件对象，需取勾选 ids） */
function handleDelete(row) {
  const delIds = row && row.id != null ? row.id : table.value.ids
  if (delIds == null || (Array.isArray(delIds) && delIds.length === 0)) {
    return
  }
  modal.confirm('是否确认删除编号为"' + delIds + '"的数据项？').then(function() {
    return del${codegen.businessName}(delIds)
  }).then(() => {
    getList()
    modal.msgSuccess("删除成功")
  }).catch(() => {})
}


// --------------------------------- page init ---------------------------------

// 页面初始化：加载${codegen.functionName}树表列表
getList()

</script>
