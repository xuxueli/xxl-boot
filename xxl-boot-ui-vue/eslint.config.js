/**
 * ESLint Flat Config（eslint.config.js）
 * 覆盖 Vue 3 + TypeScript 项目：代码规范（eslint-plugin-vue / typescript-eslint）
 * 并关闭与 Prettier 冲突的格式规则（eslint-config-prettier）。
 */
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
  // 忽略构建产物与自动生成文件
  {
    name: 'ignores',
    ignores: ['dist', 'node_modules', 'auto-imports.d.ts']
  },

  // JS 基础规则
  js.configs.recommended,

  // TypeScript 推荐规则
  ...tseslint.configs.recommended,

  // Vue 基础规则（essential 级别，避免过度约束）
  ...pluginVue.configs['flat/essential'],

  // 项目源码通用规则
  {
    name: 'project/source',
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      // 浏览器全局（document/window/Blob 等）；Vue/Router/Pinia API 由 no-undef 关闭兜底
      globals: { ...globals.browser },
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      // --- 全局/TS 规则调整 ---
      'no-undef': 'off', // 由 TS 类型检查覆盖 (确保 tsconfig 包含 auto-imports.d.ts)

      // 允许显式 any（动态场景/代码生成器需要）
      '@typescript-eslint/no-explicit-any': 'off',

      // 未使用变量/表达式：交由 TS 编译器 (noUnusedLocals/Parameters) 处理，避免 ESLint 误报
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'no-unused-expressions': 'off',

      // --- 既有代码/代码生成器兼容性 ---
      'no-empty': 'off', // 允许空 catch
      'no-useless-escape': 'off', // 兼容旧正则写法
      'no-useless-assignment': 'off', // 兼容既有赋值逻辑
      'no-redeclare': 'off', // 兼容 TS 函数重载误报
      'preserve-caught-error': 'off', // 兼容旧错误处理
      '@typescript-eslint/no-this-alias': 'off', // 兼容 this 别名写法
      '@typescript-eslint/ban-types': 'off', // 允许 {} 等类型
      '@typescript-eslint/no-empty-object-type': 'off',

      // --- Vue 特定规则 ---
      'vue/multi-word-component-names': 'off', // 允许单字组件名
      'vue/no-reserved-component-names': 'off', // 允许与 HTML 元素同名的组件（如 Data）
      'vue/no-mutating-props': 'off', // ⚠️ 业务特定：pagegen 设计器直接修改 prop
      'vue/valid-v-bind': 'off', // ⚠️ 业务特定：兼容 pagegen 生成的 v-bind 修饰符
      'vue/no-unused-vars': 'off', // 交由 TS 约束
    }
  },

  // 关闭与 Prettier 冲突的格式规则（放在最后）
  eslintConfigPrettier
)
