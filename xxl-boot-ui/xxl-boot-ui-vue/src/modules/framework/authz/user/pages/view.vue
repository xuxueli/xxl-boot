<!--
  UserView（用户详情抽屉）
  功能：展示用户基本信息、角色信息及账号相关数据
  @author xuxueli 2026-11-22
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
              <el-tag size="small" :type="info.status === 0 ? 'success' : 'danger'">{{ enumTitle(statusOptions, info.status) }}</el-tag>
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
            <span class="info-value plaintext">{{ parseTime(info.addTime ?? '') }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb8">
        <el-col :span="24">
          <div class="info-item">
            <label class="info-label">{{ t('common.updateTime') }}：</label>
            <span class="info-value plaintext">{{ parseTime(info.updateTime ?? '') }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
defineOptions({ name: 'UserView' })
import { computed, ref } from 'vue'
import { t } from '@/i18n'
import { enumTitle } from '@/composables/useEnumOption'
import { parseTime } from '@/utils/common'
import { roleApi } from '@/modules/framework/authz/role/api'
import { dictApi } from '@/modules/framework/system/dict/api'
import type { User } from '../types'
import type { Role } from '@/modules/framework/authz/role/types'
import type { EnumOption } from '@/types'

const visible = ref(false) /* 抽屉显隐 */
const loading = ref(false) /* 加载状态 */
const info = ref<User>({}) /* 用户详情 */
const statusOptions = ref<EnumOption[]>([]) /* 用户状态选项 */
const roleOptions = ref<Role[]>([]) /* 角色选项，用于将角色 ID 翻译为名称 */

// 角色名称：根据用户已分配角色 ID 匹配角色选项后拼接展示
const roleNames = computed(() => {
  const roleIds = info.value.roleIds
  if (!roleIds || !roleIds.length) return ''
  return (
    roleOptions.value
      .filter((role) => role.id != null && roleIds.includes(role.id))
      .map((role) => role.name)
      .join(t('authz.user.roleJoin')) || ''
  )
})

/**
 * 打开详情抽屉并加载角色、状态枚举
 *
 * @param row 用户行数据
 */
function open(row: User) {
  visible.value = true
  loading.value = true
  info.value = { ...row }
  roleApi
    .pageList({ offset: 0, pagesize: 999 })
    .then((response) => {
      roleOptions.value = response.data.data
    })
    .catch(() => {})
  dictApi
    .loadEnum('UserStatuEnum')
    .then((response) => {
      statusOptions.value = response.data
    })
    .catch(() => {})
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
