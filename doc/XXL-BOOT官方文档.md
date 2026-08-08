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

XXL-BOOT 是一个快速开发平台，易学易用、扩展丰富、开箱即用。内置安全登录、权限管控、端到端代码生成、响应式UI、国际化、分布式扩展……等能力。整合前后端流行技术，致力为 中小企业、个人开发者 打造开箱即用的中后台解决方案。

### 1.2 特性
- 1、账号安全：基于token设计账号登录生命周期能力，支持集群部署及SSO集成，保障账号体系安全性与扩展性。
- 2、权限管控：基于RBAC设计的用户角色权限管控能力，支持动态菜单&按钮级资源定义、灵活用户角色权限管控，管控防护系统资源。
- 3、用户管理：针对系统用户进行管理，进行用户新增、管理、角色授权等操作。
- 4、角色管理：针对系统权限角色进行动态管理，进行角色新增、管理、菜单分配等操作。
- 5、资源管理：针对系统资源进行细粒度管理，支持目录、菜单、按钮等多类型资源管理，进行新增、管理等操作。
- 6、组织管理：针对部门组织架构进行管理，进行多层级组织架构的新增、管理、排序等操作。
- 7、字典管理：针对系统字典进行线上化管理，包括字典定义、字典数据等，动态定义及扩展。
- 8、配置中心：针对常用业务数据进行动态配置，包括配置定义、配置值管理等，在线管理并实时生效。
- 9、站内消息：针对系统用户推送站内消息，包括站内消息发布及维护管理、触达及已读查阅分析等。
- 10、审计日志：记录系统操作及活动的日志，用于系统的监控、审计和安全分析，可快速了解系统运行情况、发现异常行为、追溯问题源头，以及评估系统的安全性。
- 11、代码生成：内置代码生成器，支持前后端、全流程代码生成，覆盖“controller/servie/mapper&xml/entity/js/view…”等多层。只需提供SQL将会自动生成全部代码，加速研发效率。
- 12、表单生成：内置表单/页面生成器，支持组件拖拽方式生成表单/页面，支持多种组件、布局和样式，支持响应式布局，保障用户体验及交互。
- 13、响应式UI：集成流行、可复用前端组件，支持丰富的UI组件、布局和样式，支持响应式布局，保障用户体验及交互。
- 14、国际化：支持国际化设置，提供中文、英文两种可选语言，可结合实际诉求定制扩展，默认为中文；
- 15、研发规范：基于标准分层架构设计，统一数据响应结构体，规范化项目目录结构。
- 16、异常防护：严谨设计全局异常处理机制、ErrorPage异常处理机制，保障系统底限安全体验。
- 17、分布式扩展：系统设计预留丰富扩展能力，可低成本扩展接入RPC、MQ、JOB、CONF、KV、SSO…等分布式中间件能力。
- 18、在线用户：实时查看分析当前在线用户，支持一键踢出异常用户登录态。
- 19、系统监控：针对服务器硬件资源监控，如CPU使用率、JVM状态、磁盘利用率……等；支持一键GC等系统主动优化能力。
- 20、Monorepo：基于Monorepo仓库模式，单体项目 与 前后端分离项目统一托管，统一版本管理与依赖管理，便于协同开发与一键构建。

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
- Redis：7.0+（可选：前后端分离项目需要）

### 1.5 发展历程

于2015年中，发布 xxl-permission 项目，定位基于RBAC实现的后台管理系统，支持动态菜单资源定义、用户角色权限管控，前后端端到端有效封装，开箱即用。

于2018年5月，发布 xxl-code-generator 项目，定位覆盖 "controller/service/mapper/entity/……"的多层代码生成系统。只需要提供SQL，将会自动生成全部代码。

于2024年11月，xxl-code-generator 项目更名 XXL-BOOT，整合xxl-permission、xxl-code-generator多个历史项目，并吸收 XXL-JOB、XXL-CONF 等系列开源软件所所沉淀中后台能力。
XXL-BOOT 定位为 快速开发平台，整合流行前后端技术能力，致力为中小企业与个人开发者打造开箱即用的快速开发解决方案。

于2026年8月，XXL-BOOT 整合主流技术栈，推出前后端分离版本。业务方可以根据实际业务诉求，自行选择 单体版本、前后端分离版本。

## 二、快速入门

### 2.1 初始化数据库
下载项目源码并解压，获取 "数据库初始化SQL脚本" 并执行即可。数据库初始化SQL脚本 位置为:

```
/xxl-boot/doc/db/
    - tables_xxl_boot.sql                   ：系统初始化SQL脚本【必须】
    - tables_xxl_boot_monolith.sql          ：单体项目初始化SQL脚本【可选，部署单体项目时使用】
    - tables_xxl_boot_modular.sql           ：前后端分离项目初始化SQL脚本【可选，部署前后端分离项目时使用】
```

补充说明：如需部署单体项目，只需要执行 `tables_xxl_boot.sql` 即可；如需切换部署 “前后端分离项目”或“单体项目”，则需要执行 `tables_xxl_boot_modular.sql` 或 `tables_xxl_boot_monolith.sql`。

### 2.2 编译源码    
项目为 Monorepo仓库，单体项目 与 前后端分离项目 维护在同一个代码仓库中，通过不同目录模块隔离维护。
解压源码,按照maven格式将源码导入IDE, 使用maven进行编译即可，源码结构如下：

```
- xxl-boot/
    - xxl-boot-admin        : 【单体项目】单体项目服务
    - xxx-boot-api          : 【前后端分离项目】后端API服务
    - xxl-boot-ui           : 【前后端分离项目】前端UI服务
```

补充说明：如需部署“单体项目”，只需要部署 `xxl-boot-admin` 模块即可；如需部署 “前后端分离项目”，需要部署 `xxl-boot-api` + `xxl-boot-ui`。

### 2.3 配置部署（单体项目）

- 部署项目：xxl-boot-admin
- 项目说明：单体模式 中后台系统，前后端分别选型典型的 “SpringBoot/Mybatis/XXL-SSO/FreeMarker” 与 “AdminLTE/Bootstrap”；内置 “组织权限、系统工具、前后端代码生成” 等能力。

#### 步骤一：配置文件
配置文件地址：

```
/xxl-boot/xxl-boot-admin/src/main/resources/application.properties
```

配置内容说明：

```
### xxl-boot, datasource。 数据库配置，与 ”2.1 初始化数据库“ 章节初始化的数据库保持一致。
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/xxl_boot?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=root_pwd
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

#### 步骤二：部署项目
项目打包部署后，可通过如下地址及账号进行登录。
- 访问地址：http://localhost:8080 
- 默认登录账号："admin/123456"

登录页截图示例：
![输入图片说明](https://www.xuxueli.com/project/static/xxl-boot/images/img_001.png "在这里输入图片标题")

系统首页截图示例：
![输入图片说明](https://www.xuxueli.com/project/static/xxl-boot/images/img_002.png "在这里输入图片标题")


### 2.4 配置部署（前后端分离项目）

- 部署项目：xxl-boot-api + xxl-boot-ui
- 项目说明：前后端分离模式，后端API与前端UI独立部署、独立运行。后端选型 "SpringBoot/Mybatis/XXL-SSO"，前端选型 "Vue3/Vite/ElementPlus"。

#### 步骤一：后端配置文件
配置文件地址：

```
/xxl-boot/xxl-boot-api/src/main/resources/application.properties
```

配置内容说明（数据库配置，与 ”2.1 初始化数据库“ 章节初始化的数据库保持一致）：

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
- 后端服务默认端口为 `8081`，可通过 `server.port` 调整；
- 前后端分离项目依赖 Redis，部署前需确保 Redis 服务可用。

#### 步骤二：部署后端项目
项目打包部署后，后端API服务启动成功，可通过 `http://localhost:8081` 访问。

#### 步骤三：前端环境配置
配置文件地址（按环境区分）：

```
/xxl-boot/xxl-boot-ui/.env.development        # 开发环境
/xxl-boot/xxl-boot-ui/.env.staging            # 预发布环境
/xxl-boot/xxl-boot-ui/.env.production         # 生产环境
```

配置内容说明：

```
# 前端端口号
VITE_APP_PORT=3000

# 后端API地址
VITE_API_URL=http://localhost:8081
# 后端路由前缀
VITE_APP_BASE_API='/api'
```

补充说明：
- `VITE_API_URL`：后端API服务地址，开发模式下由 Vite 代理转发，生产模式下由前端 Web 服务器（如 Nginx）反向代理；
- `VITE_APP_BASE_API`：后端路由前缀，默认 `/api`，前端请求会统一添加此前缀，代理或反向代理时需将其移除并转发至后端服务。

#### 步骤四：部署前端项目（本地）
开发模式下，进入 `xxl-boot-ui` 目录，安装依赖并启动即可：

```
cd /xxl-boot/xxl-boot-ui
npm install
npm run dev
```

启动后访问 `http://localhost:3000`，开发服务器会将 `/api` 前缀的请求自动代理至 `VITE_API_URL` 指定的后端服务。

#### 步骤五：部署前端项目（生产）

生产模式下，构建产物后部署至 Web 服务器（如 Nginx），并配置反向代理转发 API 请求：
```
cd /xxl-boot/xxl-boot-ui
npm run build:prod          # 构建产物输出至 dist 目录
```

Nginx 反向代理配置示例：
```
server {
    listen       3000;
    server_name  localhost;

    # 前端静态资源
    root  /data/xxl-boot-ui/dist;
    index index.html;

    # 单页应用路由支持（前端 History 模式）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 后端API反向代理
    location /api/ {
        proxy_pass   http://127.0.0.1:8081/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

项目部署完成后，可通过如下地址及账号进行登录。
- 访问地址：http://localhost:3000 （按实际部署配置调整）
- 默认登录账号："admin/123456"

登录页截图示例：
![输入图片说明](https://www.xuxueli.com/project/static/xxl-boot/images/img_014.png "在这里输入图片标题")

系统首页截图示例：
![输入图片说明](https://www.xuxueli.com/project/static/xxl-boot/images/img_015.png "在这里输入图片标题")


### 2.5 Docker Compose 部署（单体项目）
项目支持通过 Docker Compose 方式部署并启动，如下介绍 单体项目 部署方式：

第一步：Clone并进入仓库
```
git clone https://github.com/xuxueli/xxl-boot.git
cd ./xxl-boot
```

第二步：项目构建
```
mvn clean package -Dmaven.test.skip=true
```

第三步：项目配置
>注意：支持自定义 .env 配置，如修改 MYSQL_PATH 配置设置Mysql数据持久化目录；

```
cd ./docker/monolith/
cat .env
```

第四步：启动/停止项目

```
docker compose up -d
docker compose down
```

### 2.5 Docker Compose 部署（前后端分离项目）
项目支持通过 Docker Compose 方式部署并启动，如下介绍 前后端分离项目 部署方式：

第一步：Clone并进入仓库
```
git clone https://github.com/xuxueli/xxl-boot.git
cd ./xxl-boot
```

第二步：项目构建
```
mvn clean package -Dmaven.test.skip=true
```

第三步：项目配置
>注意：支持自定义 .env 配置，如修改 MYSQL_PATH 配置设置Mysql数据持久化目录；

```
cd ./docker/modular/
cat .env
```

第四步：启动/停止项目

```
docker compose up -d
docker compose down
```


## 三、操作指南

### 3.1、权限管控

进入“用户管理”菜单，支持针对系统用户进行管理，进行用户新增、管理、角色授权等操作。
![输入图片说明](https://www.xuxueli.com/project/static/xxl-boot/images/img_003.png "在这里输入图片标题")

进入“角色管理”菜单，支持针对系统权限角色进行动态管理，进行角色新增、管理、菜单分配等操作。
![输入图片说明](https://www.xuxueli.com/project/static/xxl-boot/images/img_004.png "在这里输入图片标题")

![输入图片说明](https://www.xuxueli.com/project/static/xxl-boot/images/img_005.png "在这里输入图片标题")

进入“资源管理”菜单，支持针对系统资源进行细粒度管理，支持页面、按钮等多类型资源管理，进行新增、管理等操作。
![输入图片说明](https://www.xuxueli.com/project/static/xxl-boot/images/img_006.png "在这里输入图片标题")

### 3.2、代码生成

#### 第一步：准备SQL 

内置代码生成器，只需提供SQL将会自动生成全部代码，覆盖“controller/servie/dao/entity…”等多层，加速研发效率。

默认提供Demo表SQL语句，可操作体验，参考下图。
![输入图片说明](https://www.xuxueli.com/project/static/xxl-boot/images/img_007.png "在这里输入图片标题")

#### 第二步：生成代码
点击右上角 "生成代码按钮"，即可完整多层代码的生成，非常方便；

#### 第三步：Finish
代码生成后，可在界面查看和使用 "controller/service/mapper/mybatis/entity..." 多层源代码。部分截图如下：

![输入图片说明](https://www.xuxueli.com/project/static/xxl-boot/images/img_008.png "在这里输入图片标题")

### 3.3、站内消息
略

### 3.4、审计日志
略


## 四、总体设计

### 4.1、Monorepo仓库

项目采用 Monorepo 仓库模式，将 单体项目 与 前后端分离项目 维护在同一个代码仓库中，通过不同目录模块隔离维护，统一版本管理与依赖管理，便于协同开发与一键构建。

- 后端统一通过 Maven 父工程管理，根目录 `pom.xml` 集中维护模块依赖版本（如 SpringBoot、Mybatis、MySQL、XXL-SSO 等），子模块 `xxl-boot-admin`、`xxl-boot-api` 继承使用；
- 前端模块 `xxl-boot-ui` 独立通过 npm 管理依赖（Vue3、Vite、ElementPlus 等），与后端 Maven 工程解耦。

仓库目录结构如下：
```
xxl-boot/
│
├── pom.xml                                    # 父工程Maven配置：统一管理模块及依赖版本
│
├── doc/                                       # 文档目录
│   ├── db/                                    # 数据库初始化SQL脚本目录
│   │   ├── tables_xxl_boot.sql                # 系统初始化SQL脚本
│   │   ├── tables_xxl_boot_custom.sql         # 系统数据定制SQL脚本
│   ├── images/                                # 文档图片目录
│   └── XXL-BOOT官方文档.md                    # 官方文档
│
├── xxl-boot-admin/                            # 【单体项目】单体服务模块
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
├── xxl-boot-api/                              # 【前后端分离项目】后端API服务模块
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
│           │   └── tool/codegen/              # 代码生成 模板文件
│           └── i18n/                          # 国际化资源文件
│
└── xxl-boot-ui/                               # 【前后端分离项目】前端UI服务模块
    ├── package.json                           # 前端依赖配置
    ├── vite.config.js                         # Vite构建配置
    └── src/
        ├── main.js                            # 入口文件
        ├── App.vue                            # 根组件
        ├── router/                            # 路由配置
        ├── store/                             # 状态管理
        ├── api/                               # 接口封装
        ├── views/                             # 页面组件
        ├── components/                        # 通用组件
        ├── layout/                            # 布局组件
        ├── composables/                       # 组合式函数
        ├── utils/                             # 工具类
        ├── directive/                         # 自定义指令
        ├── assets/                            # 静态资源
        └── settings.js                        # 全局配置
```

补充说明：
- 构建：后端模块在仓库根目录执行 `mvn clean package` 即可一键编译全部 Maven 模块；前端模块进入 `xxl-boot-ui` 目录执行 `npm install`、`npm run build:prod` 构建；
- 部署：单体项目部署 `xxl-boot-admin` 模块；前后端分离项目部署 `xxl-boot-api` + `xxl-boot-ui` 两个模块，参考 “2.3 配置部署（单体项目）” 与 “2.4 配置部署（前后端分离项目）”；
- 扩展：新增业务模块时，可在各模块 `business` 扩展包中开发，并配套放置 MyBatis 映射文件、模板文件及配置文件，参考 “五、业务扩展”。

### 4.2、RBAC权限体系

项目进行安全的用户权限体系设计，基于RBAC（Role-Based Access Control，基于角色的访问控制）这种广泛采用的权限管理模型，通过将权限授予角色，然后将角色分配给用户，从而实现对系统资源的访问控制。
RBAC 的设计目标是简化对系统资源的访问管理，提高系统的安全性和可维护性。以下是项目 RBAC 权限体系相关实体表：

```
xxl_boot_user           : 用户表
xxl_boot_role           : 角色表
xxl_boot_resource       : 资源表，菜单Page、功能Btn等。
xxl_boot_user_role      : 用户-角色关系表
xxl_boot_role_res       : 角色-资源关系表
```

### 4.3、安全登录验证

项目进行安全的登录验证防护设计，针对需要登录验证、以及需要强权限校验的页面、操作等资源控制场景，抽象出如下权限注解：

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

### 4.4、代码生成
参考上文 “3.1、代码生成”。


## 五、新增业务模块
略


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
- 1、【新增】XXL-BOOT 前后端分离版本 发布：支持 单体项目、前后端分析项目 多模式；
  - 前后端分离模式：
    - 前端UI模块：xxl-boot-ui，支持独立部署，提供前端UI服务；
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
    // 第三步：项目配置（注意：前往docker/modular目录并自定义 .env 配置；如修改 MYSQL_PATH 配置设置Mysql数据持久化目录；）
    cd ./docker/modular/
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

### 版本 v2.1.0 Release Notes[ING]
- 1、【新增】前端UI模块（xxl-boot-ui）升级至 TypeScript;
- 2、【TODO】代码生成工具升级，兼容支持 TypeScript；支持 type 文件；
- 3、【TODO】ESLint + Prettier 配置；Agents 规范完善；


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
