<!--
  页面：Help（帮助中心）
  功能：显示 GitHub 地址、Star 数、帮助文档链接
-->
<template>
  <div class="app-container help">
    <el-card>
      <h2>{{ brandName }}｜{{ title }}</h2>
      <p>
        {{ t('help.intro') }}
      </p>

      <p>
        <!-- GitHub -->
        <el-button type="primary" icon="Cloudy" plain @click="goTarget('https://github.com/xuxueli/xxl-boot')">{{ t('help.github') }} </el-button>

        <!-- 帮助文档 -->
        <el-button icon="HomeFilled" plain @click="goTarget('https://www.xuxueli.com/xxl-boot/')">{{ t('help.docs') }} </el-button>

        <!-- icon -->
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
// 引入
import defaultSettings from '@/default-settings'
import { t } from '@/i18n'

const title = t('app.title')
const brandName = defaultSettings.brandName
const version = defaultSettings.version
const footerContent = defaultSettings.footerContent

/** 跳转外部链接 */
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
