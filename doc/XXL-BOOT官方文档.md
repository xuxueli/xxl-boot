## 《快速开发平台 XXL-BOOT》

[![Actions Status](https://github.com/xuxueli/xxl-boot/workflows/Java%20CI/badge.svg)](https://github.com/xuxueli/xxl-boot/actions)
[![GitHub release](https://img.shields.io/github/release/xuxueli/xxl-boot.svg)](https://github.com/xuxueli/xxl-boot/releases)
[![GitHub stars](https://img.shields.io/github/stars/xuxueli/xxl-boot)](https://github.com/xuxueli/xxl-boot/)
[![License](https://img.shields.io/badge/license-GPLv3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0.html)
[![donate](https://img.shields.io/badge/%24-donate-ff69b4.svg?style=flat-square)](https://www.xuxueli.com/page/donate.html)

[TOCM]

[TOC]

## 一、简介

### 1.1 概述

XXL-BOOT 是一个快速开发平台，易学易用、AI驱动、开箱即用，内置安全登录、RBAC 权限管控、端到端代码生成、AI+SKILL加速开发、响应式 UI 等能力，重点包括三类能力：

- **一套仓库，三种模式**：采用 Monorepo 统一托管三种工程形态 —— 单体（xxl-boot-admin）、前后端分离 Vue（xxl-boot-api + xxl-boot-ui-vue）、前后端分离 React（xxl-boot-api + xxl-boot-ui-react）。按业务诉求三选一，统一版本管理、一键构建、按需部署，切换成本极低。
- **一行 SQL，全栈生成**：内置端到端代码生成器，只需提供建表 SQL，即可自动生成 后端 "controller/service/mapper/xml/entity" 与 前端 "types/api/view" 全套代码，并附带 菜单 + 按钮 + 授权 初始化 SQL，从数据库到可运行页面一键打通。
- **AI + SKILL，开发再提速**：仓库内置 `xxl-boot-monolith / xxl-boot-vue / xxl-boot-react` 三大开发 SKILL，AI 编程助手（如 opencode）可自动识别并加载，按平台既定规范直生等价代码、自动落位并附校验清单，进一步拉高业务落地效率。

整合前后端流行技术，致力为 中小企业、个人开发者 打造开箱即用的中后台解决方案。

### 1.2 特性

按“快速开发、账号与安全、系统管理、研发与架构”四个维度组织：

- **快速开发（重点）**

- 1、Monorepo + 三种模式：Monorepo 一套仓库统一托管 单体模式、前后端分离 Vue 模式、前后端分离 React 模式，支持按业务需要自由选型、一键构建、按需部署；
- 2、AI + SKILL 驱动：内置 单体 / Vue / React 三大开发 SKILL，AI 编程助手一键加载，按平台规范直生业务代码并落位，显著加速业务开发；
- 3、代码生成：内置代码生成器，提供建表 SQL 即可自动生成前后端全流程代码，覆盖 "controller/service/mapper&xml/entity/types/api/view…"，并自动生成菜单权限 SQL，加速研发效率；
- 4、表单生成：内置表单/页面生成器，支持组件拖拽方式生成表单/页面，支持多种组件、布局和样式，支持响应式布局，保障用户体验及交互；

- **账号与安全**

- 5、账号安全：基于 token 设计账号登录生命周期能力，支持集群部署及 SSO 集成，保障账号体系安全性与扩展性；
- 6、权限管控：基于 RBAC 设计的用户角色权限管控能力，支持动态菜单 & 按钮级资源定义、灵活用户角色权限管控，管控防护系统资源；
- 7、审计日志：记录系统操作及活动的日志，用于系统的监控、审计和安全分析，可快速了解系统运行情况、发现异常行为、追溯问题源头，以及评估系统的安全性；
- 8、异常防护：严谨设计全局异常处理机制、ErrorPage 异常处理机制，保障系统底限安全体验；

- **系统管理**

- 9、用户管理：针对系统用户进行管理，进行用户新增、管理、角色授权等操作；
- 10、角色管理：针对系统权限角色进行动态管理，进行角色新增、管理、菜单分配等操作；
- 11、资源管理：针对系统资源进行细粒度管理，支持目录、菜单、按钮等多类型资源管理，进行新增、管理等操作；
- 12、组织管理：针对部门组织架构进行管理，进行多层级组织架构的新增、管理、排序等操作；
- 13、字典管理：针对系统字典进行线上化管理，包括字典定义、字典数据等，动态定义及扩展；
- 14、配置中心：针对常用业务数据进行动态配置，包括配置定义、配置值管理等，在线管理并实时生效；
- 15、站内消息：针对系统用户推送站内消息，包括站内消息发布及维护管理、触达及已读查阅分析等；
- 16、在线用户：实时查看分析当前在线用户，支持一键踢出异常用户登录态；
- 17、系统监控：针对服务器硬件资源监控，如 CPU 使用率、JVM 状态、磁盘利用率……等；支持一键 GC 等系统主动优化能力；

- **研发与架构**

- 18、响应式 UI：集成流行、可复用前端组件，支持丰富的 UI 组件、布局和样式，支持响应式布局，保障用户体验及交互；
- 19、国际化：支持国际化设置，提供中文、英文两种可选语言，可结合实际诉求定制扩展，默认为中文；
- 20、研发规范：基于标准分层架构设计，统一数据响应结构体，规范化项目目录结构；
- 21、分布式扩展：系统设计预留丰富扩展能力，可低成本扩展接入 SSO、KV、RPC、MQ、JOB、CONF…等分布式能力。

### 1.3 下载

#### 文档地址

- [中文文档](https://www.xuxueli.com/xxl-boot/)

#### 源码仓库

| 源码仓库地址                                                                     | Release Download                                            |
|----------------------------------------------------------------------------------|-------------------------------------------------------------|
| [https://github.com/xuxueli/xxl-boot](https://github.com/xuxueli/xxl-boot)       | [Download](https://github.com/xuxueli/xxl-boot/releases)    |
| [https://gitee.com/xuxueli0323/xxl-boot](https://gitee.com/xuxueli0323/xxl-boot) | [Download](https://gitee.com/xuxueli0323/xxl-boot/releases) |

#### 技术交流
- [社区交流](https://www.xuxueli.com/page/community.html)

### 1.4 环境
- Maven：3+
- Jdk：17+
- Mysql：8.0+
- NodeJs：18+（可选：前后端分离项目需要）
- Redis：7.0+（可选：前后端分离项目需要）

### 1.5 发展历程

于2015年中，发布 xxl-permission 项目，定位基于RBAC实现的后台管理系统，支持动态菜单资源定义、用户角色权限管控，前后端端到端有效封装，开箱即用。

于2018年5月，发布 xxl-code-generator 项目，定位覆盖 "controller/service/mapper/entity/……"的多层代码生成系统。只需要提供SQL，将会自动生成全部代码。

于2024年11月，xxl-code-generator 项目更名 XXL-BOOT，整合xxl-permission、xxl-code-generator多个历史项目，并吸收 XXL-JOB、XXL-CONF 等系列开源软件所沉淀的中后台能力。
XXL-BOOT 定位为 快速开发平台，整合流行前后端技术能力，致力为中小企业与个人开发者打造开箱即用的快速开发解决方案。

于2026年7月，XXL-BOOT 整合主流技术栈，推出前后端分离版本。业务方可以根据实际业务诉求，自行选择 单体版本、前后端分离版本。

于2026年9月，发布 v2.1.0，前端模块全面升级 TypeScript（Vue3 + React），代码生成器兼容 TypeScript 并支持前端模板，同时内置 单体 / Vue / React 三大开发 SKILL，支持 AI 编程助手一键加载、按平台规范直生业务代码，业务开发进入 AI 辅助时代。

## 二、快速入门

XXL-BOOT 提供三种运行模式，请先明确业务选型，再按对应方式部署：

| 运行模式 | 组成模块 | 端口 | 适用场景 |
|---|---|---|---|
| 单体模式 | xxl-boot-admin | 8080 | 中小后台、内网系统、快速交付，服务端渲染开箱即用 |
| 前后端分离 Vue 模式 | xxl-boot-api + xxl-boot-ui-vue | 8090 + 3000 | 前端使用 Vue3 + Element Plus，团队分工协作 |
| 前后端分离 React 模式 | xxl-boot-api + xxl-boot-ui-react | 8090 + 4000 | 前端使用 React + Ant Design，团队分工协作 |

### 2.1 环境准备

- JDK 17+、Maven 3+、MySQL 8.0+；
- 前后端分离模式额外需要：Redis 7.0+、Node.js 18+；

### 2.2 初始化数据库

下载项目源码并解压，获取 "数据库初始化SQL脚本" 并执行即可。数据库初始化SQL脚本 位置为:

```
/xxl-boot/doc/db/
    - tables_xxl_boot.sql                   ：公共初始化SQL脚本【必须】
    - tables_xxl_boot_monolith.sql          ：单体模式初始化SQL脚本【可选】
    - tables_xxl_boot_modular_vue.sql       ：前后端分离（Vue）模式初始化SQL脚本【可选】
    - tables_xxl_boot_modular_react.sql     ：前后端分离（React）模式初始化SQL脚本【可选】
```

补充说明：
- 首先初始化 “公共初始化SQL脚本”（`tables_xxl_boot.sql`）；
- 然后根据所选运行模式，再执行对应的模式初始化SQL脚本（三选一）即可。

### 2.3 源码编译

项目为 Monorepo 仓库，单体项目 与 前后端分离项目 维护在同一个代码仓库中，通过不同目录模块隔离维护。解压源码，按 Maven 格式将源码导入 IDE，使用 Maven 编译即可，源码结构如下：

```
- xxl-boot/
    - xxl-boot-admin              ：【单体模式】单体服务
    - xxl-boot-api                ：【前后端分离】后端API服务
    - xxl-boot-ui/
        - xxl-boot-ui-vue         ：【前后端分离】前端UI服务（Vue3 版本）
        - xxl-boot-ui-react       ：【前后端分离】前端UI服务（React 版本）
```

编译方式：
- 后端模块：仓库根目录执行 `mvn clean package -Dmaven.test.skip=true`，一键编译全部 Maven 模块；
- 前端模块：进入 `xxl-boot-ui-vue` 或 `xxl-boot-ui-react` 目录执行 `npm install` 安装依赖。

### 2.4 方式一：单体模式

- 部署项目：xxl-boot-admin
- 项目说明：单体模式 中后台系统，前后端分别选型典型的 “SpringBoot/Mybatis/XXL-SSO/FreeMarker” 与 “AdminLTE/Bootstrap”；内置 “组织权限、系统工具、前后端代码生成、AI” 等能力。

#### 步骤一：配置文件

配置文件地址：

```
/xxl-boot/xxl-boot-admin/src/main/resources/application.properties
```

配置内容说明：

```
### xxl-boot, datasource。 数据库配置，与 ”2.2 初始化数据库“ 章节初始化的数据库保持一致。
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/xxl_boot?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=root_pwd
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

#### 步骤二：部署项目

开发模式，进入 `xxl-boot-admin` 目录启动即可：

```
cd /xxl-boot/xxl-boot-admin
mvn spring-boot:run
```

项目打包部署后，可通过如下地址及账号进行登录。
- 访问地址：http://localhost:8080
- 默认登录账号："admin/123456"

#### 步骤三：Docker Compose 部署（可选）

单体模式支持 Docker Compose 一键部署：

```
// 第一步：前往仓库目录，并构建项目
cd ./xxl-boot
mvn clean package -Dmaven.test.skip=true

// 第二步：进入 docker/monolith 目录，自定义 .env 配置（如修改 MYSQL_PATH 配置设置 Mysql 数据持久化目录）
cd ./docker/monolith/
cat .env

// 第三步：启动/停止项目
docker compose up -d
docker compose down
```

### 2.5 方式二：前后端分离 Vue 模式

- 部署项目：xxl-boot-api + xxl-boot-ui-vue
- 项目说明：前后端分离模式，后端 API 与前端 UI 独立部署、独立运行。后端选型 "SpringBoot/Mybatis/XXL-SSO"，前端选型 "Vue3/Vite/ElementPlus/TypeScript"。

#### 步骤一：启动后端服务

后端配置文件地址：

```
/xxl-boot/xxl-boot-api/src/main/resources/application.properties
```

配置内容说明（数据库配置，与 ”2.2 初始化数据库“ 章节初始化的数据库保持一致；具体是执行 `tables_xxl_boot_modular_vue.sql`）：

```
### xxl-boot, datasource。 数据库配置
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/xxl_boot?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=root_pwd
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

### xxl-boot, redis。 缓存配置（前后端分离项目依赖，用于登录态存储等）
spring.data.redis.host=localhost
spring.data.redis.port=6379
spring.data.redis.database=0
spring.data.redis.password=
```

补充说明：
- 后端服务默认端口为 `8090`，可通过 `server.port` 调整；
- 前后端分离项目依赖 Redis，部署前需确保 Redis 服务可用。

后端启动方式：

```
cd /xxl-boot/xxl-boot-api
mvn spring-boot:run     # 启动后服务监听 http://localhost:8090
```

#### 步骤二：前端环境配置

配置文件地址（按环境区分，位于前端工程根目录）：

```
/xxl-boot/xxl-boot-ui/xxl-boot-ui-vue/.env.development   # 开发环境
/xxl-boot/xxl-boot-ui/xxl-boot-ui-vue/.env.staging       # 预发布环境
/xxl-boot/xxl-boot-ui/xxl-boot-ui-vue/.env.production    # 生产环境
```

配置内容说明：

```
# 前端端口号
VITE_APP_PORT=3000

# 后端API地址
VITE_API_URL=http://localhost:8090
# 后端路由前缀
VITE_APP_BASE_API='/api'
```

补充说明：
- `VITE_API_URL`：后端 API 服务地址，开发模式下由 Vite 代理转发，生产模式下由前端 Web 服务器（如 Nginx）反向代理；
- `VITE_APP_BASE_API`：后端路由前缀，默认 `/api`，前端请求会统一添加此前缀，代理或反向代理时需将其移除并转发至后端服务。

#### 步骤三：部署前端项目（本地开发）

开发模式下，进入前端目录，安装依赖并启动即可：

```
cd /xxl-boot/xxl-boot-ui/xxl-boot-ui-vue
npm install
npm run dev
```

启动后访问 `http://localhost:3000`，开发服务器会将 `/api` 前缀的请求自动代理至 `VITE_API_URL` 指定的后端服务。

#### 步骤四：部署前端项目（生产）

生产模式下，构建产物后部署至 Web 服务器（如 Nginx），并配置反向代理转发 API 请求：

```
npm run build             # 构建产物输出至 dist 目录
```

Nginx 反向代理配置示例：

```
server {
    listen       3000;
    server_name  localhost;

    # 前端静态资源
    root  /usr/share/nginx/html;
    index index.html;

    # 单页应用路由支持（前端 History 模式）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 后端API反向代理
    location /api/ {
        proxy_pass   http://127.0.0.1:8090/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

项目部署完成后，可通过如下地址及账号进行登录。
- 访问地址：http://localhost:3000 （按实际部署配置调整）
- 默认登录账号："admin/123456"

#### 步骤五：Docker Compose 部署（可选）

前后端分离 Vue 模式支持 Docker Compose 一键部署：

```
// 第一步：前往仓库目录，并构建项目
cd ./xxl-boot
mvn clean package -Dmaven.test.skip=true

// 第二步：进入 docker/modular-vue 目录，自定义 .env 配置（如修改 MYSQL_PATH 配置设置 Mysql 数据持久化目录）
cd ./docker/modular-vue/
cat .env

// 第三步：启动/停止项目
docker compose up -d
docker compose down
```

### 2.6 方式三：前后端分离 React 模式

- 部署项目：xxl-boot-api + xxl-boot-ui-react
- 项目说明：前后端分离模式，后端 API 与前端 UI 独立部署、独立运行。后端选型 "SpringBoot/Mybatis/XXL-SSO"，前端选型 "React/Vite/AntDesign/TypeScript"。

#### 步骤一：启动后端服务

后端配置文件地址与配置方式同 “2.5 方式二” 步骤一，端口默认 `8090`；数据库初始化执行 `tables_xxl_boot_modular_react.sql`。

```
cd /xxl-boot/xxl-boot-api
mvn spring-boot:run     # 启动后服务监听 http://localhost:8090
```

#### 步骤二：前端环境配置

配置文件地址（按环境区分，位于前端工程根目录）：

```
/xxl-boot/xxl-boot-ui/xxl-boot-ui-react/.env.development   # 开发环境
/xxl-boot/xxl-boot-ui/xxl-boot-ui-react/.env.staging       # 预发布环境
/xxl-boot/xxl-boot-ui/xxl-boot-ui-react/.env.production    # 生产环境
```

配置内容说明：

```
# 前端端口号
VITE_APP_PORT=4000

# 后端API地址
VITE_API_URL=http://localhost:8090
# 后端路由前缀
VITE_APP_BASE_API='/api'
```

#### 步骤三：部署前端项目（本地开发）

开发模式下，进入前端目录，安装依赖并启动即可：

```
cd /xxl-boot/xxl-boot-ui/xxl-boot-ui-react
npm install
npm run dev
```

启动后访问 `http://localhost:4000`，开发服务器会将 `/api` 前缀的请求自动代理至 `VITE_API_URL` 指定的后端服务。

#### 步骤四：部署前端项目（生产）

生产模式下，构建产物后部署至 Web 服务器（如 Nginx），并配置反向代理转发 API 请求：

```
npm run build             # 构建产物输出至 dist 目录
```

Nginx 反向代理配置与 “2.5 方式二” 步骤四一致，`listen` 端口按前端实际端口（默认 4000）调整。

项目部署完成后，可通过如下地址及账号进行登录。
- 访问地址：http://localhost:4000 （按实际部署配置调整）
- 默认登录账号："admin/123456"

#### 步骤五：Docker Compose 部署（可选）

前后端分离 React 模式支持 Docker Compose 一键部署：

```
// 第一步：前往仓库目录，并构建项目
cd ./xxl-boot
mvn clean package -Dmaven.test.skip=true

// 第二步：进入 docker/modular-react 目录，自定义 .env 配置
cd ./docker/modular-react/
cat .env

// 第三步：启动/停止项目
docker compose up -d
docker compose down
```

## 三、操作指南

### 3.1 平台能力总览

XXL-BOOT 三种运行模式（单体、前后端分离 Vue、前后端分离 React）能力一致，仅前端技术栈与界面形态不同。平台后台按“组织权限、系统管理、系统工具、AI 能力”四个板块组织：

| 分类 | 能力 | 说明 |
|---|---|---|
| 组织权限 | 用户管理 | 用户新增、编辑、分配角色 |
| 组织权限 | 角色管理 | 角色新增、编辑、分配菜单资源 |
| 组织权限 | 资源管理 | 目录 / 菜单 / 按钮 多类型资源细粒度管理 |
| 组织权限 | 组织管理 | 多层级部门组织架构管理 |
| 系统管理 | 字典管理 | 字典定义与字典数据线上化管理 |
| 系统管理 | 配置中心 | 业务配置在线管理、实时生效 |
| 系统管理 | 站内消息 | 站内消息发布、触达与已读分析 |
| 系统管理 | 审计日志 | 系统操作日志，用于监控、审计与安全分析 |
| 系统管理 | 在线用户 | 在线用户实时查看，支持一键踢出 |
| 系统管理 | 系统监控 | 服务器硬件资源监控，支持一键 GC |
| 系统工具 | 代码生成 | 提供建表 SQL，自动生成前后端全栈代码与菜单 SQL |
| 系统工具 | 表单构建 | 拖拽方式生成表单 / 页面 |

> 配图说明：下文每项能力均提供 单体模式（xxl-boot-admin）、Vue 模式（xxl-boot-ui-vue）、React 模式（xxl-boot-ui-react）三种界面截图，可直观对比三种模式之下同一能力的操作界面；功能与操作逻辑三者完全一致。

### 3.2 登录与系统首页

三种运行模式均基于 XXL-SSO 提供安全登录，后端账户体系与权限体系完全一致，仅前端界面形态不同。登录页（从左至右依次为：单体模式、Vue 模式、React 模式）：

<p align="center"><b>单体模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/admin/img_bs_login.png" width="300"/>　<b>Vue 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/vue/img_vue_login.png" width="300"/>　<b>React 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/react/img_react_login.png" width="300"/></p>

系统首页：

<p align="center"><b>单体模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/admin/img_bs_index.png" width="300"/>　<b>Vue 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/vue/img_vue_index.png" width="300"/>　<b>React 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/react/img_react_index.png" width="300"/></p>

### 3.3 权限管控

权限管控基于 RBAC 模型，通过“用户 → 角色 → 资源”三级联动，实现动态菜单与按钮级权限管控。下面以 用户管理、角色管理、资源管理、组织管理 四个管理页面，演示三种模式下的操作界面。

#### 3.3.1 用户管理

支持针对系统用户进行管理，进行用户新增、管理、角色授权等操作。

<p align="center"><b>单体模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/admin/img_bs_user.png" width="300"/>　<b>Vue 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/vue/img_vue_user.png" width="300"/>　<b>React 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/react/img_react_user.png" width="300"/></p>

#### 3.3.2 角色管理

支持针对系统权限角色进行动态管理，进行角色新增、管理、菜单分配等操作。

<p align="center"><b>单体模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/admin/img_bs_role.png" width="300"/>　<b>Vue 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/vue/img_vue_role.png" width="300"/>　<b>React 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/react/img_react_role.png" width="300"/></p>

#### 3.3.3 资源管理

支持针对系统资源进行细粒度管理，支持目录（type=0）、菜单（type=1）、按钮（type=2）等多类型资源管理，进行新增、管理等操作。

<p align="center"><b>单体模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/admin/img_bs_resource.png" width="300"/>　<b>Vue 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/vue/img_vue_resource.png" width="300"/>　<b>React 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/react/img_react_resource.png" width="300"/></p>

#### 3.3.4 组织管理

支持针对部门组织架构进行管理，进行多层级组织架构的新增、管理、排序等操作。

<p align="center"><b>单体模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/admin/img_bs_org.png" width="300"/>　<b>Vue 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/vue/img_vue_org.png" width="300"/>　<b>React 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/react/img_react_org.png" width="300"/></p>

### 3.4 系统管理

#### 3.4.1 字典管理

针对系统字典进行线上化管理，包括字典定义、字典数据等，动态定义及扩展。

<p align="center"><b>单体模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/admin/img_bs_dict.png" width="300"/>　<b>Vue 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/vue/img_vue_dict.png" width="300"/>　<b>React 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/react/img_react_dict.png" width="300"/></p>

#### 3.4.2 配置中心

针对常用业务数据进行动态配置，包括配置定义、配置值管理等，在线管理并实时生效。

<p align="center"><b>单体模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/admin/img_bs_conf.png" width="300"/>　<b>Vue 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/vue/img_vue_conf.png" width="300"/>　<b>React 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/react/img_react_conf.png" width="300"/></p>

#### 3.4.3 站内消息

针对系统用户推送站内消息，覆盖消息发布及维护管理、触达及已读查阅分析等完整闭环。

<p align="center"><b>单体模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/admin/img_bs_msg.png" width="300"/>　<b>Vue 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/vue/img_vue_msg.png" width="300"/>　<b>React 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/react/img_react_msg.png" width="300"/></p>

#### 3.4.4 审计日志

记录系统操作及活动日志，用于系统的监控、审计和安全分析，可快速了解系统运行情况、发现异常行为、追溯问题源头。

<p align="center"><b>单体模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/admin/img_bs_log.png" width="300"/>　<b>Vue 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/vue/img_vue_log.png" width="300"/>　<b>React 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/react/img_react_log.png" width="300"/></p>

> 此外，「在线用户」支持实时查看在线状态并一键踢出异常用户；「系统监控」支持服务器硬件资源监控（CPU / JVM / 磁盘等）与一键 GC 等主动优化能力，三种模式下操作逻辑一致。

### 3.5 代码生成

内置端到端代码生成器，只需提供建表 SQL 即可自动生成全部代码，覆盖 "controller/service/mapper&xml/entity" 后端多层，以及 "types/api/view" 前端多层，并自动生成 菜单 + 按钮 + 授权 初始化 SQL。三种模式均内置同类生成器，操作路径为后台「工具-代码生成」。

#### 第一步：准备 SQL 并生成

进入「工具-代码生成」页面，录入建表 SQL（默认提供 Demo 表 SQL 体验；前后端分离模式还需选择前端模板类型：Vue3 传 `element-plus-typescript`、React 传 `antd-typescript`），提交后生成代码配置。三种模式操作入口如下：

<p align="center"><b>单体模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/admin/img_bs_codegen.png" width="300"/>　<b>Vue 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/vue/img_vue_codegen.png" width="300"/>　<b>React 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/react/img_react_codegen.png" width="300"/></p>

#### 第二步：编辑字段生成规则（前后端分离模式）

对自动解析出的字段进行配置，支持指定：
- 查询方式（queryType）：是否作为查询条件、采用何种查询元素；
- 表单控件类型（htmlType）：如 Input、Select、Radio、Textarea 等；
- 数据字典（dictType）：绑定数据字典或业务枚举；
- 可见性开关：isQuery / isList / isInsert / isEdit / isRequired；
- 生成作者、包名等元信息。

<p align="center"><b>Vue 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/vue/img_vue_codegen2.png" width="300"/>　<b>React 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/react/img_react_codegen2.png" width="300"/></p>

#### 第三步：预览与批量生成（前后端分离模式）

点击「预览」可在线逐文件查看全部生成代码；点击「批量生成」可下载 zip 产物（后端 6 件套 + 前端 vue3/react 三文件 + `-init.sql` 菜单权限 SQL）。

<p align="center"><b>Vue 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/vue/img_vue_codegen3.png" width="300"/>　<b>React 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/react/img_react_codegen3.png" width="300"/></p>

#### 第四步：落位与上线

按生成产物目录结构，将代码落位到对应工程（后端 `business/{module}`、前端 `views|api|types/{module}/{page}`），执行 `-init.sql` 完成菜单与权限注册，重启服务后即可在菜单中看到该业务模块。详细操作见 “四、新增业务模块”。

### 3.6 表单构建

内置表单/页面构建工具，支持通过组件拖拽方式生成表单与页面，提供丰富的表单组件（输入、选择、日期、上传等）、布局与样式，支持响应式布局。生成后的表单代码可下载并接入既有工程。

<p align="center"><b>单体模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/admin/img_bs_form.png" width="300"/>　<b>Vue 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/vue/img_vue_form.png" width="300"/>　<b>React 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/react/img_react_form.png" width="300"/></p>

### 3.7 主题与辅助功能

#### 3.7.1 主题切换

三种模式均支持主题皮肤切换与 UI 配置：

<p align="center"><b>单体模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/admin/img_bs_theme.png" width="300"/>　<b>Vue 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/vue/img_vue_theme.png" width="300"/>　<b>React 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/react/img_react_theme.png" width="300"/></p>

#### 3.7.2 个人中心

前后端分离模式提供个人中心页，支持个人信息维护、修改密码等操作：

<p align="center"><b>Vue 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/vue/img_vue_profile.png" width="300"/>　<b>React 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/react/img_react_profile.png" width="300"/></p>

#### 3.7.3 帮助

三种模式均内置帮助页面，展示平台能力与快捷键等使用说明：

<p align="center"><b>单体模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/admin/img_bs_help.png" width="300"/>　<b>Vue 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/vue/img_vue_help.png" width="300"/>　<b>React 模式</b> <img src="https://www.xuxueli.com/project/static/xxl-boot/images/react/img_react_help.png" width="300"/></p>


## 四、新增业务模块

新增一个带列表页、增删改查的业务模块，是 XXL-BOOT 上最典型的开发动作。平台提供三种方式，投入成本与产出形态各有侧重，可按团队情况选择：

| 方式 | 适用场景 | 优点 | 缺点 | 产出物 |
|---|---|---|---|---|
| 传统手工方式 | 偏好逐行掌控代码、模块字段特殊 | 可控性最强、理解最深入 | 代码量大、开发周期长 | 手工全套后端 + 前端代码 |
| 内置代码生成器方式 | 标准化 CRUD 模块、追求稳定出码 | 一键生成、规范统一、含菜单 SQL | 复杂页面仍需二次开发 | 后端 6 件套 + 前端 3 文件 + init SQL |
| AI + SKILL 方式 | 已接入 AI 编程助手、追求极致效率 | 全自动编排直生 + 自动落位 + 校验清单 | 依赖 AI 助手能力 | 与生成器等价的全套代码 + SQL |

> 三种方式共用同一套运行模式 Skill 规范（`xxl-boot-vue / xxl-boot-react / xxl-boot-monolith`），落位路径与代码规范完全一致，可自由切换混合使用。

### 4.1 方式一：传统手工开发

适合字段特殊、交互复杂、需要深度定制的模块。以下以 前后端分离（Vue）模式、业务 `Demo`（模块 `demo`）为例；单体模式与 React 模式落位路径大同小异，详见对应工程规范。

#### 第一步：建表

按 `xxl_boot_` 前缀规范创建业务表，公共字段 `id / add_time / update_time`，状态字段使用 `TINYINT`，字段一律 `COMMENT` 注释：

```sql
CREATE TABLE `Demo` (
    `id`          int(11) NOT NULL AUTO_INCREMENT COMMENT '序号',
    `name`        varchar(100) NOT NULL COMMENT '产品名称',
    `status`      tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态：0-正常/1-停用',
    `add_time`    datetime NOT NULL COMMENT '创建时间',
    `update_time` datetime NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Demo业务表';
```

#### 第二步：后端代码

在 `xxl-boot-api` 工程 `business` 扩展包中落位 6 件套：

```
src/main/java/com/xxl/boot/api/business/demo/
├── model/Demo.java                  # 实体，字段驼峰
├── mapper/DemoMapper.java           # insert/delete/update/load/pageList/pageListCount
├── service/DemoService.java         # 业务接口
├── service/impl/DemoServiceImpl.java# 业务实现（方法顺序 pageList/load/insert/delete/update）
└── controller/DemoController.java   # @RestController + @RequestMapping("/demo/demo") + @XxlSso

src/main/resources/mapper/demo/DemoMapper.xml   # resultMap 显式映射，add_time/update_time 用 NOW()
```

要点：
- Controller 全部接口加 `@XxlSso` 鉴权；分页入参统一 `offset`、`pagesize`；删除使用 `@RequestParam("ids[]") List<Integer>` 支持批量；
- 参数校验使用 `StringTool / RegexTool / CollectionTool`，失败返回 `Response.ofFail("提示")`；
- 统一返回 `Response{code,msg,data}`，分页返回 `Response<PageModel>`。

#### 第三步：前端代码

在 `xxl-boot-ui-vue` 工程落位 3 文件，并在 `src/types/api.ts` barrel 中补一行导出：

```
src/
├── types/demo/demo.ts               # Demo 实体 + DemoQuery + DemoListQuery
├── api/demo/demo.ts                 # listDemo/getDemo/addDemo/delDemo/updateDemo 接口封装
└── views/demo/demo/index.vue        # 三段式列表页（搜索区 + 表格区 + 表单弹窗）
```

要点：
- 列表页使用 `ref` 收敛数据（`queryParams / table / formState`），`getList()` 经 `usePageParams(queryParams)()` 转 `offset/pagesize`，从 `response.data.data / response.data.total` 取值；
- 操作列按钮使用 `v-hasPermi="['demo:demo:add|edit|remove']"` 控制按钮级权限；
- 页面导航完全由数据库资源菜单驱动，建好页面文件后无需改动任何路由代码。

#### 第四步：注册菜单与权限

执行菜单初始化 SQL，在资源表插入菜单（type=1）与按钮（type=2），并给管理员角色（role_id=1）授权：

```sql
INSERT INTO `xxl_boot_resource` (`parent_id`,`name`,`type`,`permission`,`url`,`icon`,`order`,`status`,`visible`,`add_time`,`update_time`)
VALUES (0, 'Demo管理', 1, 'demo:demo', '/demo/demo', '', 999, 0, 0, now(), now());
SELECT @parentId := LAST_INSERT_ID();

INSERT INTO `xxl_boot_resource` (`parent_id`,`name`,`type`,`permission`,`url`,`icon`,`order`,`status`,`visible`,`add_time`,`update_time`)
VALUES (@parentId, 'Demo新增', 2, 'demo:demo:add', '', '', 1, 0, 0, now(), now()),
       (@parentId, 'Demo修改', 2, 'demo:demo:edit', '', '', 2, 0, 0, now(), now()),
       (@parentId, 'Demo删除', 2, 'demo:demo:remove', '', '', 3, 0, 0, now(), now());

INSERT INTO `xxl_boot_role_res` (`role_id`,`res_id`,`add_time`,`update_time`)
VALUES (1, @parentId, now(), now()), (1, @parentId+1, now(), now()), (1, @parentId+2, now(), now()), (1, @parentId+3, now(), now());
```

#### 第五步：联调验证

启动 `xxl-boot-api` + `xxl-boot-ui-vue`（或选择其他运行模式），验证：菜单可见、列表 / 新增 / 修改 / 删除 / 搜索可用、按钮级权限生效（未授权用户对应按钮隐藏）、空参数后端友好提示。


### 4.2 方式二：内置代码生成器

适合标准化 CRUD 模块，只需准备建表 SQL，即可在后台一键生成前后端全栈代码与菜单权限 SQL。这是平台开箱即用的主力方式，同样适用于三种运行模式（单体模式在后台「工具-代码生成」内置同类生成器）。

#### 第一步：录入建表 SQL

- 进入「系统工具 - 代码生成」页面，点击新增，录入业务建表 SQL（遵循 `xxl_boot_` 前缀规范）；
- 选择前端模板：Vue3 传 `element-plus-typescript`，React 传 `antd-typescript`（二者等价，按运行模式选择）；
- 点击生成，平台自动解析表结构、字段与类型，生成代码配置并入库。

#### 第二步：编辑字段配置

对自动解析的字段逐一配置生成规则，可组合配置查询方式、表单控件类型、数据字典/业务枚举、以及 isQuery/isList/isInsert/isEdit/isRequired 等可见性开关，并指定生成作者、包名。

#### 第三步：预览与下载

- 点击「预览」在线逐文件查看生成代码（后端 6 件套 + 前端三文件 + 菜单 SQL）；
- 点击「批量生成」下载 zip 产物，包含：

```
{module}-{business}/
├── xxx.java / xxxMapper.java / xxxMapper.xml    # 后端：Controller/Service/ServiceImpl/Entity
├── types.ts / api.ts / index.vue                # 前端（Vue3 模式）
└── xxx-init.sql                                 # 菜单 + 按钮 + 授权 初始化 SQL
```

#### 第四步：落位与上线

1. 按产物目录结构将代码复制到对应工程（后端 `business/{module}`、资源文件 `resources/mapper/{module}/`；前端 `views|api|types/{module}/{page}`），并在 `src/types/api.ts` barrel 补一行导出；
2. 执行 `-init.sql` 完成菜单与权限注册；
3. 重启后端、刷新前端，菜单自动出现，模块即可联调使用。


### 4.3 方式三：AI + SKILL 驱动开发

适合已接入 AI 编程助手（如 opencode、Cursor 等）的开发团队。仓库内置三大开发 SKILL，AI 助手可自动识别运行模式并加载权威规范，按“建表 → 后端 → 前端 → 菜单权限 → 验证”标准流程自动完成代码编写与落位，开发效率进一步提升。

#### 工作原理

```
.agents/
└── skills/
    ├── xxl-boot-vue        # 前后端分离 Vue 模式标准作业 Skill
    ├── xxl-boot-react      # 前后端分离 React 模式标准作业 Skill
    └── xxl-boot-monolith   # 单体模式标准作业 Skill
```

每个 SKILL 内置：工程结构说明、后端/前端落位清单、代码骨架模板、菜单权限 SQL 模板、校验清单，以及参考样例文件，保证 AI 产物与平台规范严格一致。

#### 操作步骤

1. 打开 AI 编程助手，将 XXL-BOOT 仓库作为工作目录打开（确保助手具备仓库读写能力）；
2. 明确运行模式（单体 / Vue 分离 / React 分离）与业务诉求，向 AI 描述：模块名称、业务字段或建表 SQL；
3. AI 自动加载匹配的 SKILL（如 `xxl-boot-vue`），并按标准流程作业：
   - 生成建表 SQL（`xxl_boot_*` 规范），并直接落位到工程对应目录；
   - 按落位清单生成后端（`business/{module}` 6/7 件套）与前端（`views|api|types/{module}/{page}` 3 文件）全部代码；
   - 生成 菜单 + 按钮 + 授权 初始化 SQL；
   - 按 SKILL「校验清单」逐项自检并交付说明；
4. 人工执行建表 SQL 与菜单 SQL，启动服务，按 AI 交付说明做联调验收即可。

#### 与传统方式对比

- 相比「传统手工开发」：代码由 AI 一次性直生并自动落位，省去大量重复编码；
- 相比「内置代码生成器」：无需登录后台、无需下载复制产物，AI 直接写盘并附自检，且同样输出等价代码 + 菜单 SQL，可无缝与生成器方式切换使用。


## 五、总体设计

### 5.1、Monorepo 仓库

项目采用 Monorepo 仓库模式，将 单体项目 与 前后端分离项目 维护在同一个代码仓库中，通过不同目录模块隔离维护，统一版本管理与依赖管理，便于协同开发与一键构建。

- 后端统一通过 Maven 父工程管理，根目录 `pom.xml` 集中维护模块依赖版本（如 SpringBoot、Mybatis、MySQL、XXL-SSO 等），子模块 `xxl-boot-admin`、`xxl-boot-api` 继承使用；
- 前端模块 `xxl-boot-ui-vue`、`xxl-boot-ui-react` 独立通过 npm 管理依赖（Vue3/Vite/ElementPlus 或者 React/Vite/AntDesign），与后端 Maven 工程解耦；
- `doc/db` 集中管理数据库初始化脚本，按运行模式区分公共脚本与模式脚本；
- `.agents/skills` 集中管理 单体 / Vue / React 开发 SKILL，为 AI 辅助开发提供平台级规范。

仓库目录结构如下：

```
xxl-boot/
│
├── pom.xml                                    # 父工程Maven配置：统一管理模块及依赖版本
├── AGENTS.md                                  # 开发规范与 Skill 使用指南
├── .agents/skills/                            # 【AI 开发 SKILL 目录】
│   ├── xxl-boot-monolith/                     # 单体模式开发 Skill
│   ├── xxl-boot-vue/                          # 前后端分离（Vue）开发 Skill
│   └── xxl-boot-react/                        # 前后端分离（React）开发 Skill
│
├── doc/                                       # 文档目录
│   ├── db/                                    # 数据库初始化SQL脚本目录
│   │   ├── tables_xxl_boot.sql                # 公共初始化SQL脚本【必须】
│   │   ├── tables_xxl_boot_monolith.sql       # 单体模式初始化SQL脚本【可选】
│   │   ├── tables_xxl_boot_modular_vue.sql    # 前后端分离（Vue）初始化SQL脚本【可选】
│   │   ├── tables_xxl_boot_modular_react.sql  # 前后端分离（React）初始化SQL脚本【可选】
│   │   └── plugin/                            # 扩展插件 SQL 脚本
│   ├── images/                                # 文档图片目录
│   └── XXL-BOOT官方文档.md                    # 官方文档
│
├── docker/                                    # Docker Compose 编排目录
│   ├── monolith/                              # 单体模式编排配置
│   ├── modular-vue/                           # 前后端分离（Vue）编排配置
│   └── modular-react/                         # 前后端分离（React）编排配置
│
├── xxl-boot-admin/                            # 【单体模式】单体服务模块
│   ├── pom.xml                                # Maven配置（继承父工程）
│   └── src/main/
│       ├── java/com/xxl/boot/admin/
│       │   ├── XxlBootAdminApplication.java   # 启动类
│       │   ├── framework/                     # 核心包：项目配置、系统管理、工具组件等
│       │   └── business/                      # 【扩展点】业务扩展包（可插拔）
│       └── resources/
│           ├── application.properties         # 主配置文件
│           ├── mapper/
│           │   ├── framework/                 # 核心 MyBatis 映射文件
│           │   └── business/                  # 【扩展点】业务扩展 MyBatis 映射文件
│           ├── templates/
│           │   ├── framework/                 # 核心 模板文件（FreeMarker）
│           │   └── business/                  # 【扩展点】业务扩展 模板文件
│           └── static/                        # 前端静态资源（AdminLTE/Bootstrap）
│
├── xxl-boot-api/                              # 【前后端分离】后端API服务模块
│   ├── pom.xml                                # Maven配置（继承父工程）
│   └── src/main/
│       ├── java/com/xxl/boot/api/
│       │   ├── XxlBootApiApplication.java     # 启动类
│       │   ├── framework/                     # 核心包：项目配置、系统管理、工具组件等
│       │   └── business/                      # 【扩展点】业务扩展包（可插拔）
│       └── resources/
│           ├── application.properties         # 主配置文件
│           ├── mapper/
│           │   ├── framework/                 # 核心 MyBatis 映射文件
│           │   └── business/                  # 【扩展点】业务扩展 MyBatis 映射文件
│           ├── templates/
│           │   └── tool/codegen/              # 代码生成 模板文件（java / vue3 / react / sql）
│           └── i18n/                          # 国际化资源文件
│
└── xxl-boot-ui/                               # 【前后端分离】前端UI模块目录
    ├── xxl-boot-ui-vue/                       # 前端UI服务（Vue3 + Vite + ElementPlus + TS）
    │   ├── package.json                       # 前端依赖配置
    │   ├── vite.config.ts                     # Vite构建配置
    │   └── src/
    │       ├── main.ts                        # 入口文件
    │       ├── views/                         # 页面组件（DB 菜单 url 驱动，零路由改动）
    │       ├── api/                           # 接口封装
    │       ├── types/                         # 类型定义（barrel 集中导出）
    │       ├── composables/                   # 组合式函数（usePageParams/useEnumOption 等）
    │       ├── components/                    # 通用组件（RightToolbar/Pagination/Editor 等）
    │       ├── directive/                     # 自定义指令（v-hasPermi/v-hasRole）
    │       ├── layout/ · router/              # 布局与路由
    │       ├── store/                         # 状态管理
    │       ├── utils/                         # 工具类
    │       └── default-settings.ts            # 全局配置
    │
    └── xxl-boot-ui-react/                     # 前端UI服务（React + Vite + AntDesign + TS）
        ├── package.json                       # 前端依赖配置
        ├── vite.config.ts                     # Vite构建配置
        └── src/
            ├── main.tsx                       # 入口文件
            ├── pages/                         # 页面组件（DB 菜单 url 驱动，零路由改动）
            ├── services/                      # 接口封装
            ├── types/                         # 类型定义（declare namespace API）
            ├── hooks/                         # 自定义hooks（usePermission/useEnumOption）
            ├── components/                    # 通用组件
            ├── layouts/                       # 布局组件
            ├── stores/                        # 状态管理
            ├── router/                        # 路由配置
            └── utils/                         # 工具类
```

补充说明：
- 构建：后端模块在仓库根目录执行 `mvn clean package` 即可一键编译全部 Maven 模块；前端模块进入 `xxl-boot-ui-vue` 或 `xxl-boot-ui-react` 目录执行 `npm install`、`npm run build` 构建；
- 部署：单体模式部署 `xxl-boot-admin` 模块；前后端分离模式部署 `xxl-boot-api` + 前端Vue或React模块，参考 “2.4 / 2.5 / 2.6”；
- 扩展：新增业务模块时，可在各模块 `business` 扩展包中开发，并配套放置 Mapper 映射文件、模板文件及配置文件，参考 “四、新增业务模块”。

### 5.2、三种运行模式

XXL-BOOT 通过 Monorepo 一套仓库同时提供三种运行模式，统一后端核心能力（登录鉴权、RBAC 权限、系统管理、代码生成等），按技术选型与交付形态选择前端形态：

```
┌─────────────────────────────────────────────────────────────────────┐
│                              XXL-BOOT Monorepo                       │
├─────────────────┬──────────────────────────────┬─────────────────────┤
│    单体模式      │       前后端分离（Vue）        │    前后端分离（React）│
│  xxl-boot-admin │  xxl-boot-api + ui-vue       │ xxl-boot-api + ui-react
│                 │                              │                     │
│  SpringBoot     │  后端：SpringBoot + MyBatis   │  后端：同上           │
│  + FreeMarker   │        + XXL-SSO + Redis     │  前端：React + Vite  │
│  + AdminLTE     │  前端：Vue3 + ElementPlus     │        + AntDesign  │
│                 │        + Vite + TypeScript   │        + TypeScript  │
│  端口 8080       │  端口 8090 / 3000             │  端口 8090 / 4000    │
│  单机即可交付     │  Redis 依赖，前后端独立部署     │  Redis 依赖，前后端独立部署│
└─────────────────┴──────────────────────────────┴─────────────────────┘
```

- 单体模式：服务端渲染一体化交付，部署最简（仅一个服务 + 数据库），适合中小后台、内网系统与快速交付场景；
- 前后端分离（Vue）：前端 Vue3 + Element Plus + TypeScript，团队分工协作、解耦迭代，适合以 Vue 技术栈为主的中后台产品；
- 前后端分离（React）：前端 React + Ant Design + TypeScript，适合以 React 技术栈为主的团队，与 Vue 模式共享同一套后端 API。

三种模式共享：数据库表结构、RBAC 权限模型、登录鉴权（XXL-SSO）、系统管理能力、代码生成器（同一套后端生成，前端模板二选一）与开发 SKILL 规范，业务代码可低成本在模式间迁移。

### 5.3、RBAC权限体系

项目进行安全的用户权限体系设计，基于RBAC（Role-Based Access Control，基于角色的访问控制）这种广泛采用的权限管理模型，通过将权限授予角色，然后将角色分配给用户，从而实现对系统资源的访问控制。
RBAC 的设计目标是简化对系统资源的访问管理，提高系统的安全性和可维护性。以下是项目 RBAC 权限体系相关实体表：

```
xxl_boot_user           : 用户表
xxl_boot_role           : 角色表
xxl_boot_resource       : 资源表，菜单Page、功能Btn等
xxl_boot_user_role      : 用户-角色关系表
xxl_boot_role_res       : 角色-资源关系表
```

资源定义与授权链路：
- 资源分三级：目录（type=0）、菜单（type=1）、按钮（type=2）；菜单 `url` 同时充当前端路由 path 与页面组件定位 key，新增页面无需改动路由代码；
- 授权链路：菜单/按钮资源 → `xxl_boot_role_res` 授权给角色 → `xxl_boot_user_role` 将角色分配给用户；
- 前端通过权限标识渲染控制：Vue 使用 `v-hasPermi="['demo:demo:add']"`、React 使用 `hasPermi('demo:demo:add')`，后端接口通过 `@XxlSso` + 权限标识双重校验。

### 5.4、安全登录验证

项目进行安全的登录验证防护设计，基于 XXL-SSO 登录认证体系，支持集群部署与 SSO 单点登录集成。针对需要登录验证、以及需要强权限校验的页面、操作等资源控制场景，抽象出如下权限注解：

```
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Permission {

	/**
	 * 权限标识，为空则不校验，非空则需要通过RBAC权限体系进行相关资源授权才可访问    
	 */
	String value() default "";

	/**
	 * 是否需要登录验证，默认全部需要，特殊情况可定制
	 */
	boolean login() default true;
	
}
```

示例：
```
// 1、需要登录态
@Permission						

// 2、需要登录态，同时需要进行RBAC权限授权相关资源
@Permission("xxx")			

// 3、不需要登录态
@Permission(login = false)		
```

### 5.5、统一响应与交互规范

- 统一返回结构 `Response{ code、msg、data }`（`com.xxl.tool.response.Response`），code 200 表示成功；
- 分页统一返回 `Response<PageModel>`；分页入参统一 `offset`、`pagesize`；
- 接口路径规范：`/{module}/{business}/pageList|load|insert|delete|update`，业务接口统一 `@RequestMapping("/{module}/{business}")` + `@XxlSso` 鉴权；
- 前端取值约定：`response.data`（成功数据）、`response.data.data`（列表）、`response.data.total`（总数）；
- Mapper XML 中显式配置字段映射（resultMap），`add_time` / `update_time` 写入用 `NOW()`。

### 5.6、业务扩展与菜单零路由

新增业务模块遵循“平台核心不动、业务可插拔”的扩展原则：

- 平台核心：`framework` 包仅承载平台内置能力（登录、权限、系统管理、工具等），不承载具体业务；
- 业务扩展：新增业务一律落位到 `business/{module}` 包（后端）、`resources/mapper/{module}/`（Mapper XML）、`templates/business/{module}/`（单体 FTL 页面）；
- 菜单零路由：前端菜单完全由数据库 `xxl_boot_resource` 驱动，新建页面文件后仅需插入菜单记录（`url` 配置为 `/module/business`）并授权，前端 `loadView` 自动映射页面，全程无需改动路由代码；
- 三种模式落位对照：

```
                   单体模式              前后端分离（Vue）         前后端分离（React）
后端   Controller  business/{module}    business/{module}        business/{module}
后端   Mapper XML  mapper/business/{m}  mapper/{module}          mapper/{module}
前端   页面        templates/business/{m}/xxx.ftl   views/{m}/{p}/index.vue   pages/{m}/{p}/index.tsx
前端   接口封装    （服务端渲染）          api/{m}/{p}.ts          services/{m}/{p}.ts
前端   类型        （服务端渲染）          types/{m}/{p}.ts        types/{m}/{p}.d.ts
菜单   xxl_boot_resource(type=0/1/2) + xxl_boot_role_res 授权，url 驱动零路由改动
```

### 5.7、代码生成

内置端到端代码生成器，提供建表 SQL 即可自动生成前后端全套代码，加速敏捷迭代。三种模式共用一套后端生成引擎，前端模板按运行模式二选一：

| 模式 | 生成入口 | 产物 |
|---|---|---|
| 前后端分离 | 后台「系统工具-代码生成」页面；接口 `POST /tool/codegen/createTable`（入参 `tableSql` + `tplWebType`：vue 传 `element-plus-typescript`、react 传 `antd-typescript`） | 后端 `business/{module}` 6 件套、前端 vue3/react 三文件、`-init.sql` 菜单权限 SQL |
| 单体模式 | 后台「代码生成」页面；接口 `POST /tool/codegen/genCode`（入参 `tableSql / author / packagePath / businessName`） | `controller/service/service_impl/mapper/mapper_xml/entity/page` 7 段代码 |

生成代码强制依赖 `id` 主键；业务代码统一落 `business/{module}` 扩展包，不侵入平台核心。更多操作细节见 “3.3、代码生成” 与 “4.2 方式二：内置代码生成器”。

### 5.8、AI + Skill 辅助开发设计

为让 AI 编程助手也能产出平台级规范代码，仓库在 `.agents/skills/` 内置三大开发 SKILL，作为 AI 的“项目内专业规范”：

```
.agents/skills/
├── xxl-boot-monolith/SKILL.md      # 单体模式：SpringBoot + FreeMarker + AdminLTE 标准作业
├── xxl-boot-vue/SKILL.md           # Vue 分离模式：xxl-boot-api + xxl-boot-ui-vue 标准作业
└── xxl-boot-react/SKILL.md         # React 分离模式：xxl-boot-api + xxl-boot-ui-react 标准作业
```

每个 SKILL 均内置如下内容，保证 AI 产物与人工/生成器产物等价：

- 工程结构速览与通用规范引用；
- 后端落位清单（实体 / Mapper / Service / Controller 件套、包路径、方法顺序、分页与校验约定）；
- 前端落位清单（Vue：types/api/view；React：types/services/pages）与列表页代码骨架；
- 菜单权限 SQL 模板与「校验清单」；
- 参考样例文件绝对路径。

工作原理：AI 编程助手检测到任务与某运行模式匹配时自动加载对应 SKILL，按 “建表 → 后端 → 前端 → 菜单权限 → 验证” 标准流程直生代码并落位，最后按校验清单自检交付。SKILL 缺省策略为按内置代码生成模板直生等价代码，同时提示用户可到后台走生成器，两种产出完全一致、可无缝切换。详见 “4.3 方式三：AI + SKILL 驱动开发”。

## 六、版本更新日志

### 版本 v0.1.0 Release Notes[2018-05-03]
- 1、简洁：界面操作，简洁直观，可快速上手；
- 2、轻量级：仅需提供建表SQL，即可自动完成代码生成，简洁高效；
- 3、多层代码生成：自动生成  "controller/service/dao/mybatis/model" 多层代码，参与到开发全流程；
- 4、高效：从SQL到API接口，全部代码均支持自动生成，极大提高生产力和效率；
- 5、在线预览：代码生成后，支持实时在线预览，直接复制使用；

### 版本 v0.2.0 Release Notes[2019-10-03]
- 1、表字段comment不支持逗号问题修复；
- 2、Docker基础镜像切换，精简镜像；
- 3、修复注释为空页面渲染报错问题；
- 4、数据库类型为char，解析成object问题修复；
- 5、建表语句包含unique key，key里的属性，重复生成问题修复；
- 6、项目依赖升级，并清理POM冗余依赖；
-
### 版本 v1.0.0 Release Notes[2024-11-09]
- 1、【整合】项目更名 XXL-BOOT，整合xxl-permission、xxl-code-generator多个历史项目；定位为 快速开发平台，整合流行前后端技术能力，致力为中小企业与个人开发者打造开箱即用的快速开发解决方案。
- 2、【规范】研发规范：基于标准分层架构设计，统一数据响应结构体，规范化项目目录结构。
- 3、【规范】异常机制：严谨设计全局异常处理机制、ErrorPage异常处理机制，保障系统底限安全体验。
- 4、【新增】组织管理：针对组织、用户、角色及资源等进行管理，支持灵活的人员角色、菜单权限、人员授权等操作管理。
- 5、【新增】系统管理：提供通知触达、审计日志、系统监控……等相关能力，支持高校灵活进行系统监控及管理。
- 6、【新增】系统工具：提供Entity、业务代码、SQL、页面交互等……前后端一站式代码生成工具，辅助快速进行敏捷迭代开发。
- 7、【扩展】分布式扩展：系统设计预留丰富扩展能力，可低成本扩展接入RPC、MQ、JOB、CONF、KV、SSO…等分布式中间件能力。
- 8、【升级】升级依赖版本，如slf4j、poi、spring、gson、mysql…等。

### 版本 v1.1.0 Release Notes[2025-08-03]
- 1、【重构】登录认证重构，集成XXL-SSO提供登录认证能力，可扩展支持单点登录、分布式认证...等多场景登录诉求；
- 2、【重构】权限认证重构，支持注解式/API方式快速鉴权，便捷集成系统RBAC权限系统，提升系统安全性、以及二次开发效率体验；
- 3、【升级】升级依赖版本，如slf4j、xxl-tool、spring、gson、mysql-connector…等；

### 版本 v1.2.0 Release Notes[2025-08-10]
- 1、【升级】项目升级 SpringBoot3 + JDK17；
- 2、【升级】升级多项依赖至较新版本，如xxl-sso、jakarta、spring等，适配JDK17；

### 版本 v1.3.0 Release Notes[2025-08-23]
- 1、【安全】登录安全升级，密码加密处理算法从Md5改为Sha256；
    ```
    // 1、用户表password字段需要调整长度，执行如下命令
    ALTER TABLE xxl_boot_user
        MODIFY COLUMN `password` varchar(100) NOT NULL COMMENT '密码加密信息';
        
    // 2、存量用户密码需要修改，可执行如下命令将密码初始化 “123456”；也可以自行通过 “SHA256Tool.sha256” 工具生成其他初始化密码；
    UPDATE xxl_boot_user t SET t.password = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92' WHERE t.username = {用户名};
    ```
- 2、【优化】登录态持久化逻辑调整，简化代码逻辑；
- 3、【优化】异常页面处理逻辑优化，新增兜底落地页配置；
- 4、【优化】登录信息页面空值处理优化，避免空值影响ftl渲染；
- 5、【优化】系统日志调整，支持启动时指定 -DLOG_HOME 参数自定义日志位置；同时优化日志格式提升易读性；

### 版本 v1.4.0 Release Notes[2025-09-06]
- 1、【新增】UI框架操作升级，新增支持iframe以及tab页签管理功能；
- 2、【优化】UI框架tab页面初始化优化，支持根据URL地址自动定位菜单页面；
- 3、【新增】新增支持主题切换，支持切换UI主题以及UI配置；
- 4、【优化】修改密码优化，限制提供旧密码；
- 5、【优化】调整 UI框架的底部 bar 高度，增加正文内容展示区域

### 版本 v1.5.0 Release Notes[2025-09-20]
- 1、【新增】UI框架Table组件封装，抽象基础操作提升复用；
- 2、【升级】升级依赖版本，如 springboot、spring 等；
- 3、【新增】代码生成：支持交互层代码生成，包括页面ui及js代码生成；

### 版本 v1.6.0 Release Notes[2025-10-08]
- 1、【优化】调整资源加载逻辑，移除不必要的拦截器逻辑，提升页面加载效率；
- 2、【优化】重构国际化组件，优化模板静态工具加载方式；
- 3、【优化】数据表格组件分页字段规范，统一前后端交互字段；
- 4、【优化】TAB组件逻辑优化，避免小概率情况下首页加载失败问题；
- 5、【修复】通知消息非空校验优化，修复内容为空时异常提示问题；
- 6、【升级】升级多项依赖至较新版本；

### 版本 v1.7.0 Release Notes[2025-12-27]
- 1、【升级】升级至 SpringBoot4；升级多项maven依赖至较新版本，如 spring、groovy 等；
- 2、【新增】插件化升级：支持扩展并隔离业务模块，为后续逐步扩展业务插件模块做前置准备；
- 3、【新增】新增“AI模块”：
  - Model管理：支持多模型供应商，包括：Ollama、OpenAI等。
  - Chat对话：支持自定义Prompt、对话Model；支持历史对话持久化，历史对话记忆保留；
- 4、【优化】增加主题皮肤选项并优化界面交互；
- 5、【优化】表格交互优化：优化分页显示配置；禁用分页循环；多选行操作优化/默认单选；
- 6、【优化】升级IP地理位置解析工具，重构工具类使用新版API进行初始化和查询；
- 7、【优化】Maven依赖管理优化，统一各模块依赖版本号引用，便于集中维护管理
- 8、【优化】代码生成SQL解析逻辑优化，解决字段类型大小写识别不兼容问题；

### 版本 v2.0.0 Release Notes[2026-08-08]
- 1、【新增】XXL-BOOT 前后端分离版本 发布：支持 单体项目、前后端分离项目 多模式；
  - 前后端分离模式：
    - 前端UI模块：xxl-boot-ui-vue 或 xxl-boot-ui-react，支持独立部署，提供前端UI服务；
    - 后端API模块：xxl-boot-api，支持独立部署，提供后端API服务；
  - 单体模式：xxl-boot-admin，提供前后端一体化服务；
- 2、【新增】Docker Compose部署：新增 Docker Compose 配置，支持一键配置部署启动；

<details>
    <summary>Docker Compose启动步骤：</summary>    

    ```
    // 第一步：前往仓库目录
    cd ./xxl-boot
    // 第二步：项目构建
    mvn clean package -Dmaven.test.skip=true
    // 第三步：项目配置（注意：前往docker/modular-vue目录并自定义 .env 配置；如修改 MYSQL_PATH 配置设置Mysql数据持久化目录；）
    cd ./docker/modular-vue/
    cat .env
    // 启动、停止项目
    docker compose up -d
    docker compose down
    ```
</details>

- 3、【重构】Monorepo：基于Monorepo模式重构仓库，单体项目 与 前后端分离项目统一托管，统一版本管理与依赖管理，便于协同开发与一键构建。
- 4、【新增】AI模块升级：支持知识库管理，支持知识分片、向量化存储及检索等；
- 5、【新增】代码生成工具：支持指定 author、package 和 业务实体名等；
- 6、【强化】代码生成工具：SQL解析兼容性增强，表字段无引号兼容、大小写兼容、非Filed过滤；
- 7、【新增】表单构建工具：支持拖拽表单字段动态排序，并生产表单代码；
- 8、【升级】升级多项依赖至较新版本；

### 版本 v2.1.0 Release Notes[2026-08-30]
- 1、【新增】React 前端版本发布：React + Vite + AntDesign + TypeScript 前端工程正式交付，与 Vue 模式共享统一后端 API，随生产构建并行发布；
- 2、【新增】Vue 前端版本升级 TypeScript：Vue3 与 React 前端模块全面升级 TypeScript，类型约束更严谨、IDE 提示更完善；
- 3、【新增】AI + SKILL 驱动开发：仓库内置 `xxl-boot-monolith / xxl-boot-vue / xxl-boot-react` 三大开发 SKILL，AI 编程助手可自动识别并加载，按平台规范直生业务代码、自动落位并附校验清单，加速业务开发；
- 4、【新增】前端规范增强：Vue 模块引入 ESLint + Prettier，React 模块引入 Biome，提升代码规范性与可维护性；
- 5、【新增】代码生成器兼容 TypeScript：生成器支持 前端 type/types 文件，并内置 vue3/react 前端模板（types/api/view），前后端分离（Vue/React）模式可一键生成前端代码；
- 6、【新增】“新增业务模块”支持三方式：传统手工、内置代码生成器、AI + SKILL 驱动，均输出等价代码与菜单权限 SQL，可混合切换；
- 7、【文档】官方文档重构：快速入门按 单体 / Vue / React 三种模式分述；操作指南改为“能力总览 + 分章节详解”总分结构；新增“新增业务模块”三方式详解；总体设计完善（新增 三种运行模式、统一响应规范、业务扩展与菜单零路由、AI + Skill 辅助开发设计）等章节；
- 8、【升级】升级多项依赖至较新版本。

<details>
    <summary>AI + SKILL 使用步骤：</summary>    

    ```
    // 第一步：使用 AI 编程助手（如 opencode）打开 XXL-BOOT 仓库
    // 第二步：明确运行模式（单体 / Vue / React 分离）与业务诉求（模块名 + 字段/SQL）
    // 第三步：AI 自动加载对应 SKILL（xxl-boot-monolith / xxl-boot-vue / xxl-boot-react），
    //         按“建表 → 后端 → 前端 → 菜单权限 → 验证”标准流程直生代码并落位
    // 第四步：人工执行建表与菜单 SQL，启动服务联调验收；AI 按校验清单自检交付
    ```
</details>


### TODO LIST
- 1、单体版本，代码生成 支持自定义代码层级目录；
- 2、单体版本，iframe弹框居中优化；
- 3、单体版本，左侧菜单改为JS方式；
- 4、AI项目独立：
  - 模块：
    - Model配置：Model配置管理，支持多Model类型，包括：基础模型、文本模型、视觉模型...等；支持多模型供应商，包括：Ollama、OpenAI...等。
    - Chat对话：Chat对话管理，支持自定义Prompt、Model参数；支持历史对话消息持久化，保留历史对话记忆；可基于此支持多场景，包括：智能客服、聊天助手...等；
    - 知识库：知识库管理，支持知识库管理、索引、检索等；支持多知识库类型，包括：Text、Word、PDF、图片...等；
    - WorkFlow定义：WorkFlow定义管理，支持工作流及Agent/模型的编排定义；工作流执行及日志记录，支持分布式工作流执行以及执行日志记录；
    - Agent生图：文生图、图生图；生图流程设计，支持集成多模型供应商；
    - Agent生视频：文生视频、图生视频；支持集成多模型供应商；
  - Chat对话增强；
    - 前端SSE交互；
    - 对话记忆控制；
    - 代码重构，多模块可扩展设计；
  - 生图Agent：生图流程设计，集成本地Vision模型；
- 5、菜单API接口重构统一，适配逻辑上提到前端项目；
- 6、React 功能模块代码重构；

## 七、其他

### 7.1 项目贡献
欢迎参与项目贡献！比如提交PR修复一个bug，或者新建 [Issue](https://github.com/xuxueli/xxl-boot/issues/) 讨论新特性或者变更。

### 7.2 用户接入登记
更多接入的公司，欢迎在 [登记地址](https://github.com/xuxueli/xxl-boot/issues/1 ) 登记，登记仅仅为了产品推广。

### 7.3 开源协议和版权
产品开源免费，并且将持续提供免费的社区技术支持。个人或企业内部可自由的接入和使用。

- Licensed under the GNU General Public License (GPL) v3.
- Copyright (c) 2015-present, xuxueli.

---
### 捐赠
无论金额多少都足够表达您这份心意，非常感谢 ：）      [前往捐赠](https://www.xuxueli.com/page/donate.html )