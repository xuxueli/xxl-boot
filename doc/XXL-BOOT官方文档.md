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

XXL-BOOT 是一个快速开发平台，易学易用、简化开发、丰富扩展、开箱即用。内置安全登录、权限管控、端到端代码生成、响应式UI、国际化、分布式扩展……等能力。整合前后端流行技术，致力为 中小企业、个人开发者 打造开箱即用的中后台解决方案。

### 1.2 特性
- 1、安全登录：基于token设计登录、注销能力，系统支持集群部署及登录，保障账号及用户资产安全。
- 2、权限管控：基于RBAC设计的用户角色权限管控能力，支持动态菜单&按钮级资源定义、灵活用户角色权限管控，管控防护系统资源。
- 3、端到端代码生成：内置代码生成器，支持前后端、全流程代码生成，覆盖“controller/servie/dao/entity/js…”等多层。只需提供SQL将会自动生成全部代码，加速研发效率。
- 4、响应式UI：集成流行、可复用前端组件，支持丰富的UI组件、布局和样式，支持响应式布局，保障用户体验及交互。
- 5、国际化：支持国际化设置，提供中文、英文两种可选语言，可结合实际诉求定制扩展，默认为中文；
- 6、研发规范：基于标准分层架构设计，统一数据响应结构体，规范化项目目录结构。
- 7、异常机制：严谨设计全局异常处理机制、ErrorPage异常处理机制，保障系统底限安全体验。
- 8、分布式扩展：系统设计预留丰富扩展能力，可低成本扩展接入RPC、MQ、JOB、CONF、KV、SSO…等分布式中间件能力。
- 9、审计日志：记录系统操作及活动的日志，用于系统的监控、审计和安全分析，可快速了解系统运行情况、发现异常行为、追溯问题源头，以及评估系统的安全性。
- 10、通知管理：针对系统用户推送通知消息，支持自定义推送范围（全员、部分圈选），支持触达率、打开率监控。
- 11、用户管理：针对系统用户进行管理，进行用户新增、管理、角色授权等操作。
- 12、角色管理：针对系统权限角色进行动态管理，进行角色新增、管理、菜单分配等操作。
- 13、资源管理：针对系统资源进行细粒度管理，支持页面、按钮等多类型资源管理，进行新增、管理等操作。
- 14、组织管理：针对部门组织架构进行管理，进行多层级组织架构的新增、管理、排序等操作。
- 15、配置中心： 针对常用业务数据进行动态配置，如业务参数、数据字典等，进行新增、管理等操作。
- 16、在线用户：实时查看分析当前在线用户，支持一键踢出异常用户登录态。
- 17、系统监控：针对服务器硬件资源监控，如CPU使用率、JVM状态、磁盘利用率……等；支持一键GC等系统主动优化能力。


### 1.3 下载

#### 文档地址

- [中文文档](https://www.xuxueli.com/xxl-boot/)

#### 源码仓库地址

源码仓库地址 | Release Download
--- | ---
[https://github.com/xuxueli/xxl-boot](https://github.com/xuxueli/xxl-boot) | [Download](https://github.com/xuxueli/xxl-boot/releases)
[https://gitee.com/xuxueli0323/xxl-boot](https://gitee.com/xuxueli0323/xxl-boot) | [Download](https://gitee.com/xuxueli0323/xxl-boot/releases)  


#### 技术交流
- [社区交流](https://www.xuxueli.com/page/community.html)

### 1.4 环境
- Maven：3+
- Jdk：17+
- Mysql：8.0+

### 1.5 发展历程
XXL-BOOT 前身为 xxl-permission、xxl-code-generator 等多个历史项目，以及 XXL-JOB、XXL-CONF 等系列开源软件所所沉淀中后台能力，经过整合演进最终诞生。
- 1、xxl-code-generator：首版发布于2018年5月，一个覆盖"controller/service/dao/entity/……"的多层代码生成系统。只需要提供SQL，将会自动生成全部代码。(已废弃，整合至XXL-BOOT)
- 2、xxl-permission：首版完成于2015年，一个基于RBAC实现的后台管理系统，支持动态菜单资源定义、用户角色权限管控，前后端端到端有效封装，开箱即用。(已废弃，整合至XXL-BOOT)

## 二、快速入门

### 2.1 初始化数据库
请下载项目源码并解压，获取 "数据库初始化SQL脚本" 并执行即可。"调度数据库初始化SQL脚本" 位置为:
```
/xxl-boot/doc/db/tables_xxl_boot.sql
```
项目支持集群部署，集群情况下各节点务必连接同一个mysql实例。

### 2.2 编译源码
解压源码,按照maven格式将源码导入IDE, 使用maven进行编译即可，源码结构如下：
```
- xxl-boot
    - xxl-boot-admin        : 中后台系统模块
    - xxx-boot-web          : 前台系统服务（预留）
```

### 2.3 配置部署
- 部署项目：xxl-boot-admin
- 项目说明：中后台系统模块，内置“安全登录验证、RBAC权限体系、一站式代码生成、通告触达、审计日志……”等能力。

#### 步骤一：配置文件设置
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


#### 步骤二：部署项目：
项目打包部署后，可通过如下地址及账号进行登录。
- 访问地址：http://localhost:8080/xxl-boot-admin   
- 默认登录账号："admin/123456"

登录页截图示例：
![输入图片说明](https://www.xuxueli.com/doc/static/xxl-boot/images/img_001.png "在这里输入图片标题")

系统首页截图示例：
![输入图片说明](https://www.xuxueli.com/doc/static/xxl-boot/images/img_002.png "在这里输入图片标题")

#### 步骤三：集群部署（可选）：
项目支持集群部署，提升系统容灾和可用性。 集群部署时，几点要求和建议：
- DB配置保持一致；
- 集群机器时钟保持一致（单机集群忽视）；

## 三、操作指南

### 3.1、权限管控

进入“用户管理”菜单，支持针对系统用户进行管理，进行用户新增、管理、角色授权等操作。
![输入图片说明](https://www.xuxueli.com/doc/static/xxl-boot/images/img_003.png "在这里输入图片标题")

进入“角色管理”菜单，支持针对系统权限角色进行动态管理，进行角色新增、管理、菜单分配等操作。
![输入图片说明](https://www.xuxueli.com/doc/static/xxl-boot/images/img_004.png "在这里输入图片标题")

![输入图片说明](https://www.xuxueli.com/doc/static/xxl-boot/images/img_005.png "在这里输入图片标题")

进入“资源管理”菜单，支持针对系统资源进行细粒度管理，支持页面、按钮等多类型资源管理，进行新增、管理等操作。
![输入图片说明](https://www.xuxueli.com/doc/static/xxl-boot/images/img_006.png "在这里输入图片标题")

### 3.2、代码生成

#### 第一步：准备SQL 

内置代码生成器，只需提供SQL将会自动生成全部代码，覆盖“controller/servie/dao/entity…”等多层，加速研发效率。

默认提供Demo表SQL语句，可操作体验，参考下图。
![输入图片说明](https://www.xuxueli.com/doc/static/xxl-boot/images/img_007.png "在这里输入图片标题")

#### 第二步：生成代码
点击右上角 "生成代码按钮"，即可完整多层代码的生成，非常方便；

#### 第三步：Finish
代码生成后，可在界面查看和使用 "controller/service/dao/mybatis/model" 多层源代码。部分截图如下：

代码生成截图示例：
![输入图片说明](https://www.xuxueli.com/doc/static/xxl-boot/images/img_008.png "在这里输入图片标题")

代码生成截图示例：
![输入图片说明](https://www.xuxueli.com/doc/static/xxl-boot/images/img_009.png "在这里输入图片标题")

代码生成截图示例：
![输入图片说明](https://www.xuxueli.com/doc/static/xxl-boot/images/img_010.png "在这里输入图片标题")

代码生成截图示例：
![输入图片说明](https://www.xuxueli.com/doc/static/xxl-boot/images/img_011.png "在这里输入图片标题")

代码生成截图示例：
![输入图片说明](https://www.xuxueli.com/doc/static/xxl-boot/images/img_012.png "在这里输入图片标题")

代码生成截图示例：
![输入图片说明](https://www.xuxueli.com/doc/static/xxl-boot/images/img_013.png "在这里输入图片标题")


## 四、总体设计

### 4.1、系统架构
略

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
	 * permission value (need login)    // 权限标识，为空则不校验，非空则需要通过RBAC权限体系进行相关资源授权才可访问
	 */
	String value() default "";

	/**
	 * need login                       // 是否需要登录验证，默认全部需要，特殊情况可定制
	 */
	boolean login() default true;
	
}
```

示例：
```
// 1、需要登录态
@Permission						: need login, but not valid permission

// 2、需要登录态，同时需要进行RBAC权限授权相关资源
@Permission("xxx")				: need login, and valid permission

// 3、不需要登录态
@Permission(login = false)		: not need login, not valid anything
```

### 4.4、一站式代码生成
参考上文 “3.1、代码生成”。

### 4.5、通告触达
略

### 4.6、审计日志
略

### 4.7 Docker镜像构建
除通过原始方式部署外，可以通过以下命令快速构建项目，并启动运行；

```
/**
* build package
*/ 
mvn clean package

/**
* build docker image
*/ 
docker build -t xuxueli/xxl-boot-admin:{指定版本} ./xxl-boot-admin

/**
* 如需自定义 “项目配置文件” 中配置项，比如 mysql 配置，可通过 "-e PARAMS" 指定，参数格式: -e PARAMS="--key=value --key2=value2"；
* （配置项参考文件：/xxl-boot/xxl-boot-admin/src/main/resources/application.properties）
* 如需自定义 “JVM内存参数”，可通过 "-e JAVA_OPTS" 指定，参数格式: -e JAVA_OPTS="-Xmx512m"
* 如需自定义 “日志文件目录”，可通过 "-e LOG_HOME" 指定，参数格式: -e LOG_HOME=/data/applogs
*/

docker run -d \
-e PARAMS="--spring.datasource.url=jdbc:mysql://127.0.0.1:3306/xxl_boot?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai" \
-p 8080:8080 \
-v /tmp:/data/applogs \
--name xxl-boot-admin \
xuxueli/xxl-boot-admin:{指定版本}
```


## 四、版本更新日志
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

### 版本 v1.7.0 Release Notes[ING]
- 1、【升级】升级依赖版本，如 springboot、spring、mybatis、xxl-sso 等；
- 2、【优化】增加主题皮肤选项并优化界面交互；
- 3、【新增】插件化升级：支持扩展并隔离业务模块，为后续逐步扩展业务插件模块做前置准备；
- 4、【ING】对话Agent：Agent管理配置，集成ollama；多对话管理，对话历史记录，上下文记忆；
- 5、【ING】知识库：知识库管理，向量数据库集成；
- 6、【ING】Workflow：工作流管理，支持模型能力编排；执行历史记录；
- 7、【ING】生图Agent：生图流程设计，集成本地Vision模型；
- 8、【ING】视频Agent：视频流程设计，集成本地Vision模型；
- 9、【ING】代码生成，支持自定义代码层级目录；

### TODO LIST
- 1、【ING】代码生成，支持自定义代码层级目录；
- 2、代码生成：支持交互层代码生成，包括ui及js；层级目录支持；
- 3、其他：快速开发框架；多技术栈；
- 4、登陆认证：切换 xxl-sso，提供登陆鉴权、以及单点登录能力。

## 五、其他

### 5.1 项目贡献
欢迎参与项目贡献！比如提交PR修复一个bug，或者新建 [Issue](https://github.com/xuxueli/xxl-boot/issues/) 讨论新特性或者变更。

### 5.2 用户接入登记
更多接入的公司，欢迎在 [登记地址](https://github.com/xuxueli/xxl-boot/issues/1 ) 登记，登记仅仅为了产品推广。

### 5.3 开源协议和版权
产品开源免费，并且将持续提供免费的社区技术支持。个人或企业内部可自由的接入和使用。

- Licensed under the GNU General Public License (GPL) v3.
- Copyright (c) 2015-present, xuxueli.

---
### 捐赠
无论金额多少都足够表达您这份心意，非常感谢 ：）      [前往捐赠](https://www.xuxueli.com/page/donate.html )
