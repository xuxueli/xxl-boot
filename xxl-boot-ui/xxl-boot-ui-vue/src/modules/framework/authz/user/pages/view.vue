<!--
  UserView（用户详情抽屉）
  展示用户基本信息、角色信息及账号相关数据
-->
<template>
  <el-drawer
    :title="t('authz.user.detailTitle')"
    v-model="visible"
    direction="rtl"
    size="680px"
    append-to-body
    :before-close="handleClose"
    class="detail-drawer"
  >
    <div v-loading="loading" class="drawer-content">
      <!-- 基本信息 -->
      <h4 class="section-header">{{ t('authz.user.baseInfo') }}</h4>
      <el-row :gutter="20" class="mb8">
        <el-col :span="24">
          <div class="info-item">
            <label class="info-label">{{ t('authz.user.id') }}：</label>
            <span class="info-value plaintext">{{ info.id }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="24">
          <div class="info-item">
            <label class="info-label">{{ t('authz.user.username') }}：</label>
            <span class="info-value plaintext">{{ info.username }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="24">
          <div class="info-item">
            <label class="info-label">{{ t('common.realName') }}：</label>
            <span class="info-value plaintext">{{ info.realName }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="24">
          <div class="info-item">
            <label class="info-label">{{ t('authz.user.orgName') }}：</label>
            <span class="info-value plaintext">{{ info.orgName }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="24">
          <div class="info-item">
            <label class="info-label">{{ t('authz.user.phone') }}：</label>
            <span class="info-value plaintext">{{ info.phone }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="24">
          <div class="info-item">
            <label class="info-label">{{ t('authz.user.email') }}：</label>
            <span class="info-value plaintext">{{ info.email }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="24">
          <div class="info-item">
            <label class="info-label">{{ t('authz.user.statusLabel') }}：</label>
            <span class="info-value plaintext">
              <el-tag size="small" :type="info.status === 0 ? 'success' : 'danger'">{{ statusText(info.status) }}</el-tag>
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="24">
          <div class="info-item">
            <label class="info-label">{{ t('authz.user.role') }}：</label>
            <span class="info-value plaintext">{{ roleNames || t('authz.user.noRole') }}</span>
          </div>
        </el-col>
      </el-row>
      <!-- 其他信息 -->
      <h4 class="section-header">{{ t('authz.user.otherInfo') }}</h4>
      <el-row :gutter="20" class="mb8">
        <el-col :span="24">
          <div class="info-item">
            <label class="info-label">{{ t('common.createTime') }}：</label>
            <span class="info-value plaintext">{{ parseTime(info.addTime as string) }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="24">
          <div class="info-item">
            <label class="info-label">{{ t('common.updateTime') }}：</label>
            <span class="info-value plaintext">{{ parseTime(info.updateTime as string) }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
defineOptions({ name: 'UserView' })
import { t } from '@/i18n'
import { listRole } from '@/modules/framework/authz/role/api'
import { loadEnumItem } from '@/modules/framework/system/dict/api'
import { parseTime } from '@/utils/common'
import type { User } from '../types'
import type { Role } from '@/modules/framework/authz/role/types'
import type { EnumOption } from '@/types'
import { computed, ref } from 'vue'

const visible = ref(false)
const loading = ref(false)
const info = ref<User>({})
const statusOptions = ref<EnumOption[]>([])
const roleOptions = ref<Role[]>([])

const roleNames = computed(() => {
  const roleIds = info.value.roleIds as number[] | undefined
  if (!roleIds || !roleIds.length) return ''
  return (
    roleOptions.value
      .filter((r) => roleIds.includes(r.id as number))
      .map((r) => r.name)
      .join(t('authz.user.roleJoin')) || ''
  )
})

/** 状态编码 → 文案 */
function statusText(status?: number) {
  const item = statusOptions.value.find((i) => i.code === status)
  return item ? item.title : status
}

/** 打开详情抽屉 */
function open(row: User) {
  visible.value = true
  loading.value = true
  info.value = { ...row }
  listRole({ offset: 0, pagesize: 999 }).then((response) => {
    roleOptions.value = response.data.data
  })
  loadEnumItem('UserStatuEnum')
    .then((res) => {
      statusOptions.value = res.data
    })
    .finally(() => {
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
