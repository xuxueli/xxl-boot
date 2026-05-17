<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>Boot后台管理框架</h2>
        <p>
          一直想做一款后台管理系统，看了很多优秀的开源项目但是发现没有合适自己的。于是利用空闲休息时间开始自己写一套后台系统。如此有了Boot管理系统，她可以用于所有的Web应用程序，如网站管理后台，网站会员中心，CMS，CRM，OA等等，当然，您也可以对她进行深度定制，以做出更强系统。所有前端后台代码封装过后十分精简易上手，出错概率低。同时支持移动客户端访问。系统会陆续更新一些实用功能。
        </p>
        <p>
          <b>当前版本:</b> <span>v{{ version }}</span>
        </p>
        <p>
          <el-tag type="danger">&yen;免费开源</el-tag>
        </p>
        <p>
          <el-button
            type="primary"
            icon="Cloudy"
            plain
            @click="goTarget('https://gitee.com/boot/boot')"
            >访问码云</el-button
          >
          <el-button
            icon="HomeFilled"
            plain
            @click="goTarget('http://boot.vip')"
            >访问主页</el-button
          >
        </p>
      </el-col>

      <el-col :sm="24" :lg="12" style="padding-left: 50px">
        <el-row>
          <el-col :span="12">
            <h2>技术选型</h2>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <h4>后端技术</h4>
            <ul>
              <li>SpringBoot</li>
              <li>Spring Security</li>
              <li>JWT</li>
              <li>MyBatis</li>
              <li>Druid</li>
              <li>Fastjson</li>
              <li>...</li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>前端技术</h4>
            <ul>
              <li>Vue</li>
              <li>Vuex</li>
              <li>Element-ui</li>
              <li>Axios</li>
              <li>Sass</li>
              <li>Quill</li>
              <li>...</li>
            </ul>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>联系信息</span>
            </div>
          </template>
          <div class="body">
            <p>
              <i class="el-icon-s-promotion"></i> 官网：<el-link
                href="http://www.xxx.xxx"
                target="_blank"
                >http://www.boot.vip</el-link
              >
            </p>
            <p>
              <i class="el-icon-user-solid"></i> QQ群：<s> 满111111 </s> <s> 满111111111 </s>
              <s> 满111111111 </s> <s> 满111111111 </s> <s> 满111111111 </s> <s> 满111111111 </s>
              <s> 满111111111 </s> <s> 满111111111 </s> <s> 满111111111 </s> <s> 满111111111 </s>
              <s> 满111111111 </s> <s> 满111111111 </s> <s> 满111111111 </s> <s> 满111111111 </s>
            </p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>更新日志</span>
            </div>
          </template>
          <el-collapse accordion>
            <el-collapse-item title="v3.9.2 - 2026-03-26">
              <ol>
                <li>新增锁定屏幕功能</li>
                <li>首页新增通知公告消息提醒</li>
                <li>添加持久化标签页开关功能</li>
                <li>菜单搜索支持文本高亮&数量提示</li>
                <li>添加菜单路由地址和名称的校验规则</li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="v3.9.1 - 2025-12-18">
              <ol>
                <li>支持防盗链功能</li>
                <li>菜单导航设置支持纯顶部</li>
                <li>使用yauaa代替bitwalker</li>
                <li>用户头像更换后移除旧头像文件</li>
                <li>支持Excel导出对象的多个子列表</li>
                <li>其他细节优化</li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="v1.0.0 - 2019-10-08">
              <ol>
                <li>前后端分离系统正式发布</li>
              </ol>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>捐赠支持</span>
            </div>
          </template>
          <div class="body">
            <img src="base64:xx" alt="donate" style="width:100%"/>
            <span style="display: inline-block; height: 30px; line-height: 30px">你可以请作者喝杯咖啡表示鼓励</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Index">
const version = ref('3.9.2')

function goTarget(url) {
  window.open(url, '__blank')
}
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

