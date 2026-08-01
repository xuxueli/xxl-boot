<!--
  页面：Log（日志管理）
  功能：查询、删除日志，查看日志详情
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="日志类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="日志类型" clearable style="width: 240px">
          <el-option label="操作日志" :value="0" />
          <el-option label="登陆日志" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="系统模块" prop="module">
        <el-select v-model="queryParams.module" placeholder="系统模块" clearable style="width: 240px">
          <el-option v-for="item in moduleOptions" :key="item.code" :label="item.title" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="日志标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入日志标题" clearable style="width: 240px"
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
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
      </el-col>
      <RightToolbar v-model:showSearch="showSearch" @queryTable="getList"></RightToolbar>
    </el-row>

    <!-- 日志列表 -->
    <el-table ref="logRef" v-loading="loading" :data="logList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="日志编号" align="center" prop="id" width="80" />
      <el-table-column label="日志类型" align="center" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.type === 0 ? 'primary' : 'warning'" size="small">
            {{ scope.row.type === 0 ? '操作日志' : scope.row.type === 1 ? '登陆日志' : scope.row.type }}
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

const logRef = ref(null)            /* 表格 ref */
const logList = ref([])             /* 日志列表数据 */
const total = ref(0)                /* 总条数 */
const detailVisible = ref(false)    /* 详情弹窗可见 */
const loading = ref(true)           /* 加载中 */
const detailRow = ref({})           /* 当前查看的日志行 */
const showSearch = ref(true)        /* 是否显示搜索栏 */
const ids = ref([])                 /* 选中行 ID 数组 */
const single = ref(true)            /* 是否单选 */
const multiple = ref(true)          /* 是否多选 */
const title = ref("")               /* 对话框标题 */
const moduleOptions = ref([])       /* 系统模块下拉选项 */
const moduleMap = ref({})           /* 系统模块编码 → 名称映射 */

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,         /* 当前页码 */
    pageSize: 10,       /* 每页条数 */
    type: undefined,    /* 日志类型 */
    module: undefined,  /* 系统模块编码 */
    title: undefined    /* 日志标题 */
  }
})

const { queryParams, form } = toRefs(data)

/** 查询日志列表 */
function getList() {
  loading.value = true
  // 前端分页参数 → 后端分页参数
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

/** 搜索按钮 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮 */
function resetQuery() {
  resetForm("queryRef")
  queryParams.value.pageNum = 1
  getList()
}

/** 多选框选中 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  multiple.value = !selection.length
}

/** 详细按钮 */
function handleDetail(row) {
  detailRow.value = row
  detailVisible.value = true
}

/** 删除按钮 */
function handleDelete(row) {
  const logIds = row.id || ids.value
  modal.confirm('是否确认删除日志编号为"' + logIds + '"的数据项?').then(function () {
    return delOperlog(logIds)
  }).then(() => {
    getList()
    modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮 */
function handleExport() {
  download("system/log/export", {
    ...queryParams.value
  }, `log_${new Date().getTime()}.xlsx`)
}

// 加载系统模块枚举
loadEnumItem('LogModuleEnum').then(data => {
  moduleOptions.value = data.data
  moduleOptions.value.forEach(item => { moduleMap.value[item.code] = item.title })
})

// 初始化查询
getList()
</script>
