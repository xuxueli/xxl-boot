<!--
  页面：Log（日志管理）
  功能：查询、删除日志，查看日志详情
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="日志类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="日志类型" clearable style="width: 200px">
          <el-option label="全部" :value="-1" />
          <el-option v-for="item in typeOptions" :key="item.code" :label="item.title" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="系统模块" prop="module">
        <el-select v-model="queryParams.module" placeholder="系统模块" clearable style="width: 200px">
          <el-option label="全部" :value="0" />
          <el-option v-for="item in moduleOptions" :key="item.code" :label="item.title" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="日志标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入日志标题" clearable style="width: 200px"
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasRole="['admin']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport" v-hasRole="['admin']">导出</el-button>
      </el-col>
      <RightToolbar v-model:showSearch="showSearch" @queryTable="getList"></RightToolbar>
    </el-row>

    <!-- 日志列表 -->
    <el-table v-loading="loading" :data="logList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="日志编号" align="center" prop="id" width="80" />
      <el-table-column label="日志类型" align="center" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.type === 0 ? 'primary' : 'warning'" size="small">
            {{ typeText(scope.row.type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="系统模块" align="center" :show-overflow-tooltip="true">
        <template #default="scope">
          {{ moduleMap[scope.row.module] || scope.row.module }}
        </template>
      </el-table-column>
      <el-table-column label="日志标题" align="center" prop="title" :show-overflow-tooltip="true" />
      <el-table-column label="操作人" align="center" prop="operator" width="110" :show-overflow-tooltip="true" />
      <el-table-column label="操作地址" align="center" :show-overflow-tooltip="true" width="160">
        <template #default="scope">
          {{ scope.row.ipAddress || scope.row.ip }}
        </template>
      </el-table-column>
      <el-table-column label="新增时间" align="center" prop="addTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.addTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleDetail(scope.row)">详细</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 详情弹窗 -->
    <LogDetail v-model:visible="detailVisible" :row="detailRow" :module-map="moduleMap" />
  </div>
</template>

<script setup name="Log">
import LogDetail from './detail'
import { pageList, delOperlog } from "@/api/system/log"
import { loadEnumItem } from "@/api/system/dict/data"
import { parseTime } from '@/utils/common'
import { useFormReset } from '@/composables/useFormReset'
import modal from '@/utils/modal'
import { download } from '@/utils/request'

const resetForm = useFormReset()

const logList = ref([])           /* 日志列表数据 */
const total = ref(0)              /* 总条数 */
const detailVisible = ref(false)  /* 详情弹窗可见 */
const loading = ref(true)         /* 加载状态 */
const detailRow = ref({})         /* 当前查看的日志行 */
const showSearch = ref(true)      /* 是否显示搜索栏 */
const ids = ref([])               /* 选中行 ID 数组 */
const multiple = ref(true)        /* 是否多选 */

const typeOptions = ref([])       /* 日志类型下拉选项 */
const typeMap = ref({})           /* 日志类型编码 → 名称映射 */
const moduleOptions = ref([])     /* 系统模块下拉选项 */
const moduleMap = ref({})         /* 系统模块编码 → 名称映射 */

const queryParams = ref({
  pageNum: 1,       /* 当前页码 */
  pageSize: 10,     /* 每页条数 */
  type: -1,         /* 日志类型（-1 全部） */
  module: 0,        /* 系统模块编码（0 全部） */
  title: undefined  /* 日志标题 */
})

/** 查询日志列表 */
function getList() {
  loading.value = true
  // 前端分页参数 → 后端分页参数（offset/pagesize）
  const params = {
    ...queryParams.value,
    offset: (queryParams.value.pageNum - 1) * queryParams.value.pageSize,
    pagesize: queryParams.value.pageSize
  }
  delete params.pageNum
  delete params.pageSize
  pageList(params).then(response => {
    logList.value = response.data.data
    total.value = response.data.total
    loading.value = false
  })
}

/** 日志类型编码 → 文案 */
function typeText(type) {
  const item = typeOptions.value.find(i => i.code === type)
  return item ? item.title : type
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  resetForm("queryRef")
  queryParams.value.pageNum = 1
  getList()
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  multiple.value = !selection.length
}

/** 查看日志详情 */
function handleDetail(row) {
  detailRow.value = row
  detailVisible.value = true
}

/** 删除日志（顶部按钮 @click 传事件对象，取勾选 ids） */
function handleDelete(row) {
  const logIds = row && row.id != null ? row.id : ids.value
  if (logIds == null || (Array.isArray(logIds) && logIds.length === 0)) {
    return
  }
  modal.confirm('是否确认删除日志编号为"' + logIds + '"的数据项?').then(function () {
    return delOperlog(logIds)
  }).then(() => {
    getList()
    modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  download("system/log/export", {
    ...queryParams.value
  }, `log_${new Date().getTime()}.xlsx`)
}

// 加载日志类型、系统模块枚举（下拉选项）
loadEnumItem('LogTypeEnum').then(res => {
  typeOptions.value = res.data
  typeOptions.value.forEach(item => { typeMap.value[item.code] = item.title })
})
loadEnumItem('LogModuleEnum').then(res => {
  moduleOptions.value = res.data
  moduleOptions.value.forEach(item => { moduleMap.value[item.code] = item.title })
})

// 页面初始化加载日志列表
getList()
</script>
