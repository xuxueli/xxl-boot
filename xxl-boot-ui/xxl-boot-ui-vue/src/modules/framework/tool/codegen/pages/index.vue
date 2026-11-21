<!--
  Codegen（代码生成管理）
  功能：代码生成表的分页查询、创建、编辑、删除、预览与生成代码
  @author xuxueli 2026-11-21
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="auto" v-show="table.showSearch">
      <el-form-item :label="t('tool.codegen.tableName')" prop="tableName">
        <el-input v-model="queryParams.tableName" :placeholder="t('common.inputPlaceholder', [t('tool.codegen.tableName')])" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item :label="t('tool.codegen.tableComment')" prop="tableComment">
        <el-input v-model="queryParams.tableComment" :placeholder="t('common.inputPlaceholder', [t('tool.codegen.tableComment')])" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">{{ t('common.search') }}</el-button>
        <el-button icon="Refresh" @click="resetQuery">{{ t('common.reset') }}</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="openCreateForm" v-hasRole="['admin']">{{ t('common.add') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="table.single" @click="openEditForm()" v-hasRole="['admin']">{{ t('common.modify') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="table.multiple" @click="removeCodegen()" v-hasRole="['admin']">{{ t('common.delete') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Download" :disabled="table.multiple" @click="generateCode()" v-hasRole="['admin']">{{ t('tool.codegen.generateButton') }}</el-button>
      </el-col>
      <RightToolbar v-model:showSearch="table.showSearch" @queryTable="getList" />
    </el-row>

    <!-- 数据列表 -->
    <el-table v-loading="table.loading" :data="table.list" @selection-change="syncSelection">
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column :label="t('common.serialNo')" prop="id" align="center" width="80" />
      <el-table-column :label="t('tool.codegen.tableName')" align="center" prop="tableName" show-overflow-tooltip />
      <el-table-column :label="t('tool.codegen.tableComment')" align="center" prop="tableComment" show-overflow-tooltip />
      <el-table-column :label="t('common.createTime')" align="center" prop="addTime" width="160" />
      <el-table-column :label="t('common.updateTime')" align="center" prop="updateTime" width="160" />
      <el-table-column :label="t('common.operation')" align="center" width="330" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip :content="t('common.edit')" placement="top">
            <el-button link type="primary" icon="Edit" @click="openEditForm(scope.row)" v-hasRole="['admin']">{{ t('common.edit') }}</el-button>
          </el-tooltip>
          <el-tooltip :content="t('common.delete')" placement="top">
            <el-button link type="primary" icon="Delete" @click="removeCodegen(scope.row)" v-hasRole="['admin']">{{ t('common.delete') }}</el-button>
          </el-tooltip>
          <el-tooltip :content="t('tool.codegen.preview')" placement="top">
            <el-button link type="primary" icon="View" @click="previewCode(scope.row)" v-hasRole="['admin']">{{ t('tool.codegen.preview') }}</el-button>
          </el-tooltip>
          <el-tooltip :content="t('tool.codegen.generate')" placement="top">
            <el-button link type="primary" icon="Download" @click="generateCode(scope.row)" v-hasRole="['admin']">{{ t('tool.codegen.generate') }}</el-button>
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
    <el-dialog :title="preview.title" v-model="preview.open" width="80%" top="5vh" append-to-body class="scrollbar" :close-on-click-modal="false">
      <el-tabs v-model="preview.activeName">
        <el-tab-pane v-for="(value, key) in preview.data" :label="previewTabName(key)" :name="previewTabName(key)" :key="key">
          <el-link underline="never" icon="DocumentCopy" v-copyText="value" v-copyText:callback="copyTextSuccess" style="float: right">
            &nbsp;{{ t('common.copy') }}
          </el-link>
          <pre>{{ value }}</pre>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 创建表对话框 -->
    <el-dialog v-model="createVisible" :title="t('tool.codegen.createTable')" width="800px" top="5vh" append-to-body :close-on-click-modal="false" @closed="resetCreateForm">
      <span>{{ t('tool.codegen.createTableTip') }}</span>
      <el-input type="textarea" :rows="10" :placeholder="t('common.inputPlaceholder', [t('components.editor.text')])" v-model="createSql" />
      <template #footer>
        <el-button type="primary" @click="saveForm">{{ t('modal.confirmButton') }}</el-button>
        <el-button @click="closeForm">{{ t('modal.cancelButton') }}</el-button>
      </template>
    </el-dialog>

    <!-- 编辑代码生成信息 -->
    <EditTable ref="editRef" @ok="handleQuery" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Codegen' })
import { onActivated, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { FormInstance } from 'element-plus'
import { t } from '@/i18n'
import { Pagination, RightToolbar } from '@/components'
import modal from '@/utils/modal'
import downloadPlugin from '@/utils/download'
import { codegenApi } from '../api'
import type { CodegenQuery, CodegenTable } from '../types'
import type { TableState } from '@/types'
import EditTable from './editTable.vue'

// ---------------------- 响应式数据 ----------------------

const route = useRoute() /* 当前路由 */
const uniqueId = ref('') /* 页面路由唯一标识 */

const editRef = ref<InstanceType<typeof EditTable> | null>(null) /* 编辑弹窗 ref */
const queryRef = ref<FormInstance>() /* 搜索栏表单 ref */

// 搜索栏筛选条件与分页参数
const queryParams = ref<CodegenQuery>({
  pageNum: 1 /* 当前页码 */,
  pageSize: 10 /* 每页条数 */,
  tableName: undefined /* 表名称 */,
  tableComment: undefined /* 表描述 */
})

// 列表数据与勾选状态，勾选结果决定顶部按钮是否可用
const table = ref<TableState<CodegenTable>>({
  list: [], // 表列表数据
  total: 0, // 总条数
  loading: true, // 加载状态
  showSearch: true, // 是否显示搜索栏
  ids: [], // 勾选行主键
  single: true, // 修改按钮是否禁用
  multiple: true // 删除按钮是否禁用
})

// 预览弹窗状态
const preview = ref({
  open: false /* 弹窗显隐 */,
  title: t('tool.codegen.codePreview') /* 弹窗标题 */,
  data: {} as Record<string, string> /* 预览代码数据 */,
  activeName: 'entity.java' /* 激活标签 */
})

// 创建表弹窗状态
const createVisible = ref(false) /* 弹窗显隐 */
const createSql = ref('') /* 建表 SQL 语句 */

// 建表示例 SQL：同步建表方式，便于用户直接改为业务表结构
const DEMO_TABLE_SQL = `CREATE TABLE \`product01\` (
    \`id\`            INT             NOT NULL AUTO_INCREMENT      COMMENT 'primary key',
    \`name\`          VARCHAR(50)     NOT NULL                     COMMENT 'product name',
    \`num\`           INT             NOT NULL                     COMMENT 'product quantity',
    \`add_time\`      DATETIME        NOT NULL                     COMMENT 'add time',
    \`update_time\`   DATETIME        NOT NULL                     COMMENT 'update time',
    PRIMARY KEY (\`id\`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT='product info';`

// ---------------------- 分页检索 ----------------------

/**
 * 查询代码生成表分页数据
 *
 * 失败提示由请求层统一处理，此处只负责复位 loading
 */
function getList() {
  table.value.loading = true
  // 分页参数由 API 内部转换为后端约定的 offset/pagesize
  codegenApi
    .pageList(queryParams.value)
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

/** 搜索：回到第一页后查询 */
function handleQuery() {
  // 筛选条件已变化，回到第一页可避免停留在超出结果范围的页码
  queryParams.value.pageNum = 1
  getList()
}

/** 重置搜索条件后重新查询 */
function resetQuery() {
  queryRef.value?.resetFields()
  handleQuery()
}

// ---------------------- 数据操作（增删改） ----------------------

/**
 * 同步表格勾选结果，驱动批量修改/删除按钮状态
 *
 * @param selection 当前勾选行
 */
function syncSelection(selection: CodegenTable[]) {
  table.value.ids = selection.map((item) => item.id as number)
  table.value.single = selection.length !== 1
  table.value.multiple = !selection.length
}

/** 预览标签名：取文件名中的模板名（如 entity.java） */
function previewTabName(path: string) {
  return path.substring(path.lastIndexOf('/') + 1, path.indexOf('.ftl'))
}

/**
 * 预览生成代码
 *
 * @param row 当前行数据
 */
function previewCode(row: CodegenTable) {
  if (row.id == null) return
  codegenApi
    .preview(row.id)
    .then((response) => {
      preview.value.data = response.data
      preview.value.open = true
      const keys = Object.keys(response.data)
      // 默认激活第一个文件，空结果时回退到 entity.java
      preview.value.activeName = keys.length > 0 ? previewTabName(keys[0]) : 'entity.java'
    })
    .catch(() => {})
}

/** 复制代码成功提示 */
function copyTextSuccess() {
  modal.msgSuccess(t('tool.codegen.copySuccess'))
}

/**
 * 生成代码：行按钮生成当前行，顶部按钮生成勾选行
 *
 * @param row 行数据；顶部按钮调用时为空，此时取勾选行
 */
function generateCode(row?: CodegenTable) {
  const ids = row ? (row.id != null ? [row.id] : []) : table.value.ids
  // 未选择数据时直接提示，避免请求后端返回空结果
  if (ids.length === 0) {
    modal.msgError(t('tool.codegen.selectGenData'))
    return
  }
  const zipName = 'xxl-boot-codegen.zip'
  const query = ids.map((id) => 'ids=' + id).join('&')
  downloadPlugin.zip('/tool/codegen/batchGenCode?' + query, zipName)
}

/** 打开创建表弹窗，预填示例建表 SQL */
function openCreateForm() {
  createSql.value = DEMO_TABLE_SQL
  createVisible.value = true
}

/** 重置创建表弹窗内容 */
function resetCreateForm() {
  createSql.value = ''
}

/** 创建表：校验 SQL 后提交并刷新列表 */
function saveForm() {
  // 空 SQL 无法建表，直接提示用户补充
  if (createSql.value.trim() === '') {
    modal.msgError(t('tool.codegen.enterCreateSql'))
    return
  }
  codegenApi
    .createTable({ tableSql: createSql.value, tplWebType: 'element-plus-typescript' })
    .then(() => {
      modal.msgSuccess(t('tool.codegen.createSuccess'))
      closeForm()
      handleQuery()
    })
    .catch(() => {})
}

/** 关闭创建表弹窗：内容重置统一交给 @closed */
function closeForm() {
  createVisible.value = false
}

/**
 * 打开编辑生成配置弹窗
 *
 * @param row 行数据；顶部按钮调用时为空，此时取勾选行
 */
function openEditForm(row?: CodegenTable) {
  // 行按钮传行数据；顶部按钮取勾选的第一行
  const id = row ? row.id : table.value.ids[0]
  // 缺少 id 时直接返回，避免无效请求或误用勾选行
  if (id == null) return
  editRef.value?.open(id)
}

/**
 * 删除代码生成表（单条或批量），成功后刷新列表
 *
 * @param row 行数据；顶部按钮调用时为空，此时删除勾选行
 */
function removeCodegen(row?: CodegenTable) {
  // 行按钮只删当前行；顶部按钮删除勾选行
  const ids = row ? (row.id != null ? [row.id] : []) : table.value.ids
  // 无记录可删时直接返回，避免弹出空删除确认框
  if (ids.length === 0) return
  const confirmText = row
    ? t('tool.codegen.deleteTableConfirm', [row.tableName ?? String(row.id)])
    : t('tool.codegen.deleteTableConfirm', [ids.join(',')])
  modal
    .confirm(confirmText)
    .then(() => codegenApi.delete(ids))
    .then(() => {
      // 删除当前页最后一条时回退一页，避免停留在空页
      if (table.value.list.length === ids.length && queryParams.value.pageNum > 1) {
        queryParams.value.pageNum -= 1
      }
      getList()
      modal.msgSuccess(t('common.deleteSuccess'))
    })
    .catch(() => {})
}

// ---------------------- 页面初始化 ----------------------

// 页面激活时：路由携带新的时间戳则刷新列表，保持与编辑页返回后的状态同步
onActivated(() => {
  const time = Array.isArray(route.query.t) ? route.query.t[0] : route.query.t
  if (typeof time === 'string' && time !== uniqueId.value) {
    uniqueId.value = time
    queryParams.value.pageNum = Number(route.query.pageNum) || 1
    queryRef.value?.resetFields()
    getList()
  }
})

// 页面加载时查询列表
getList()
</script>
