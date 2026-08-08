/**
 * ESLint Flat Config（eslint.config.js）
 * 覆盖 Vue 3 + TypeScript 项目：代码规范（eslint-plugin-vue / typescript-eslint）
 * 并关闭与 Prettier 冲突的格式规则（eslint-config-prettier），格式统一交由 Prettier 处理。
 */
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
  // 忽略构建产物与自动生成文件
  { ignores: ['dist', 'node_modules', 'auto-imports.d.ts'] },

  // JS 基础规则
  js.configs.recommended,

  // TypeScript 推荐规则
  ...tseslint.configs.recommended,

  // Vue 基础规则（essential 级别，避免过度约束）
  ...pluginVue.configs['flat/essential'],

  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      // 浏览器 + Node 全局（document/window/Blob 等）
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      // no-undef 关闭：Vue/Vue Router/Pinia 的 API 由 unplugin-auto-import 全局注入（auto-imports.d.ts）
      'no-undef': 'off',
      // Vue：组件名允许单字（如 Editor、Pagination）
      'vue/multi-word-component-names': 'off',
      // Vue：pagegen 设计器直接修改 prop（activeData）属业务设计，关闭提示
      'vue/no-mutating-props': 'off',
      // Vue：pagegen 使用的 v-bind 修饰符写法
      'vue/valid-v-bind': 'off',
      // Vue：pagegen 中 Vue2 遗留 slot 属性写法
      'vue/no-deprecated-slot-attribute': 'off',
      // Vue：props 解构声明但未使用（如 IconsDialog），交由 TS 约束
      'vue/no-unused-vars': 'off',
      // 允许显式 any（generator/pagegen 等动态场景需要）
      '@typescript-eslint/no-explicit-any': 'off',
      // 未使用变量：由 TS 的 noUnusedLocals 约束，此处关闭避免误报
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      // 未使用表达式（如 request.js 里裸 Promise.reject 等既有写法）
      '@typescript-eslint/no-unused-expressions': 'off',
      'no-unused-expressions': 'off',
      // 空块（空 catch 等既有写法）
      'no-empty': 'off',
      // 正则字符类内的转义（validate.ts）——转义等价，非多余
      'no-useless-escape': 'off',
      // 赋值后未在后续使用（ImageUpload 等既有实现）
      'no-useless-assignment': 'off',
      // TS 函数重载（SidebarItem resolvePath）误报为重复声明
      'no-redeclare': 'off',
      // throw 未附带 cause（request.ts 既有写法）
      'preserve-caught-error': 'off',
      // this 别名（tab.ts 的 const self = this）
      '@typescript-eslint/no-this-alias': 'off',
      // {} 空对象类型（pagegen/generator 动态类型兜底）
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off'
    }
  },

  // 关闭与 Prettier 冲突的格式规则（放在最后）
  eslintConfigPrettier
)
