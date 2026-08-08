<!--
  页面：Config（配置管理）
  功能：查询、新增、修改、删除系统配置
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="table.showSearch">
      <el-form-item label="配置名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入配置名称"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="配置Key" prop="key">
        <el-input
          v-model="queryParams.key"
          placeholder="请输入配置Key"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="配置状态" clearable style="width: 200px">
          <el-option label="全部" :value="-1" />
          <el-option v-for="item in statusOptions" :key="item.code" :label="item.title" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasRole="['admin']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="table.single" @click="handleUpdate" v-hasRole="['admin']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="table.multiple" @click="handleDelete" v-hasRole="['admin']">删除</el-button>
      </el-col>
      <RightToolbar v-model:showSearch="table.showSearch" @queryTable="getList"></RightToolbar>
    </el-row>

    <!-- 配置列表 -->
    <el-table v-loading="table.loading" :data="table.list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" width="50" />
      <el-table-column label="配置名称" align="center" prop="name" width="180" :show-overflow-tooltip="true" />
      <el-table-column label="配置Key" align="center" prop="key" width="180" :show-overflow-tooltip="true" />
      <el-table-column label="配置Value" align="center" prop="value" :show-overflow-tooltip="true" />
      <el-table-column label="状态" align="center" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'" size="small">
            {{ statusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="新增时间" align="center" prop="addTime" width="170" />
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasRole="['admin']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasRole="['admin']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination
      v-show="table.total > 0"
      :total="table.total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改配置对话框 -->
    <el-dialog :title="formState.title" v-model="formState.visible" width="500px" append-to-body>
      <el-form ref="formRef" :model="formState.form" :rules="formState.rules" label-width="100px">
        <el-form-item label="配置名称" prop="name">
          <el-input v-model="formState.form.name" placeholder="请输入配置名称" />
        </el-form-item>
        <el-form-item label="配置Key" prop="key">
          <el-input v-model="formState.form.key" placeholder="请输入配置Key" :disabled="formState.form.id != undefined" />
        </el-form-item>
        <el-form-item label="配置Value" prop="value">
          <el-input v-model="formState.form.value" type="textarea" placeholder="请输入配置Value" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formState.form.status">
            <el-radio v-for="item in statusOptions" :key="item.code" :value="item.code">{{ item.title }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formState.form.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Config" lang="ts">
import { listConfig, getConfig, delConfig, addConfig, updateConfig } from '@/api/system/config'
import { useEnumOption } from '@/composables/useEnumOption'
import { useFormReset } from '@/composables/useFormReset'
import { usePageParams } from '@/composables/usePageParams'
import modal from '@/utils/modal'
import type { Config, ConfigQuery } from '@/types/api'
import type { EnumOption, TableState, FormState } from '@/types'
import type { FormInstance, FormRules } from 'element-plus'

const resetForm = useFormReset()




// --------------------------------- ref data ---------------------------------

// 组件实例引用：模板 ref
const formRef = ref<FormInstance>()   /* 编辑表单实例引用 */

// 搜索栏：查询参数
const queryParams = ref<ConfigQuery>({
  pageNum: 1,        /* 当前页码 */
  pageSize: 10,      /* 每页条数 */
  name: undefined,   /* 配置名称 */
  key: undefined,    /* 配置Key */
  status: -1         /* 状态（-1 全部、0 正常、1 停用） */
})

// 编辑弹窗：表单状态（表单数据 + 校验规则 + 弹窗显隐/标题）
const formState = ref<FormState<Config>>({
  visible: false,  /* 对话框显隐 */
  title: "",       /* 对话框标题 */
  form: {},        /* 表单数据 */
  rules: {         /* 校验规则 */
    name: [{ required: true, message: "配置名称不能为空", trigger: "blur" }],
    key: [
      { required: true, message: "配置Key不能为空", trigger: "blur" },
      { pattern: /^[a-z][a-z0-9.]*$/, message: "以小写字母开头，只能由小写字母、数字和点组成", trigger: "blur" },
      { min: 4, max: 100, message: "长度需在4-100之间", trigger: "blur" }
    ],
    value: [{ required: true, message: "配置Value不能为空", trigger: "blur" }]
  },
})

// 表格：UI数据
const table = ref<TableState<Config>>({
  list: [],          /* 配置列表 */
  total: 0,          /* 总条数 */
  loading: true,     /* 加载状态 */
  showSearch: true,  /* 是否显示搜索栏 */
  ids: [],           /* 选中行 ID 数组 */
  single: true,      /* 是否单选 */
  multiple: true     /* 是否多选 */
})

// 状态选项（从后端枚举接口加载，枚举项属性为 code、title）
const { ConfigStatusEnum: statusOptions } = useEnumOption('ConfigStatusEnum')


// --------------------------------- fun ---------------------------------

/** 从后端枚举接口加载状态选项 */


/** 查询配置列表 */
function getList() {
  table.value.loading = true
  // 前端分页参数 → 后端请求参数（offset/pagesize）
  const params = usePageParams(queryParams)()
  listConfig(params).then(response => {
    table.value.list = response.data.data
    table.value.total = response.data.total
    table.value.loading = false
  })
}

/** 状态编码 → 文案 */
function statusText(status: number) {
  const item = statusOptions.value.find(i => i.code === status)
  return item ? item.title : status
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
    name: undefined,
    key: undefined,
    value: undefined,
    status: 0,
    remark: undefined
  }
  resetForm("formRef")
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
function handleSelectionChange(selection: Config[]) {
  table.value.ids = selection.map(item => item.id as number)
  table.value.single = selection.length !== 1
  table.value.multiple = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  formState.value.visible = true
  formState.value.title = "新增配置"
}

/** 修改按钮操作（顶部按钮 @click 传事件对象，需取勾选 id） */
function handleUpdate(row: any) {
  reset()
  // 顶部按钮点击传入的是事件对象而非行数据，此时取勾选 id
  const id = row?.id ?? table.value.ids[0]
  if (id == null) {
    return
  }
  getConfig(id).then(response => {
    formState.value.form = response.data
    formState.value.visible = true
    formState.value.title = "修改配置"
  })
}

/** 提交按钮 */
function submitForm() {
  formRef.value!.validate(valid => {
    if (valid) {
      // 已有 id 走更新，否则走新增
      if (formState.value.form.id != undefined) {
        updateConfig(formState.value.form).then(response => {
          modal.msgSuccess("修改成功")
          formState.value.visible = false
          getList()
        })
      } else {
        addConfig(formState.value.form).then(response => {
          modal.msgSuccess("新增成功")
          formState.value.visible = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作（顶部按钮 @click 传事件对象，需取勾选 ids） */
function handleDelete(row: any) {
  const configIds = row?.id ?? table.value.ids
  if (configIds == null || (Array.isArray(configIds) && configIds.length === 0)) {
    return
  }
  modal.confirm('是否确认删除配置编号为"' + configIds + '"的数据项？').then(function() {
    return delConfig(configIds)
  }).then(() => {
    getList()
    modal.msgSuccess("删除成功")
  }).catch(() => {})
}


// --------------------------------- page init ---------------------------------

// 页面初始化：加载状态选项 + 配置列表
getList()

</script>
