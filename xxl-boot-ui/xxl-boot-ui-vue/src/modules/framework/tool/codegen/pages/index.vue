<!--
  页面：代码生成管理
  功能：查询、创建、修改、删除、预览、生成代码
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="table.showSearch">
      <el-form-item label="表名称" prop="tableName">
        <el-input v-model="queryParams.tableName" placeholder="请输入表名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="表描述" prop="tableComment">
        <el-input v-model="queryParams.tableComment" placeholder="请输入表描述" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="openCreateDialog" v-hasRole="['admin']">创建</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="table.single" @click="handleEditTable" v-hasRole="['admin']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="table.multiple" @click="handleDelete" v-hasRole="['admin']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Download" :disabled="table.multiple" @click="handleGenTable" v-hasRole="['admin']"
          >生成</el-button
        >
      </el-col>
      <RightToolbar v-model:showSearch="table.showSearch" @queryTable="getList"></RightToolbar>
    </el-row>

    <!-- 表格区域 -->
    <el-table ref="genRef" v-loading="table.loading" :data="table.list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="55"></el-table-column>
      <el-table-column label="序号" type="index" width="50" align="center">
        <template #default="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表名称" align="center" prop="tableName" :show-overflow-tooltip="true" />
      <el-table-column label="表描述" align="center" prop="tableComment" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="addTime" width="160" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="160" />
      <el-table-column label="操作" align="center" width="330" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button link type="primary" icon="Edit" @click="handleEditTable(scope.row)" v-hasRole="['admin']">编辑</el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasRole="['admin']">删除</el-button>
          </el-tooltip>
          <el-tooltip content="预览" placement="top">
            <el-button link type="primary" icon="View" @click="handlePreview(scope.row)" v-hasRole="['admin']">预览</el-button>
          </el-tooltip>
          <el-tooltip content="生成代码" placement="top">
            <el-button link type="primary" icon="Download" @click="handleGenTable(scope.row)" v-hasRole="['admin']">生成代码</el-button>
          </el-tooltip>
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

    <!-- 预览界面 -->
    <el-dialog :title="preview.title" v-model="preview.open" width="80%" top="5vh" append-to-body class="scrollbar">
      <el-tabs v-model="preview.activeName">
        <el-tab-pane
          v-for="(value, key) in preview.data"
          :label="key.substring(key.lastIndexOf('/') + 1, key.indexOf('.ftl'))"
          :name="key.substring(key.lastIndexOf('/') + 1, key.indexOf('.ftl'))"
          :key="value"
        >
          <el-link underline="never" icon="DocumentCopy" v-copyText="value" v-copyText:callback="copyTextSuccess" style="float: right"
            >&nbsp;复制
          </el-link>
          <pre>{{ value }}</pre>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 创建表弹窗 -->
    <el-dialog v-model="createDialog.visible" title="创建表" width="800px" top="5vh" append-to-body>
      <span>创建表语句(支持多个建表语句)：</span>
      <el-input type="textarea" :rows="10" placeholder="请输入文本" v-model="createDialog.content"></el-input>
      <template #footer>
        <el-button type="primary" @click="handleCreateTable">确 定</el-button>
        <el-button @click="createDialog.visible = false">取 消</el-button>
      </template>
    </el-dialog>

    <!-- 编辑代码生成信息 -->
    <EditTable ref="editRef" @ok="handleQuery" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Gen' })
import { listTable, previewTable, delTable, createTable } from '../api'
import type { CodegenTable } from '../types'
import { useFormReset } from '@/composables/useFormReset'
import modal from '@/utils/modal'
import downloadPlugin from '@/utils/download'
import EditTable from './editTable.vue'
import { onActivated, ref } from 'vue'
import { useRoute } from 'vue-router'
import { RightToolbar, Pagination } from '@/components'

const resetForm = useFormReset()

/* --------------------------------- ref data --------------------------------- */

// 路由参数
const route = useRoute() /* 当前路由 */
const uniqueId = ref('') /* 页面路由唯一标识 */

// 组件实例引用
const editRef = ref<InstanceType<typeof EditTable> | null>(null) /* 编辑弹窗 ref */

// 搜索栏：查询参数
const queryParams = ref({
  pageNum: 1 /* 当前页码 */,
  pageSize: 10 /* 每页条数 */,
  tableName: undefined /* 表名称 */,
  tableComment: undefined /* 表描述 */
})

// 表格：UI数据
const table = ref({
  list: [] as CodegenTable[] /* 表列表数据 */,
  total: 0 /* 总条数 */,
  loading: true /* 加载状态 */,
  showSearch: true /* 是否显示搜索栏 */,
  ids: [] as number[] /* 选中行 ID 数组 */,
  single: true /* 是否单选 */,
  multiple: true /* 是否多选 */
})

// 预览弹窗
const preview = ref({
  open: false /* 弹窗显隐 */,
  title: '代码预览' /* 弹窗标题 */,
  data: {} as Record<string, string> /* 预览代码数据 */,
  activeName: 'entity.java' /* 激活标签 */
})

// 创建表弹窗
const createDialog = ref({
  visible: false /* 弹窗显隐 */,
  content: '' /* 建表 SQL 语句 */
})

/* --------------------------------- fun --------------------------------- */

/** 页面激活时：若路由携带时间戳且与上次不同，则刷新列表 */
onActivated(() => {
  const time = route.query.t
  if (time != null && time !== uniqueId.value) {
    uniqueId.value = time as string
    queryParams.value.pageNum = Number(route.query.pageNum)
    resetForm('queryForm')
    getList()
  }
})

/** 查询表集合 */
function getList() {
  table.value.loading = true
  listTable(queryParams.value).then((response) => {
    table.value.list = response.data.data
    table.value.total = response.data.total
    table.value.loading = false
  })
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  resetForm('queryRef')
  queryParams.value.pageNum = 1
  getList()
}

/** 多选框选中数据 */
function handleSelectionChange(selection: CodegenTable[]) {
  table.value.ids = selection.map((item) => item.id as number)
  table.value.single = selection.length != 1
  table.value.multiple = !selection.length
}

/** 生成代码操作 */
function handleGenTable(row: any) {
  const idList = row && row.id != null ? [row.id] : table.value.ids
  if (!idList || idList.length === 0) {
    modal.msgError('请选择要生成的数据')
    return
  }
  const zipName = 'xxl-boot-codegen.zip'
  const query = idList.map((id) => 'ids=' + id).join('&')
  downloadPlugin.zip('/tool/codegen/batchGenCode?' + query, zipName)
}

/** 打开创建表弹窗 */
function openCreateDialog() {
  let demo_sql = `CREATE TABLE \`product01\` (
      \`id\`            INT             NOT NULL AUTO_INCREMENT      COMMENT '主键ID',
      \`name\`          VARCHAR(50)     NOT NULL                     COMMENT '产品名称',
      \`num\`           INT             NOT NULL                     COMMENT '产品数量',
      \`add_time\`      DATETIME        NOT NULL                     COMMENT '新增时间',
      \`update_time\`   DATETIME        NOT NULL                     COMMENT '更新时间',
      PRIMARY KEY (\`id\`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT='产品信息表';
  `

  createDialog.value.content = demo_sql
  createDialog.value.visible = true
}

/** 创建表 */
function handleCreateTable() {
  if (createDialog.value.content === '') {
    modal.msgError('请输入建表语句')
    return
  }
  // 新建时携带前端模板类型，与后端 createTable 入参匹配
  createTable({ tableSql: createDialog.value.content, tplWebType: 'element-plus-typescript' }).then(() => {
    modal.msgSuccess('创建成功')
    createDialog.value.visible = false
    handleQuery()
  })
}

/** 预览按钮 */
function handlePreview(row: any) {
  previewTable(row.id).then((response) => {
    preview.value.data = response.data
    preview.value.open = true
    const keys = Object.keys(response.data)
    preview.value.activeName = keys.length > 0 ? keys[0].substring(keys[0].lastIndexOf('/') + 1, keys[0].indexOf('.ftl')) : 'entity.java'
  })
}

/** 复制代码成功 */
function copyTextSuccess() {
  modal.msgSuccess('复制成功')
}

/** 修改按钮操作（顶部按钮 @click 传事件对象，需取勾选 id） */
function handleEditTable(row: any) {
  // 顶部按钮点击传入的是事件对象而非行数据，此时取勾选 id
  const id = row?.id ?? table.value.ids[0]
  if (id == null) {
    return
  }
  editRef.value!.open(id)
}

/** 删除按钮操作（顶部按钮 @click 传事件对象，需取勾选 ids） */
function handleDelete(row: any) {
  const tableIds = row?.id ?? table.value.ids
  if (tableIds == null || (Array.isArray(tableIds) && tableIds.length === 0)) {
    return
  }
  modal
    .confirm('是否确认删除表编号为"' + tableIds + '"的数据项？')
    .then(function () {
      return delTable(tableIds)
    })
    .then(() => {
      getList()
      modal.msgSuccess('删除成功')
    })
    .catch(() => {})
}

/* --------------------------------- page init --------------------------------- */
getList()
</script>
