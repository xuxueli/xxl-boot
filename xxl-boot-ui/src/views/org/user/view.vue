<!--
  UserView（用户详情抽屉）
  展示用户基本信息、角色信息及账号相关数据
-->
<template>
  <el-drawer title="用户详情" v-model="visible" direction="rtl" size="680px" append-to-body :before-close="handleClose" class="detail-drawer">
    <div v-loading="loading" class="drawer-content">
      <!-- 基本信息 -->
      <h4 class="section-header">基本信息</h4>
      <el-row :gutter="20" class="mb8">
        <el-col :span="24">
          <div class="info-item">
            <label class="info-label">用户编号：</label>
            <span class="info-value plaintext">{{ info.id }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="24">
          <div class="info-item">
            <label class="info-label">账号：</label>
            <span class="info-value plaintext">{{ info.username }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="24">
          <div class="info-item">
            <label class="info-label">用户名称：</label>
            <span class="info-value plaintext">{{ info.realName }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="24">
          <div class="info-item">
            <label class="info-label">所属组织：</label>
            <span class="info-value plaintext">{{ info.orgName }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="24">
          <div class="info-item">
            <label class="info-label">手机号：</label>
            <span class="info-value plaintext">{{ info.phone }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="24">
          <div class="info-item">
            <label class="info-label">邮箱：</label>
            <span class="info-value plaintext">{{ info.email }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="24">
          <div class="info-item">
            <label class="info-label">用户状态：</label>
            <span class="info-value plaintext">
              <el-tag size="small" :type="info.status === 0 ? 'success' : 'danger'">{{ statusText(info.status) }}</el-tag>
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="24">
          <div class="info-item">
            <label class="info-label">角色：</label>
            <span class="info-value plaintext">{{ roleNames || '无角色' }}</span>
          </div>
        </el-col>
      </el-row>
      <!-- 其他信息 -->
      <h4 class="section-header">其他信息</h4>
      <el-row :gutter="20" class="mb8">
        <el-col :span="24">
          <div class="info-item">
            <label class="info-label">创建时间：</label>
            <span class="info-value plaintext">{{ parseTime(info.addTime) }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="24">
          <div class="info-item">
            <label class="info-label">更新时间：</label>
            <span class="info-value plaintext">{{ parseTime(info.updateTime) }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-drawer>
</template>

<script setup name="UserView">
import { listRole } from '@/api/org/role'
import { loadEnumItem } from '@/api/system/dict/data'
import { parseTime } from '@/utils/common'

const visible = ref(false)
const loading = ref(false)
const info = ref({})
const statusOptions = ref([])
const roleOptions = ref([])

const roleNames = computed(() => {
  if (!info.value.roleIds || !info.value.roleIds.length) return ''
  return roleOptions.value.filter(r => info.value.roleIds.includes(r.id)).map(r => r.name).join('、') || ''
})

/** 状态编码 → 文案 */
function statusText(status) {
  const item = statusOptions.value.find(i => i.code === status)
  return item ? item.title : status
}

/** 打开详情抽屉 */
function open(row) {
  visible.value = true
  loading.value = true
  info.value = { ...row }
  listRole({ offset: 0, pagesize: 999 }).then(response => {
    roleOptions.value = response.data.data
  })
  loadEnumItem('UserStatuEnum').then(res => {
    statusOptions.value = res.data
  }).finally(() => {
    loading.value = false
  })
}

/** 关闭详情抽屉 */
function handleClose() {
  visible.value = false
}

defineExpose({
  open
})
</script>
