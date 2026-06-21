# xxl-boot-ui

xxl-boot 前端管理后台，基于 **Vue 3 (Composition API + `<script setup>`)**、**Element Plus 2**、**Pinia**、**Vite 8** 构建的企业级中后台解决方案。

---

## 技术栈

| 类别 | 技术 | 用途 |
|------|------|------|
| 核心框架 | Vue 3.5 + Composition API | UI 框架 |
| 构建工具 | Vite 8 | 开发服务器与打包 |
| UI 组件库 | Element Plus 2.13 | 组件库与图标 |
| 状态管理 | Pinia 3 | 响应式状态管理 |
| 路由 | vue-router 5 (HTML5 History) | 客户端路由 |
| HTTP 客户端 | Axios 1.16 | API 通信 |
| 图标 | @element-plus/icons-vue + 自定义 SVG 图标 | 图标系统 |
| CSS 预处理器 | SCSS (sass-embedded) | 样式表 |
| 工具库 | @vueuse/core 14 (dark mode, window size), js-cookie, fuse.js, clipboard, file-saver, jsencrypt, js-beautify, vuedraggable, vue-cropper | 通用工具 |
| 富文本 | @vueup/vue-quill (Quill 2) | WYSIWYG 编辑器 |
| 图表 | ECharts 5 | 数据可视化 |

---

## 完整项目结构

```
xxl-boot-ui/
├── index.html                          # HTML 入口（含加载动画）
├── package.json                        # 依赖与脚本
├── vite.config.js                      # Vite 构建配置
├── .env.development                    # 开发环境变量
├── .env.production                     # 生产环境变量
├── .env.staging                        # 测试环境变量
├── public/                             # 静态资源（favicon 等）
├── src/
│   ├── main.js                         # 应用入口（Vue 实例创建、插件安装、全局组件/指令注册）
│   ├── App.vue                         # 根组件（router-view + 主题初始化）
│   ├── settings.js                     # 系统设置默认值
│   │
│   ├── api/                            # API 服务模块
│   │   ├── login.js                    #   登录认证
│   │   ├── menu.js                     #   动态路由
│   │   ├── system/
│   │   │   ├── user.js                 #   用户管理 CRUD + 个人中心
│   │   │   ├── role.js                 #   角色管理 CRUD + 授权用户
│   │   │   ├── menu.js                 #   菜单管理 CRUD + 树形选择
│   │   │   └── dept.js                 #   部门管理 CRUD + 树形结构
│   │   ├── sys/
│   │   │   ├── config.js               #   参数配置
│   │   │   ├── dict/                   #   字典（类型 + 数据）
│   │   │   ├── notice.js               #   通知公告
│   │   │   └── operlog.js              #   操作日志
│   │   └── tool/
│   │       └── gen.js                  #   代码生成器
│   │
│   ├── assets/
│   │   ├── styles/                     # 全局 SCSS（变量、mixin、element-ui 覆盖、动画、侧边栏、按钮）
│   │   ├── icons/svg/                  # ~90 个自定义 SVG 图标
│   │   ├── images/                     # 头像、亮/暗模式图标
│   │   ├── logo/                       # 应用 Logo
│   │   ├── 404_images/                 # 404 页面图片
│   │   └── 401_images/                 # 401 页面图片
│   │
│   ├── components/                     # 全局通用组件
│   │   ├── SvgIcon/                    #   SVG 图标渲染组件
│   │   ├── IconSelect/                 #   图标选择器对话框
│   │   ├── Pagination/                 #   分页组件
│   │   ├── RightToolbar/               #   表格工具栏（搜索、刷新、列显隐）
│   │   ├── DictTag/                    #   字典值标签渲染
│   │   ├── Editor/                     #   富文本编辑器（Quill）
│   │   ├── FileUpload/                 #   文件上传
│   │   ├── ImageUpload/                #   图片上传
│   │   ├── ImagePreview/               #   图片预览
│   │   ├── ParentView/                 #   多级路由容器组件
│   │   ├── Breadcrumb/                 #   面包屑导航
│   │   ├── Hamburger/                  #   侧边栏展开/收起按钮
│   │   ├── Screenfull/                 #   全屏切换
│   │   ├── HeaderSearch/               #   头部菜单搜索（fuse.js）
│   │   ├── SizeSelect/                 #   字体大小选择器
│   │   ├── iFrame/                     #   内嵌页面容器
│   │   ├── TreePanel/                  #   树形面板
│   │   ├── ExcelImportDialog/          #   Excel 导入对话框
│   │   └── Boot/
│   │       ├── Doc/                    #   文档链接
│   │       └── Git/                    #   Git 链接
│   │
│   ├── layout/                         # 布局系统
│   │   ├── index.vue                   #   主布局（侧边栏 + 顶栏 + 标签页 + 内容区 + 设置面板）
│   │   └── components/
│   │       ├── Sidebar/                #   侧边栏（Logo、菜单树、深色/浅色主题）
│   │       ├── Navbar.vue              #   顶部导航栏（汉堡按钮、面包屑/菜单、右侧工具栏）
│   │       ├── TopNav/                 #   顶部导航模式
│   │       ├── TopBar/                 #   顶栏
│   │       ├── TagsView/               #   多标签页导航（卡片/Chrome 风格、右键菜单、全屏）
│   │       ├── AppMain.vue             #   主内容区（keep-alive 缓存 + 过渡动画）
│   │       ├── InnerLink/              #   外链页面（iframe）
│   │       ├── IframeToggle/           #   Iframe 标签管理
│   │       ├── HeaderNotice/           #   消息通知（铃铛、未读计数、已读标记）
│   │       ├── Settings/               #   布局设置抽屉
│   │       └── Copyright/              #   版权页脚
│   │
│   ├── views/                          # 页面视图
│   │   ├── login.vue                   #   登录页（验证码、记住密码 RSA 加密）
│   │   ├── index.vue                   #   首页/仪表盘
│   │   ├── redirect/index.vue          #   重定向桥接页
│   │   ├── error/
│   │   │   ├── 404.vue                 #   404 页面
│   │   │   └── 401.vue                 #   401 页面
│   │   ├── system/
│   │   │   ├── user/                   #   用户管理（列表、详情、角色分配、个人中心）
│   │   │   ├── role/                   #   角色管理（列表、分配用户、用户选择）
│   │   │   ├── menu/index.vue          #   菜单管理（树形表格）
│   │   │   └── dept/index.vue          #   部门管理（树）
│   │   ├── sys/
│   │   │   ├── dict/                   #   字典管理（类型、数据、详情）
│   │   │   ├── config/index.vue        #   参数配置
│   │   │   ├── notice/                 #   通知公告（列表 + 阅读用户）
│   │   │   └── operlog/                #   操作日志（列表 + 详情）
│   │   └── tool/
│   │       ├── gen/                    #   代码生成器（列表、编辑、创建、导入、配置表单）
│   │       └── build/                  #   表单构建器（拖拽设计、属性面板、代码预览）
│   │
│   ├── router/
│   │   ├── index.js                    #   路由定义（constantRoutes + dynamicRoutes）
│   │   └── guards.js                   #   全局导航守卫（鉴权、动态路由注入）
│   │
│   ├── store/                          # Pinia 状态管理
│   │   ├── index.js                    #   Pinia 实例
│   │   └── modules/
│   │       ├── app.js                  #   应用状态（侧边栏、设备、字体大小）
│   │       ├── user.js                 #   用户会话（Token、角色、权限、登录/登出）
│   │       ├── permission.js           #   路由权限（后端菜单转路由、侧边栏/顶栏路由）
│   │       ├── settings.js             #   系统配置（主题、布局、标签页、深色模式）
│   │       ├── tagsView.js             #   多标签管理（访问/缓存/iframe 视图）
│   │       └── dict.js                 #   字典缓存
│   │
│   ├── plugins/                        # 全局插件（注入到 app.config.globalProperties）
│   │   ├── index.js                    #   插件注册入口
│   │   ├── tab.js                      #   $tab - 标签页操作（打开/关闭/刷新/批量）
│   │   ├── auth.js                     #   $auth - 权限校验（hasPermi/hasRole 六种模式）
│   │   ├── cache.js                    #   $cache - 浏览器缓存（sessionStorage/localStorage）
│   │   ├── modal.js                    #   $modal - 弹窗交互（消息/确认/通知/加载）
│   │   └── download.js                 #   $download - 文件下载（按名称/资源/zip）
│   │
│   ├── directive/                      # 自定义指令
│   │   ├── index.js                    #   指令注册入口
│   │   └── permission/
│   │       ├── hasRole.js              #   v-hasRole - 角色级元素可见性
│   │       ├── hasPermi.js             #   v-hasPermi - 权限级元素可见性
│   │       └── common/
│   │           └── copyText.js         #   v-copyText - 一键复制
│   │
│   └── utils/                          # 工具模块
│       ├── request.js                  #   Axios 实例（拦截器、防重复提交、错误处理）
│       ├── auth.js                     #   认证令牌 Cookie 管理
│       ├── boot.js                     #   通用工具（日期、树形转换、参数序列化）
│       ├── index.js                    #   前端工具集合（日期/URL/字符串/数组/DOM/防抖）
│       ├── validate.js                 #   校验工具（路径匹配、邮箱、URL 等）
│       ├── permission.js               #   函数式权限校验
│       ├── dict.js                     #   useDict() 组合式函数
│       ├── theme.js                    #   主题引擎（CSS 变量生成、暗色模式、颜色计算）
│       ├── passwordRule.js             #   密码强度校验规则
│       ├── jsencrypt.js                #   RSA 加密工具
│       ├── scroll-to.js                #   平滑滚动动画
│       ├── errorCode.js                #   业务错误码映射
│       └── generator/                  #   表单构建器代码生成（config、html、js、css、render）
│
└── README.md
```

---

## 详细模块分析

### 一、布局系统 (layout)

#### `layout/index.vue` — 主框架布局
**用途**：管理后台骨架布局，协调侧边栏/顶栏/标签页/内容区/设置面板的排列与交互。
- 使用 `@vueuse/core` 的 `useWindowSize()` 监听窗口，宽度 < 992px 时自动切换移动端布局并收起侧边栏
- 通过 CSS 自定义属性（`--current-color`、`--current-color-light`、`--current-color-dark-bg`）将主题色注入根容器
- 提供 `handleClickOutside()` 移动端点击遮罩关闭侧边栏

#### `layout/components/Navbar.vue` — 顶部导航栏
**用途**：渲染顶栏，包含汉堡菜单按钮、面包屑/顶部菜单、右侧工具栏。
- 支持三种导航模式（navType 1/2/3）：纯左侧面包屑、混合顶部菜单、纯顶部菜单
- `toggleTheme(event)` 使用 View Transition API 实现圆形裁剪路径的亮/暗切换动画
- `handleCommand(command)` 处理下拉菜单中的布局设置和退出登录

#### `layout/components/AppMain.vue` — 主内容区
**用途**：配置 `<router-view>` 和 `<keep-alive>`，通过 tagsView store 的 `cachedViews` 动态控制组件缓存。
- 使用 `<transition name="fade-transform">` 实现页面过渡动画
- 路由 `meta.link` 时跳过 keep-alive 缓存，通过 iframe 展示
- CSS 高度自适应固定头部和标签页的偏移

#### `layout/components/Sidebar/index.vue` — 侧边栏
**用途**：左侧垂直导航菜单，根据 permission store 的 `sidebarRouters` 动态生成菜单树。
- 支持深色/浅色主题，通过 CSS `v-bind` 动态绑定背景色和文字色
- `activeMenu` 通过当前路由路径计算高亮项，支持 `meta.activeMenu` 自定义高亮
- 使用 `el-menu` 的 `unique-opened` 确保同一时间只有一个子菜单展开

#### `layout/components/TagsView/index.vue` — 多标签导航
**用途**：浏览器标签页风格的多页签导航，支持标签新增/关闭/刷新/右键菜单/全屏模式。
- 两种标签样式：`card`（卡片风格）和 `chrome`（Chrome 风格，带圆形翼角）
- `initTags()` 启动时恢复持久化标签并注入 affix 固定标签
- `toggleFullscreen()` 全屏模式隐藏侧边栏和导航栏
- 右键上下文菜单 + 下拉菜单提供完整标签操作能力

#### `layout/components/Settings/index.vue` — 布局设置面板
**用途**：侧边抽屉式设置面板，实时切换导航模式/侧边栏主题/主题色/标签页配置等。
- 导航模式使用三种预设 CSS 图标展示（left/mix/top）
- 主题色使用 `el-color-picker`，预定义 8 种常用色
- 通过 `defineExpose` 暴露 `openSetting()` 给父组件调用

#### `layout/components/HeaderNotice/index.vue` — 消息通知
**用途**：导航栏铃铛图标，展示通知公告下拉列表，支持未读计数和标记已读。
- 使用 `el-popover` 的 `manual` 模式，由鼠标事件完全控制显示
- 鼠标进出包含 100-150ms 防抖延迟，实现面板与触发器之间的无缝过渡
- 已读公告降低不透明度并灰度化显示

#### `layout/components/TopNav/index.vue` — 顶部菜单导航
**用途**：混合导航模式（navType=2）下的顶部水平菜单栏。
- 通过 `visibleNumber` 计算可见菜单数，超出部分放入"更多菜单"
- `handleSelect()` 支持 HTTP 外链新窗口打开、内部路由跳转、联动侧边栏
- 选中顶栏菜单时动态更新 sidebarRouters

---

### 二、状态管理 (Pinia Store)

#### `store/modules/app.js` — 应用状态
- **状态**：`sidebar`（展开/折叠/隐藏）、`device`（桌面端/移动端）、`size`（字体大小）
- **持久化**：侧边栏和字体大小通过 Cookie 持久化
- **Actions**：`toggleSideBar`、`closeSideBar`、`openSideBar`、`hideSideBar`、`toggleDevice`、`setSize`

#### `store/modules/user.js` — 用户会话
- **状态**：`token`（Cookie 恢复）、`id`/`name`/`nickName`/`avatar`、`roles`/`permissions`
- **Actions**：
  - `login(userInfo)` — API 登录 -> token 写入 Cookie 和 store
  - `getInfo()` — 拉取用户信息，规范化头像地址，保存密码字符类型到 sessionStorage，弹出初始密码/过期密码提示
  - `logOut()` — 调用登出 API，清空所有会话数据

#### `store/modules/permission.js` — 路由权限
- **状态**：`routes`（完整路由）、`addRoutes`（动态追加路由）、`defaultRoutes`/`topbarRouters`/`sidebarRouters`
- **核心 Action** `generateRoutes(roles)`：
  1. 请求后端 `getRouters()` 获取菜单树
  2. 深拷贝三份数据，分别生成侧边栏路由、拍平路由、默认路由
  3. 过滤动态路由并注册到 router 实例
- **`filterAsyncRouter()`** — 将后端菜单字符串组件名（Layout/ParentView/InnerLink/视图路径）转换为真实组件
- **`loadView(view)`** — 使用 `import.meta.glob('./../../views/**/*.vue')` 按路径字符串匹配异步组件

#### `store/modules/settings.js` — 系统设置
- **状态**：`isDark`（@vueuse/core useDark）、`navType`/`sideTheme`/`theme`、`tagsView`/`tagsViewPersist`/`tagsIcon`/`tagsViewStyle`、`fixedHeader`/`sidebarLogo`/`dynamicTitle`、`footerVisible`/`footerContent`
- **Actions**：`initSetting()`、`saveSetting()`、`resetSetting()`、`toggleTheme()`、`setTheme()`、`setNavType()` 等
- **持久化**：通过 localStorage 存储 `layout-setting` 键

#### `store/modules/tagsView.js` — 多标签管理
- **三种状态数组**：
  - `visitedViews` — 可导航标签（含 affix 固定标签）
  - `cachedViews` — keep-alive 组件名列表
  - `iframeViews` — iframe 外链标签
- **Actions**：完整的标签操作（增删改查、批量关闭左侧/右侧/其他/全部、持久化加载/保存/清除）
- **标签持久化**：通过 `tagsViewPersist` 控制，过滤 affix 标签后序列化到 localStorage

#### `store/modules/dict.js` — 字典缓存
- **状态**：`dict` 数组 `[{key, value}]`
- **Actions**：`getDict`、`setDict`、`removeDict`、`cleanDict`、`initDict`
- **用途**：前端运行时内存级字典缓存，避免重复请求后端

---

### 三、全局插件 (plugins)

#### `plugins/tab.js` — $tab 标签操作
- `refreshPage(obj)` — 强制重新挂载：先删除 cachedView，通过 `/redirect` 中间路由重定向回原路径
- `closePage(obj)` / `closeAllPage()` / `closeLeftPage(obj)` / `closeRightPage(obj)` / `closeOtherPage(obj)`
- `openPage(title, url, params)` — 打开新标签并跳转
- `updatePage(obj)` — 更新标签显示信息

#### `plugins/auth.js` — $auth 权限校验
- 三种权限模式：`hasPermi`（单一）、`hasPermiOr`（任一）、`hasPermiAnd`（全部）
- 三种角色模式：`hasRole`（单一）、`hasRoleOr`（任一）、`hasRoleAnd`（全部）
- 超级管理员 `*:*:*` 通配，admin 角色自动放行

#### `plugins/cache.js` — $cache 缓存封装
- `sessionCache`：`set/get/setJSON/getJSON/remove`
- `localCache`：`set/get/setJSON/getJSON/remove`
- 存储不可用时静默降级

#### `plugins/modal.js` — $modal 弹窗交互
- 消息：`msg`/`msgError`/`msgSuccess`/`msgWarning`
- 提示框：`alert`/`alertError`/`alertSuccess`/`alertWarning`
- 通知：`notify`/`notifyError`/`notifySuccess`/`notifyWarning`
- 确认框：`confirm`（Promise）、输入框：`prompt`（Promise）
- 加载遮罩：`loading(content)` / `closeLoading()`（单例共享）

#### `plugins/download.js` — $download 文件下载
- `name(name)` — 按文件名下载服务端文件（`/common/download`）
- `resource(resource)` — 按资源路径下载（`/common/download/resource`）
- `zip(url, name)` — 下载 ZIP 压缩包（全屏 Loading）
- `saveAs(text, name, opts)` — 调用 file-saver 的 `saveAs`
- 错误处理：解析 Blob 类型错误响应并展示友好提示

---

### 四、自定义指令

#### `v-hasPermi` — 权限级可见性
- 在 `mounted` 阶段检查用户权限列表，未命中时 `el.parentNode.removeChild(el)` 移除 DOM
- 超级管理员 `*:*:*` 自动通过

#### `v-hasRole` — 角色级可见性
- 逻辑与 hasPermi 一致，超级管理员 `admin` 自动通过

#### `v-copyText` — 一键复制
- `beforeMount` 绑定事件，`unmounted` 解绑
- 通过创建隐藏 `<textarea>`、`document.execCommand('copy')`、恢复原选区实现
- 支持回调模式（`:callback` 参数）

---

### 五、路由系统

#### `router/index.js` — 路由定义
- **constantRoutes**（应用启动即注册，无权限门槛）：
  - `/redirect/:path(.*)`、`/login`、`/` + `/index`（首页，affix 固定标签）、`/user/profile/:activeTab?`、`/:pathMatch(.*)*`（404）、`/401`
- **dynamicRoutes**（权限标记，登录后动态注入）：
  - `/system/user-auth/role/:userId`、`/system/role-auth/user/:roleId`、`/sys/dict-data/index/:dictId`、`/tool/gen-edit/index/:tableId`
- **Router 配置**：`createWebHistory()` HTML5 History + 滚动行为恢复

#### `router/guards.js` — 全局导航守卫
**执行流程**：
1. 所有跳转启动 NProgress
2. **已登录**：访问登录页 -> 重定向首页；首次进入（roles 为空）-> 拉取用户信息 -> 生成动态路由 -> replace 重入；非首次 -> 放行
3. **未登录**：白名单 -> 放行；受控页 -> 重定向 `/login?redirect=xxx`
- `isRelogin.show` 标志防止同时触发多个登录请求
- 外链路由（isHttp）不注入 vue-router
- 初始化失败时调用 `userStore.logOut()` 清除会话

---

### 六、工具模块 (utils)

#### `utils/request.js` — HTTP 请求封装
- **请求拦截器**：自动注入 Bearer Token、GET 参数序列化、POST/PUT 防重复提交（基于 sessionStorage 快照）
- **响应拦截器**：二进制流透传、401 弹重新登录（防重复）、500 Error、601 Warning、其他异常 Notification
- **导出**：`download(url, params, filename, config)` — POST 文件下载方法

#### `utils/auth.js` — 认证令牌
- `getToken()` / `setToken(token)` / `removeToken()` — 基于 Cookie 的 Token 管理（key: `Admin-Token`）

#### `utils/boot.js` — 通用工具
- `parseTime(time, pattern)` — 日期格式化
- `handleTree(data, id, parentId, children)` — 扁平数组转树形（两次遍历算法）
- `selectDictLabel(datas, value)` / `selectDictLabels` — 字典值回显
- `blobValidate(data)` — 校验响应是否为合法文件 Blob
- `tansParams(params)` — 参数序列化为 URL 查询字符串
- `addDateRange(params, dateRange, propName)` — 日期范围拆分到查询参数

#### `utils/theme.js` — 主题引擎
- `handleThemeStyle(theme)` — 设置 Element Plus CSS 变量（`--el-color-primary` + light/dark 各 9 级色阶）
- `softenPrimaryForDark(theme)` — 暗色模式柔化（与深色背景按 34% 混合）
- `getLightColor(color, level)` / `getDarkColor(color, level)` — 颜色变体计算

#### `utils/dict.js` — useDict() 组合式函数
- `useDict(...args)` — 接收字典类型名称，优先从 Pinia 缓存读取，未命中调用后端 API，返回保持响应性的 Ref 对象

#### `utils/passwordRule.js` — 密码强度规则
- 支持 5 种字符类型（0: 任意、1: 纯数字、2: 纯字母、3: 字母+数字、4: 字母+数字+特殊字符）
- `usePasswordRule()` 返回 computed 校验规则

#### `utils/validate.js` — 校验工具
- `isPathMatch(pattern, path)` — glob 风格路径模式匹配（支持 `*`/`**`/`?`）
- `isHttp(url)` / `isExternal(path)` — URL 协议检测
- `validUsername` / `validURL` / `validEmail` 等格式校验

---

### 七、全局通用组件 (components)

#### `Pagination` — 分页
- 封装 Element Plus 分页，双向绑定 `page`/`limit`，变化时触发 `pagination` 事件
- 支持 `autoScroll`、移动端自适应 `pagerCount`（5/7）

#### `DictTag` — 字典标签
- 根据字典配置渲染值对应的 `el-tag`，支持多值（逗号分隔或数组）
- 未匹配值自动回显原始值

#### `Editor` — 富文本编辑器
- 基于 `@vueup/vue-quill`（Quill.js），支持图片上传和粘贴上传
- 图片格式/大小校验，上传后通过 Quill API 插入光标位置

#### `RightToolbar` — 表格工具栏
- 搜索展开/收起动画、刷新、列显隐控制（穿梭框/复选框两种模式）
- 列显隐状态通过 `storageKey` 持久化到 localStorage

#### `HeaderSearch` — 菜单搜索
- 基于 Fuse.js 模糊搜索（标题权重 0.7、路径权重 0.3）
- 键盘上下导航、Enter 选中、Esc 关闭、关键词高亮
- HTTP 外链新窗口，内部路由 router.push

#### `SvgIcon` — SVG 图标
- 通过 `<use xlink:href="#icon-{iconClass}">` 引用 SVG sprite
- 默认样式 `width: 1em; height: 1em; fill: currentColor`

---

### 八、页面视图 (views)

#### `login.vue` — 登录页
- 验证码登录（后端控制开关）、记住密码（Cookie 加密存储）
- `handleLogin()` 流程：表单验证 -> 记住密码持久化 -> 调用 login API -> 处理 redirect 参数跳转

#### `index.vue` — 首页仪表盘
- 展示项目介绍、版本信息（3.9.2）、技术选型、更新日志

#### `views/system/` — 系统管理
- **用户管理**：CRUD、状态切换、密码重置、角色分配、个人中心（头像/信息/密码）
- **角色管理**：CRUD、数据权限配置、用户分配选择
- **菜单管理**：树形表格 CRUD、排序、角色菜单选择
- **部门管理**：树 CRUD、排序、排除节点

#### `views/sys/` — 系统配置
- **字典管理**：类型 + 数据 CRUD、缓存刷新
- **参数配置**：键值对 CRUD、缓存刷新
- **通知公告**：CRUD、已读标记、阅读用户追踪
- **操作日志**：查询、详情查看、删除、清空

#### `views/tool/` — 开发者工具
- **代码生成器**：数据库表导入/创建/编辑、生成配置预览、压缩包下载、同步数据库
- **表单构建器**：拖拽式表单设计（vuedraggable）、字段属性面板、代码预览/美化

---

### 九、API 模块 (api)

| 文件 | 主要接口 |
|------|----------|
| `api/login.js` | `login`、`getInfo`、`logout`、`getCodeImg` |
| `api/menu.js` | `getRouters`（动态路由） |
| `api/system/user.js` | 用户 CRUD、`resetUserPwd`、`changeUserStatus`、`getUserProfile`/`updateUserProfile`/`updateUserPwd`/`uploadAvatar`、`getAuthRole`/`updateAuthRole`、`deptTreeSelect` |
| `api/system/role.js` | 角色 CRUD、`dataScope`、`changeRoleStatus`、`allocatedUserList`/`unallocatedUserList`/`authUserCancel`/`authUserSelectAll` |
| `api/system/menu.js` | 菜单 CRUD、`treeselect`/`roleMenuTreeselect`、`updateMenuSort` |
| `api/system/dept.js` | 部门 CRUD、`listDeptExcludeChild`、`updateDeptSort` |

---

## 架构数据流

```
后端 API -> Axios 请求拦截器（Token/防重复） -> API 函数 -> Pinia Store Actions -> Vue 组件
```

## 权限体系（四层防护）

| 层级 | 机制 | 粒度 |
|------|------|------|
| 路由层 | 全局守卫 + 动态路由 | 页面级 |
| 路由注册层 | permission Store 过滤 dynamicRoutes | 页面级 |
| 指令层 | v-hasPermi / v-hasRole | 按钮/元素级 |
| 函数层 | $auth 插件 / checkPermi / checkRole | 函数级 |

## 布局系统

三种导航模式：
- **navType=1 (左侧)** — 纯左侧菜单，内容区在右侧
- **navType=2 (混合)** — 顶部一级菜单 + 左侧二级菜单联动
- **navType=3 (顶部)** — 纯顶部菜单，隐藏侧边栏

---

## 本地开发

```bash
npm install
npm run dev
```

开发服务器默认运行在 `http://localhost:3000`，API 代理至 `http://localhost:8081`。

## 构建部署

```bash
npm run build:stage   # 测试环境
npm run build:prod    # 生产环境
```

## 环境变量

| 文件 | 用途 |
|------|------|
| `.env.development` | 开发环境（API 代理到 localhost:8081） |
| `.env.production` | 生产环境 |
| `.env.staging` | 测试环境 |

## 熟悉步骤

     1. 项目入口 — 先读 src/main.js（应用启动过程）和 src/App.vue（根组件），了解整体框架拼装                                                               
     2. 路由 — 读 src/router/index.js 看页面有哪些、src/router/guards.js 看页面跳转流程（登录拦截等）                                                       
     3. 登录流程 — 读 src/views/login.vue + src/api/login.js + src/store/modules/user.js，串联"点击登录 → API                                               
        请求 → 存 Token → 跳转首页"的完整链路                                                                                                               
     4. 布局 — 读 src/layout/index.vue 和 src/layout/components/Sidebar/、TagsView/，理解页面框架                                                           
     5. 一个完整 CRUD 页面 — 以 src/views/system/user/index.vue 为例，看列表/搜索/新增/编辑如何组织，配合 src/                                              
        api/system/user.js 和 Element Plus 组件                                                                                                             
     6. 权限 — 最后看 store/modules/permission.js + directive/，理解后端菜单驱动路由和按钮级权限                                                            
                                                                                                                                                            
     核心建议：先不要纠结 Sass/构建配置等细节，先理解数据流（API → Store → 组件），能跑通一个页面流程后，                                                   
     再逐个模块深入。  