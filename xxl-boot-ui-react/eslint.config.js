/**
 * ESLint Flat Config（eslint.config.js）
 * 覆盖 React + TypeScript 项目：代码规范（eslint-plugin-react-hooks / typescript-eslint）
 * 并关闭与 Prettier 冲突的格式规则（eslint-config-prettier）。
 */
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
  // 忽略构建产物与自动生成文件
  {
    name: 'ignores',
    ignores: ['dist', 'node_modules']
  },

  // JS 基础规则
  js.configs.recommended,

  // TypeScript 推荐规则
  ...tseslint.configs.recommended,

  // 项目源码通用规则
  {
    name: 'project/source',
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // --- React Hooks 规则放宽（避免过度约束） ---
      'react-hooks/exhaustive-deps': 'off', // 依赖数组交由人工维护（对齐 Vue 版 watch 手动管理习惯）
      'react-hooks/set-state-in-effect': 'off', // 允许在 effect 中同步 setState（路由参数同步等场景）
      'react-hooks/preserve-caught-error': 'off', // 兼容旧错误处理
      'react-hooks/immutability': 'off', // ⚠️ 业务特定：RightToolbar 列显隐直接修改 props 列配置（对齐 Vue no-mutating-props 关闭）
      'preserve-caught-error': 'off', // 兼容旧错误处理
      // --- 全局/TS 规则调整 ---
      'no-undef': 'off', // 由 TS 类型检查覆盖

      // 允许显式 any（动态场景/代码生成器需要）
      '@typescript-eslint/no-explicit-any': 'off',

      // 未使用变量/表达式：交由 TS 编译器处理，避免 ESLint 误报
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'no-unused-expressions': 'off',

      // --- 既有代码/代码生成器兼容性 ---
      'no-empty': 'off',
      'no-useless-escape': 'off',
      'no-useless-assignment': 'off',
      'no-redeclare': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',

      // React 组件命名与刷新约束（放宽，兼容业务写法）
      'react-refresh/only-export-components': 'off'
    }
  },

  // 关闭与 Prettier 冲突的格式规则（放在最后）
  eslintConfigPrettier
)
