<!--
  页面：Help（帮助中心）
  功能：显示 GitHub 地址、Star 数、帮助文档链接
-->
<template>
  <div class="app-container help">

    <el-card>
      <h2>{{ title }}</h2>
      <p>
        XXL-BOOT 是一个快速开发平台，易学易用、简化开发、丰富扩展、开箱即用。整合前后端流行技术，致力为 中小企业、个人开发者 打造开箱即用的中后台解决方案。
      </p>
      <p>
        <b>当前版本:</b> <span>v{{ version }}</span>
      </p>
      <el-divider/>
      <p>
        <!-- GitHub -->
        <el-button
            type="primary"
            :icon="Cloudy"
            plain
            @click="goTarget('https://github.com/xuxueli/xxl-boot')"
        >访问GitHub
        </el-button>

        <!-- 帮助文档 -->
        <el-button
            :icon="HomeFilled"
            plain
            @click="goTarget('https://www.xuxueli.com/xxl-boot/')"
        >帮助文档
        </el-button>

        <!-- icon -->
        &nbsp;&nbsp;｜&nbsp;&nbsp;
        <iframe src="https://ghbtns.com/github-btn.html?user=xuxueli&repo=xxl-boot&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px" style="margin-bottom:-5px;"></iframe>
        <br><br>

      </p>
      <p></p>
    </el-card>
  </div>
</template>

<script setup>
// 引入
import defaultSettings from '@/settings'
import {Cloudy, HomeFilled} from "@element-plus/icons-vue";

const title = defaultSettings.title           // 系统标题
const version = defaultSettings.version       // 版本号

/** 跳转外部链接 */
function goTarget(url) {
  window.open(url, '__blank')
}
</script>

<style>
.help{

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;

}
</style>
