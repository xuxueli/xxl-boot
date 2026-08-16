<!--
  组件：Settings（布局设置抽屉）
  功能：菜单导航模式、主题风格、页签配置、固定 Header、Logo 显隐、动态标题、底部版权等布局偏好设置
-->
<template>
  <el-drawer v-model="showSettingsRef" :withHeader="false" :lock-scroll="false" direction="rtl" size="300px">
    <!-- 菜单导航设置 -->
    <div class="setting-drawer-title">
      <h3 class="drawer-title">菜单导航设置</h3>
    </div>
    <div class="nav-wrap">
      <el-tooltip content="左侧菜单" placement="bottom">
        <div class="item left" @click="handleNavType('side')" :class="{ activeItem: navType === 'side' }"><b></b><b></b></div>
      </el-tooltip>
      <el-tooltip content="顶部菜单" placement="bottom">
        <div class="item top" @click="handleNavType('top')" :class="{ activeItem: navType === 'top' }"><b></b><b></b></div>
      </el-tooltip>
      <el-tooltip content="混合菜单" placement="bottom">
        <div class="item mix" @click="handleNavType('mix')" :class="{ activeItem: navType === 'mix' }"><b></b><b></b></div>
      </el-tooltip>
    </div>

    <!-- 主题风格设置 -->
    <div class="setting-drawer-title">
      <h3 class="drawer-title">主题风格设置</h3>
    </div>
    <div class="setting-drawer-block-checbox">
      <div class="setting-drawer-block-checbox-item" @click="handleTheme('theme-dark')">
        <img src="@/assets/images/dark.svg" alt="dark" />
        <div v-if="sideTheme === 'theme-dark'" class="setting-drawer-block-checbox-selectIcon" style="display: block">
          <i aria-label="图标: check" class="anticon anticon-check">
            <svg
              viewBox="64 64 896 896"
              data-icon="check"
              width="1em"
              height="1em"
              :fill="theme"
              aria-hidden="true"
              focusable="false"
              class=""
            >
              <path
                d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"
              />
            </svg>
          </i>
        </div>
      </div>
      <div class="setting-drawer-block-checbox-item" @click="handleTheme('theme-light')">
        <img src="@/assets/images/light.svg" alt="light" />
        <div v-if="sideTheme === 'theme-light'" class="setting-drawer-block-checbox-selectIcon" style="display: block">
          <i aria-label="图标: check" class="anticon anticon-check">
            <svg
              viewBox="64 64 896 896"
              data-icon="check"
              width="1em"
              height="1em"
              :fill="theme"
              aria-hidden="true"
              focusable="false"
              class=""
            >
              <path
                d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"
              />
            </svg>
          </i>
        </div>
      </div>
    </div>
    <div class="drawer-item">
      <span>主题颜色</span>
      <span class="comp-style">
        <el-color-picker v-model="theme" :predefine="predefineColors" />
      </span>
    </div>
    <el-divider />

    <!-- 系统布局配置 -->
    <h3 class="drawer-title">系统布局配置</h3>

    <div class="drawer-item">
      <span>开启页签</span>
      <span class="comp-style">
        <el-switch v-model="settingsStore.tagsView" class="drawer-switch" />
      </span>
    </div>

    <div class="drawer-item">
      <span>持久化标签页</span>
      <span class="comp-style">
        <el-switch v-model="tagsViewPersist" :disabled="!settingsStore.tagsView" class="drawer-switch" />
      </span>
    </div>

    <div class="drawer-item">
      <span>显示页签图标</span>
      <span class="comp-style">
        <el-switch v-model="settingsStore.tagsIcon" :disabled="!settingsStore.tagsView" class="drawer-switch" />
      </span>
    </div>

    <div class="drawer-item">
      <span>标签页样式</span>
      <span class="comp-style">
        <el-radio-group v-model="settingsStore.tagsViewStyle" :disabled="!settingsStore.tagsView" size="small">
          <el-radio-button label="card">卡片</el-radio-button>
          <el-radio-button label="chrome">谷歌</el-radio-button>
        </el-radio-group>
      </span>
    </div>

    <div class="drawer-item">
      <span>固定 Header</span>
      <span class="comp-style">
        <el-switch v-model="settingsStore.fixedHeader" class="drawer-switch" />
      </span>
    </div>

    <div class="drawer-item">
      <span>显示 Logo</span>
      <span class="comp-style">
        <el-switch v-model="settingsStore.sidebarLogo" class="drawer-switch" />
      </span>
    </div>

    <div class="drawer-item">
      <span>动态标题</span>
      <span class="comp-style">
        <el-switch v-model="dynamicTitle" class="drawer-switch" />
      </span>
    </div>

    <div class="drawer-item">
      <span>底部版权</span>
      <span class="comp-style">
        <el-switch v-model="settingsStore.footerVisible" class="drawer-switch" />
      </span>
    </div>

    <el-divider />

    <el-button type="primary" plain icon="DocumentAdd" @click="saveSetting">保存配置</el-button>
    <el-button plain icon="Refresh" @click="resetSetting">重置配置</el-button>
  </el-drawer>
</template>

<script setup lang="ts">
import { useAppStore, useRoutesStore, useSettingsStore, useTagsViewStore } from '@/store'
import modal from '@/utils/modal'

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const tagsViewStore = useTagsViewStore()
const routesStore = useRoutesStore()

const showSettingsRef = ref(false)

/*
 * 导航模式：side=左侧，mix=混合，top=顶部
 */
const navType = computed({
  get: () => settingsStore.navType,
  set: (v) => settingsStore.setNavType(v)
})

/*
 * 主题色
 */
const theme = computed({
  get: () => settingsStore.theme,
  set: (v) => settingsStore.setTheme(v)
})
// 主题色：预设颜色（参考 Ant Design 主色板 + Tailwind 500 级调校色值；默认色置顶，其余按色相环冷→暖→冷完整一圈）
const predefineColors = ref([
  '#409EFF' /* 蓝 */,
  '#3c8dbc' /* 深蓝 */,
  '#8B5CF6' /* 紫 */,
  '#00838F' /* 深青 */,
  '#14B8A6' /* 青 */,
  '#22C55E' /* 绿 */,
  '#F59E0B' /* 金 */,
  '#F97316' /* 橙 */,
  '#EF4444' /* 红 */,
  '#EC4899' /* 玫红 */
])

/*
 * 侧边栏主题：theme-dark / theme-light
 */
const sideTheme = computed({
  get: () => settingsStore.sideTheme,
  set: (v) => settingsStore.setSideTheme(v)
})

/*
 * 标签页持久化：关闭时清除已保存标签
 */
const tagsViewPersist = computed({
  get: () => settingsStore.tagsViewPersist,
  set: function (val) {
    settingsStore.setTagsViewPersist(val)

    // 联动变更：若不保存标签页，主动清除 - 标签页缓存
    if (!val) {
      tagsViewStore.clearVisitedViews()
    }
  }
})

/*
 * 动态标题
 */
const dynamicTitle = computed({
  get: () => settingsStore.dynamicTitle,
  set: (v) => settingsStore.setDynamicTitle(v) // 联动更新：动态标题刷新
})

/**
 * 侧边主题样式-切换监听：刷新
 */
function handleTheme(val: string) {
  settingsStore.setSideTheme(val)
}

/**
 * 菜单导航-切换监听：刷新
 */
function handleNavType(type: string) {
  settingsStore.setNavType(type)

  // 菜单导航-级联变更：type = 左侧/混合
  if (type === 'side' || type === 'mix') {
    // 侧边/混合：取消隐藏并展开侧边栏
    appStore.hideSideBar(false)
    appStore.openSideBar({ withoutAnimation: true })
  } else if (type === 'top') {
    // 顶部：隐藏侧边栏（仅顶部菜单）
    appStore.hideSideBar(true)
  }

  // 只有左侧/顶部需要设置侧边栏路由
  if (type === 'side' || type === 'top') {
    routesStore.setScope('')
  }
}

/*
 * 页面初始化：顶部导航时，隐藏侧边栏（若其它模块直接修改 settingsStore.navType，建议改为 watch）
 * */
onMounted(() => {
  if (settingsStore.navType === 'top') {
    appStore.hideSideBar(true)
  }
})

/*
 * 保存设置到 localStorage
 */
function saveSetting() {
  modal.loading('正在保存到本地，请稍候...')

  // 若不保存标签页，主动清除 - 标签页缓存
  if (!tagsViewPersist.value) {
    tagsViewStore.clearVisitedViews()
  }

  // Setting设置：持久化
  settingsStore.saveSetting()

  // 弹框提示： Close
  setTimeout(function () {
    modal.closeLoading()
    closeSetting()
  }, 500)
}

/*
 * 重置设置：清除缓存并刷新页面
 */
function resetSetting() {
  // 主动清除 - 标签页缓存
  tagsViewStore.clearVisitedViews()

  // 弹框提示：Open
  modal.loading('正在清除设置缓存并刷新，请稍候...')

  // Setting设置：持久化
  settingsStore.resetSetting()

  // 弹框提示： Close
  setTimeout(() => window.location.reload(), 500)
}

/**
 * 打开布局设置
 */
function openSetting() {
  showSettingsRef.value = true
}

/**
 * 关闭布局设置
 */
function closeSetting() {
  showSettingsRef.value = false
}

/**
 * 暴露方法
 */
defineExpose({
  openSetting
})
</script>

<style lang="scss" scoped>
.setting-drawer-title {
  margin-bottom: 12px;
  color: var(--el-text-color-primary, rgba(0, 0, 0, 0.85));
  line-height: 22px;
  font-weight: bold;

  .drawer-title {
    font-size: 14px;
  }
}

.setting-drawer-block-checbox {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 20px;

  .setting-drawer-block-checbox-item {
    position: relative;
    margin-right: 16px;
    border-radius: 2px;
    cursor: pointer;

    img {
      width: 48px;
      height: 48px;
    }

    .setting-drawer-block-checbox-selectIcon {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      padding-top: 15px;
      padding-left: 24px;
      color: #1890ff;
      font-weight: 700;
      font-size: 14px;
    }
  }
}

.drawer-item {
  color: var(--el-text-color-regular, rgba(0, 0, 0, 0.65));
  padding: 12px 0;
  font-size: 14px;

  .comp-style {
    float: right;
    margin: -3px 8px 0px 0px;
  }
}

// 导航模式
.nav-wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 20px;

  .activeItem {
    border: 2px solid var(--el-color-primary) !important;
  }

  .item {
    position: relative;
    margin-right: 16px;
    cursor: pointer;
    width: 56px;
    height: 48px;
    border-radius: 4px;
    background: #f0f2f5;
    border: 2px solid transparent;
  }

  .left {
    b:first-child {
      display: block;
      height: 30%;
      background: #fff;
    }

    b:last-child {
      width: 30%;
      background: #1b2a47;
      position: absolute;
      height: 100%;
      top: 0;
      border-radius: 4px 0 0 4px;
    }
  }

  .mix {
    b:first-child {
      border-radius: 4px 4px 0 0;
      display: block;
      height: 30%;
      background: #1b2a47;
    }

    b:last-child {
      width: 30%;
      background: #1b2a47;
      position: absolute;
      height: 70%;
      border-radius: 0 0 0 4px;
    }
  }

  .top {
    b:first-child {
      display: block;
      height: 30%;
      background: #1b2a47;
      border-radius: 4px 4px 0 0;
    }
  }
}
</style>
