/**
 * 组件：DictTag（字典标签）
 * 功能：根据字典选项数组，将字典值渲染为 Tag 或纯文本。
 *       支持 "单值、数组、逗号分隔" 字符串三种输入格式。
 *
 * 用法：<DictTag options={sys_normal_disable} value={row.status} />
 */
import { Tag } from 'antd'
import type { ReactNode } from 'react'

/** 字典选项类型 */
interface DictOption {
  /** 字典值 */
  value: string | number
  /** 字典显示文案 */
  label: string
  /** 标签类型 */
  elTagType?: any
  /** 自定义 class */
  elTagClass?: any
}

interface DictTagProps {
  /** 字典选项列表 */
  options?: DictOption[]
  /** 当前值：支持 Number / String / Array 三种类型 */
  value?: number | string | Array<string | number> | null
  /** 字符串分隔符：value 为逗号分隔字符串时使用 */
  separator?: string
  /** 未匹配时是否显示原始 value */
  showValue?: boolean
}

/**
 * 字典标签
 */
export default function DictTag({ options = [], value, separator = ',', showValue = true }: DictTagProps) {
  // 将 value 统一转为字符串数组，方便后续匹配
  const values = normalizeValues(value, separator)

  // 未匹配项
  const unmatchArray = computeUnmatch(values, value, options)
  const unmatch = unmatchArray.length > 0

  // 判断某个字典值是否与当前 value 匹配
  const isValueMatch = (itemValue: string | number) => values.some((val) => val === itemValue)

  // 数组转空格分隔字符串，用于显示未匹配项
  const handleArray = (array: Array<string | number>): string => {
    if (array.length === 0) return ''
    return array.reduce((pre: string, cur) => pre + ' ' + cur, '')
  }

  return (
    <div className="dict-tag">
      {/* 遍历字典选项，匹配当前值则渲染标签 */}
      {options.map((item, index) =>
        isValueMatch(item.value) ? (
          (item.elTagType === 'default' || item.elTagType === '' || item.elTagType === undefined) &&
          (item.elTagClass === '' || item.elTagClass === null || item.elTagClass === undefined) ? (
            <span key={String(item.value)} className={String(item.elTagClass || '')}>
              {item.label + ' '}
            </span>
          ) : (
            <Tag key={String(item.value)} color={item.elTagType} className={String(item.elTagClass || '')} style={{ marginRight: 10 }}>
              {item.label + ' '}
            </Tag>
          )
        ) : null
      )}
      {/* 存在未匹配项且 showValue 开启时，显示原始值 */}
      {unmatch && showValue ? handleArray(unmatchArray) : null}
    </div>
  )
}

/**
 * 将 value 统一转为字符串数组
 */
function normalizeValues(value: number | string | Array<string | number> | null | undefined, separator: string): Array<string | number> {
  if (value === null || typeof value === 'undefined' || value === '') return []
  if (typeof value === 'number' || typeof value === 'boolean') return [value]
  return Array.isArray(value) ? value.map((item) => '' + item) : String(value).split(separator)
}

/**
 * 收集未匹配的字典项
 */
function computeUnmatch(
  values: Array<string | number>,
  value: number | string | Array<string | number> | null | undefined,
  options: DictOption[]
): Array<string | number> {
  if (
    value === null ||
    typeof value === 'undefined' ||
    value === '' ||
    !Array.isArray(options) ||
    options.length === 0
  )
    return []
  return values.filter((item) => !options.some((v) => v.value === item))
}
