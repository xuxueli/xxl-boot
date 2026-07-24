<!--
  页面：Profile（个人中心）
  功能：展示个人信息与基本资料/修改密码 tab 切换
-->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <!-- 个人信息 -->
        <el-card class="box-card">
          <template v-slot:header>
            <div class="clearfix">
              <span>个人信息</span>
            </div>
          </template>
          <div>

            <!-- 头像展示 -->
            <div class="text-center">
              <userAvatar/>
            </div>

            <!-- 用户信息列表 -->
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <SvgIcon icon-class="user"/>
                用户名称
                <div class="pull-right">{{ state.user.userName }}</div>
              </li>
              <li class="list-group-item">
                <SvgIcon icon-class="phone"/>
                手机号码
                <div class="pull-right">{{ state.user.phonenumber }}</div>
              </li>
              <li class="list-group-item">
                <SvgIcon icon-class="email"/>
                用户邮箱
                <div class="pull-right">{{ state.user.email }}</div>
              </li>
              <li class="list-group-item">
                <SvgIcon icon-class="tree"/>
                所属部门
                <div class="pull-right" v-if="state.user.dept">{{ state.user.dept.deptName }} / {{
                    state.postGroup
                  }}
                </div>
              </li>
              <li class="list-group-item">
                <SvgIcon icon-class="peoples"/>
                所属角色
                <div class="pull-right">{{ state.roleGroup }}</div>
              </li>
              <li class="list-group-item">
                <SvgIcon icon-class="date"/>
                创建日期
                <div class="pull-right">{{ state.user.createTime }}</div>
              </li>
            </ul>

          </div>
        </el-card>
      </el-col>

      <!-- 基本资料 / 修改密码 -->
      <el-col :span="18" :xs="24">
        <el-card>
          <template v-slot:header>
            <div class="clearfix">
              <span>基本资料</span>
            </div>
          </template>
          <el-tabs v-model="selectedTab">

            <!-- 基本资料 -->
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="state.user"/>
            </el-tab-pane>

            <!-- 修改密码 -->
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd/>
            </el-tab-pane>

          </el-tabs>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script setup name="Profile">

// 引入
import userAvatar from "./userAvatar"
import userInfo from "./userInfo"
import resetPwd from "./resetPwd"
import {getUserProfile} from "@/api/org/user"

const route = useRoute()                // 路由
const selectedTab = ref("userinfo")     // 当前选中的 tab
const state = reactive({                // 用户信息、角色、岗位数据
  user: {},
  roleGroup: {},
  postGroup: {}
})

/** 获取当前登录用户个人信息 */
function getUser() {
  getUserProfile().then(response => {
    state.user = response.data
    state.roleGroup = response.roleGroup
    state.postGroup = response.postGroup
  })
}

// 初始化：根据路由参数激活 tab，并加载用户信息
onMounted(() => {
  const activeTab = route.params && route.params.activeTab
  if (activeTab) {
    selectedTab.value = activeTab
  }
  getUser()
})
</script>
