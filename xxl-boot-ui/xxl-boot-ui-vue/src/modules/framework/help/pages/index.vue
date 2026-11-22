<!--
  Help（帮助中心）
  功能：展示平台简介、GitHub 地址、帮助文档与版本信息
  @author xuxueli 2026-11-22
-->
<template>
  <div class="app-container help">
    <el-card>
      <h2>{{ brandName }}｜{{ t('app.title') }}</h2>
      <p>
        {{ t('help.intro') }}
      </p>

      <p>
        <!-- 外部链接按钮 -->
        <el-button type="primary" icon="Cloudy" plain @click="goTarget('https://github.com/xuxueli/xxl-boot')">{{ t('help.github') }} </el-button>
        <el-button icon="HomeFilled" plain @click="goTarget('https://www.xuxueli.com/xxl-boot/')">{{ t('help.docs') }} </el-button>

        <!-- GitHub Star 数 -->
        &nbsp;&nbsp;｜&nbsp;&nbsp;
        <iframe
          src="https://ghbtns.com/github-btn.html?user=xuxueli&repo=xxl-boot&type=star&count=true"
          frameborder="0"
          scrolling="0"
          width="170px"
          height="20px"
          style="margin-bottom: -5px"
        ></iframe>
        <br /><br />
      </p>

      <el-divider class="divider" />
      <p>
        Powered by <b>{{ brandName }}</b> v{{ version }}

        <span style="float: right">
          {{ footerContent }}
          <a href="https://www.xuxueli.com/xxl-boot/" target="_blank" style="margin-left: 5px; text-decoration: underline">xuxueli</a>
          <a href="https://github.com/xuxueli/xxl-boot" target="_blank" style="margin-left: 5px; text-decoration: underline">github</a>
        </span>
      </p>
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Help' })
import defaultSettings from '@/default-settings'
import { t } from '@/i18n'

// ---------------------- 响应式数据 ----------------------

// 平台名称、版本与页脚文案，均来自全局默认配置
const brandName = defaultSettings.brandName
const version = defaultSettings.version
const footerContent = defaultSettings.footerContent

// 平台标题


// ---------------------- 页面交互 ----------------------

/**
 * 在新窗口打开外部链接
 *
 * @param url 目标地址
 */
function goTarget(url: string) {
  window.open(url, '_blank')
}
</script>

<style>
.help {
  h2 {
    margin-top: 10px;
    font-weight: 200;
  }

  p {
    margin-top: 10px;
    font-weight: normal;
    font-size: 13px;
    color: #676a6c;

    b {
      font-weight: 700;
    }
  }

  a {
    color: #00afff;
    text-decoration: auto;
  }
}

.divider {
  margin-top: 10px;
  margin-bottom: 15px;
}
</style>
