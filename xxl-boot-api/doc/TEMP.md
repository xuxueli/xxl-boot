

项目目录：
```
    /doc
    /xxl-boot-admin             : 单体项目
    /xxl-boot-api               : 后端API服务
    /xxl-boot-ui-vue            : 前端UI项目（vue3 + element）
        /src
        .App.vue                        ：根组件：整个应用的顶层容器组件
        .main.js                        ：应用入口：创建 Vue 实例，注册全局组件、插件、指令，初始化应用
        .permission.js                  ：路由权限控制：路由拦截器，验证用户登录状态和访问权限
        .settings.js                    ：全局配置：定义系统默认配置项（主题色、布局模式、是否显示标签页等）
            /api/                               ：接口请求层：统一管理所有后端 API 接口调用，按业务模块分类（system、monitor、tool），封装 axios 请求方法
            /assets/                            ：静态资源：存放图片、样式文件、SVG 图标、Logo 等静态资源文件
            /components/                        ：公共组件：可复用的业务组件（如分页、上传、富文本编辑器等），在 main.js 中全局注册
            /directive/                         ：自定义指令：Vue 自定义指令，如权限判断指令 v-hasPermi、复制文本指令 v-copyText
            /layout/                            ：布局组件：系统整体布局框架，包含侧边栏、顶栏、主内容区、标签页等布局结构
            /plugins/                           ：插件封装：对常用功能进行封装并挂载到 Vue 实例，如消息提示 $modal、标签页操作 $tab、权限判断等
            /router/                            ：路由配置：Vue Router 路由配置文件，管理页面跳转、动态路由加载、路由守卫等
            /store/                             ：状态管理：使用 Pinia 进行全局状态管理，包含用户信息、权限路由、系统设置、标签页等模块
            /utils/                             ：工具函数库：通用工具方法集合，如时间格式化、请求封装、权限判断、字典处理、表单验证等
            /views/                             ：页面视图：路由对应的页面组件，按业务模块组织（system、monitor、tool 等），每个页面对应一个路由
```

FontEnd（单体）：
```
    首页：核心模块 + 系统介绍 + 报表；
    组织管理：org
        用户管理：略
        角色管理：略
        资源管理：略
        部门管理：维护部门组织信息，树形结构；与用户关联；// TODO，改为 dept；
    系统管理：system
        字典管理：// TODO-dict，维护字段信息（字典key表/id-type&name + 数据列表/code-value&lable）
        参数管理：// TODO-config，维护系统参数信息（参数表/key-value）（默认皮肤样式key、验证码开关）
        通知公告：略
        审计日志：略
    系统工具：tool
        代码生成：略
        表单设计：// TODO-formbuild，Form表单在线设计生成代码；
    帮助中心：help
```

FontEnd（前后端分离）：
```
    首页：同单体
    组织管理：
        用户管理：同单体
        角色管理：同单体
        资源管理：同单体
        部门管理：同单体
    系统管理：
        字典管理：// TODO-dict，维护字段信息（字典key表/id-type&name + 数据列表/code-value&lable）
        参数管理：// TODO-config，维护系统参数信息（参数表/key-value）（默认皮肤样式key、验证码开关）
        通知公告：略
        审计日志：略
    系统工具：
        代码生成：略
        表单设计：// TODO-formbuild，Form表单在线设计生成代码；
    帮助中心：
```

前端Module：
```
    /src    
        /api                    // --
        /assets                 // --     
        /components             // TODO 2
        /directive              // --
        /layout                 // TODO 1
        /plugins                // -- 
        /router                 // --
        /store                  // --
        /utils                  // --
        /views                  // TODO 3
        App.vue                 :--
        main.js                 :--
        settings.js             :--
    env.development             :--
    index.html                  :--
    package.json                :--
    vite.config.js              :--
```

---

## 前端项目结构依赖图（boot-ui3）

### 一、分层依赖总览

```
┌─────────────────────────────────────────────────────────────────────┐
│                        【配置层 / Config】                           │
│                                                                     │
│   .env.development  ┐                                               │
│   .env.staging      ├──→  vite.config.js（loadEnv 读取）            │
│   .env.production   ┘     package.json（npm 依赖 & scripts）         │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │ 构建 / 启动
┌──────────────────────────────────▼──────────────────────────────────┐
│                       【入口层 / Entry】                             │
│                                                                     │
│   index.html  ──→  src/main.js  ←──  src/settings.js               │
│                        └── src/App.vue（→ store/modules/settings）  │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │ 注册 / 挂载
┌──────────────────────────────────▼──────────────────────────────────┐
│                      【核心框架层 / Framework】                       │
│                                                                     │
│   src/router/          src/store/          src/plugins/             │
│   ├── index.js         ├── index.js        ├── index.js             │
│   └── guards.js        └── modules/        ├── modal.js             │
│       (→ store/user        ├── app.js      ├── tab.js               │
│          store/settings    ├── dict.js     ├── auth.js              │
│          store/permission  ├── user.js     ├── cache.js             │
│          utils/auth        ├── permission  └── download.js          │
│          utils/validate    ├── settings                             │
│          utils/request     └── tagsView                             │
│          element-plus)                                              │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │ 依赖
┌──────────────────────────────────▼──────────────────────────────────┐
│                      【基础能力层 / Utilities】                       │
│                                                                     │
│   src/utils/                        src/directive/                  │
│   ├── request.js  (axios封装)        ├── index.js                   │
│   ├── auth.js     (token/cookie)     ├── permission/                │
│   ├── boot.js     (通用工具方法)     │   ├── hasPermi.js            │
│   ├── dict.js     (字典懒加载)       │   └── hasRole.js             │
│   ├── errorCode.js(错误码映射)       └── common/                   │
│   ├── theme.js    (主题切换)             └── copyText.js            │
│   └── validate.js (表单校验)                                        │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │ 调用
┌──────────────────────────────────▼──────────────────────────────────┐
│                        【接口层 / API】                               │
│                                                                     │
│   src/api/                                                          │
│   ├── login.js                                                      │
│   ├── menu.js                                                       │
│   └── sys/  system/  tool/  (按业务模块分类的接口方法)               │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │ 数据驱动
┌──────────────────────────────────▼──────────────────────────────────┐
│                      【UI 展示层 / View】                             │
│                                                                     │
│   src/layout/          src/views/              src/components/      │
│   └── index.vue        ├── login.vue           ├── Pagination       │
│       (→ store/app         ├── redirect/       ├── DictTag          │
│          store/settings    ├── error/          ├── RightToolbar     │
│          @vueuse/core)     ├── sys/            ├── Editor           │
│                            ├── system/         ├── FileUpload       │
│                            └── tool/           ├── ImageUpload      │
│                                                ├── ImagePreview     │
│                                                ├── ParentView       │
│                                                └── SvgIcon          │
└─────────────────────────────────────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼──────────────────────────────────┐
│                      【静态资源层 / Assets】                          │
│                                                                     │
│   src/assets/                                                       │
│   ├── icons/svg/       (SVG 图标)                                   │
│   └── styles/          (全局样式 SCSS)                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 二、各层依赖关系说明

#### 1. 配置层
| 文件 | 作用 | 说明 |
|------|------|------|
| `.env.development` | 开发环境变量（VITE_APP_ENV / VITE_APP_PORT / VITE_API_URL / VITE_APP_BASE_API） | 由 `vite.config.js` 通过 `loadEnv` 读取 |
| `.env.staging` | 预发布环境变量（同上） | 由 `vite.config.js` 通过 `loadEnv` 读取 |
| `.env.production` | 生产环境变量（同上） | 由 `vite.config.js` 通过 `loadEnv` 读取 |
| `vite.config.js` | 构建工具配置（插件、dev server 代理、路径别名、构建输出） | 读取 `.env.*`；Vite 启动时自动加载 |
| `package.json` | 依赖声明（vue / pinia / axios / element-plus 等）及 scripts（dev / build:prod / build:stage） | npm 安装依赖，Vite 构建时解析 |

> `.env.*` 与 `package.json` 均为 `vite.config.js` 的**同级输入**，并非下游关系。

#### 2. 入口层
| 文件 | 作用 | 依赖 |
|------|------|------|
| `index.html` | HTML 模板，提供挂载点 `<div id="app">` | 引用 `src/main.js` |
| `src/main.js` | Vue 应用入口，注册全局插件、指令、组件、全局方法后挂载 | router、store、plugins、directive、ElementPlus、components、utils、api |
| `src/App.vue` | 根组件，渲染 `<router-view />`，onMounted 时初始化主题 | store/modules/settings |
| `src/settings.js` | 全局 UI 默认配置（主题色、布局模式、标签页等） | 被 `store/modules/settings.js` 读取为初始值 |

#### 3. 核心框架层
| 模块 | 文件 | 实际依赖 |
|------|------|----------|
| 路由 | `src/router/index.js` | vue-router、layout/ |
| 路由守卫 | `src/router/guards.js` | store/modules/user、store/modules/settings、store/modules/permission、utils/auth（getToken）、utils/validate（isHttp / isPathMatch）、utils/request（isRelogin）、element-plus（ElMessage）、nprogress |
| 状态管理 | `src/store/modules/user.js` | api/login（login / logout / getInfo）、utils/auth（token 存取）、utils/validate（isHttp / isEmpty）、plugins/cache（session）、element-plus（ElMessageBox）、router |
| 状态管理 | `src/store/modules/permission.js` | api/menu（getRouters）、plugins/auth（hasPermiOr / hasRoleOr）、router、layout/index、components/ParentView、layout/components/InnerLink |
| 状态管理 | `src/store/modules/settings.js` | src/settings.js（默认值）、@vueuse/core（useDark / useToggle）、utils/theme（handleThemeStyle） |
| 状态管理 | `src/store/modules/dict.js` | —（纯内存状态，无外部依赖） |
| 状态管理 | `src/store/modules/tagsView.js` | —（纯内存状态） |
| 状态管理 | `src/store/modules/app.js` | js-cookie（侧边栏状态 / 字体大小持久化） |
| 插件 | `src/plugins/modal.js` | element-plus（ElMessage / ElMessageBox / ElNotification / ElLoading） |
| 插件 | `src/plugins/tab.js` | vue-router、store/modules/tagsView |
| 插件 | `src/plugins/auth.js` | store/modules/user（permissions / roles） |
| 插件 | `src/plugins/cache.js` | js-cookie（cookie）、localStorage / sessionStorage（web storage） |
| 插件 | `src/plugins/download.js` | axios（独立实例，非 utils/request）、element-plus（ElLoading / ElMessage）、file-saver（saveAs）、utils/auth（getToken）、utils/errorCode、utils/boot（blobValidate） |

#### 4. 基础能力层
| 文件 | 作用 | 实际依赖 |
|------|------|----------|
| `src/utils/request.js` | axios 封装，统一请求/响应拦截，token 注入，防重复提交 | axios、element-plus（ElNotification / ElMessageBox / ElMessage / ElLoading）、utils/auth（getToken）、utils/errorCode、utils/boot（tansParams / blobValidate）、plugins/cache（session 防重复提交）、store/modules/user（401 自动登出）、file-saver |
| `src/utils/auth.js` | token 读写删（Cookie `Admin-Token`） | js-cookie |
| `src/utils/boot.js` | 通用工具（时间格式化、树形处理、表单重置、参数序列化等） | —（纯函数） |
| `src/utils/dict.js` | 字典数据懒加载与内存缓存 | store/modules/dict、api/sys/dict/data（getDicts） |
| `src/utils/errorCode.js` | HTTP/业务错误码文案映射 | —（纯常量） |
| `src/utils/theme.js` | 主题色动态写入 CSS 变量（element-plus 色阶计算） | —（纯函数，操作 document） |
| `src/utils/validate.js` | 表单校验规则集合 | —（纯函数） |
| `src/directive/index.js` | 注册所有自定义指令 | directive/permission/hasPermi、directive/permission/hasRole、directive/common/copyText |
| `src/directive/permission/hasPermi.js` | v-hasPermi 操作权限指令（无权限则移除 DOM） | store/modules/user（permissions） |
| `src/directive/permission/hasRole.js` | v-hasRole 角色权限指令（无权限则移除 DOM） | store/modules/user（roles） |
| `src/directive/common/copyText.js` | v-copyText 点击复制文本指令 | —（纯 DOM 操作） |

#### 5. 接口层
| 目录/文件 | 作用 | 依赖 |
|-----------|------|------|
| `src/api/login.js` | 登录、登出、获取用户信息接口 | utils/request |
| `src/api/menu.js` | 动态权限路由（菜单）接口 | utils/request |
| `src/api/sys/` | 系统模块接口（字典 `dict/data`、参数、日志等） | utils/request |
| `src/api/system/` | 组织模块接口（用户、角色、部门、资源等） | utils/request |
| `src/api/tool/` | 工具模块接口（代码生成等） | utils/request |

#### 6. UI 展示层
| 模块 | 实际依赖 |
|------|----------|
| `src/layout/index.vue` | store/modules/app、store/modules/settings、@vueuse/core（useWindowSize）；子组件 Sidebar / AppMain / Navbar / Settings / TagsView |
| `src/views/` | src/api/（各业务接口）、store/（状态读写）、utils/（工具方法）、components/（公共组件） |
| `src/components/` | element-plus、utils/（按需引用） |

---

### 三、应用启动链路（Boot Flow）

```
【配置阶段】
Vite 读取 package.json（安装依赖），再读取 .env.{mode} 获取环境变量
    │
    ▼
vite.config.js 通过 loadEnv 拿到 VITE_API_URL / VITE_APP_BASE_API / VITE_APP_PORT，
配置插件（vue、autoImport、setupExtend、svgIcons、compression）
及 dev server 代理（/api → 后端、/v3/api-docs → 后端）

【启动阶段】
    │
    ▼
index.html 加载，提供挂载点 <div id="app">，引入 src/main.js
    │
    ▼
src/main.js 执行（9 步注册）：
    ├── 1. createApp(App)               创建 Vue 应用实例
    ├── 2. app.use(router)              安装路由；副作用导入 guards.js，全局路由守卫激活
    ├── 3. app.use(store)               安装 Pinia 状态管理（各 Store 懒加载）
    ├── 4. app.use(plugins)             挂载全局插件（$modal / $tab / $auth / $cache / $download）
    ├── 5. app.use(ElementPlus)         安装 UI 组件库（zh-cn 语言包 + Cookie 读取字体大小）
    ├── 6. app.use(elementIcons)        注册 Element Plus 图标组件
    ├── 7. directive(app)               注册自定义指令（v-hasPermi / v-hasRole / v-copyText）
    ├── 8. app.component(...)           注册全局业务组件（Pagination / DictTag / Editor 等）
    ├── 9. app.config.globalProperties  挂载全局方法（useDict / download / parseTime 等）
    └── app.mount('#app')               挂载到 DOM

【运行阶段】
    │
    ▼
src/App.vue 渲染，onMounted 调用 store/modules/settings.initSetting()
→ utils/theme.handleThemeStyle() 写入 element-plus 主题 CSS 变量
    │
    ▼
router/guards.js 拦截每次路由跳转：
    ├── 无 token → 重定向 /login?redirect=xxx
    ├── 有 token + 访问 /login → 重定向首页 /
    ├── 有 token + roles 为空（首次进入）：
    │       └── 调用 store/modules/user.getInfo() 拉取用户信息
    │           → store/modules/permission.generateRoutes()
    │             → api/menu.getRouters() 获取后端动态路由
    │             → 转换组件（Layout / ParentView / InnerLink / views/*.vue）
    │             → router.addRoute() 动态注入路由
    │             → 重新 replace 到目标路由（确保动态路由已注册）
    └── 权限通过 → next()，NProgress 进度条完成
    │
    ▼
src/layout/index.vue 承载整体页面布局：
    侧边栏（Sidebar）+ 顶栏（Navbar）+ 标签页（TagsView）+ 主内容区（AppMain）
    │
    ▼
views/ 业务页面渲染：
    组件调用 src/api/ → utils/request.js（axios 实例）
    → 请求拦截：注入 Authorization Token（utils/auth.getToken）+ 防重复提交（plugins/cache.session）
    → 响应拦截：统一处理 401（自动登出）/ 500 / 200
    → 后端 API 服务
```

