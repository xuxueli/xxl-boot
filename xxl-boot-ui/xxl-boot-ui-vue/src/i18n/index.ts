/**
 * i18n - 前端国际化文案中心
 *
 * 功能：文案统一维护于 src/i18n/locales/{zh,en}.json（JSON 数据，业界标准），
 *       本模块负责收集合并；当前语言由 default-settings.ts 的 language 配置控制（不支持运行时切换）。
 *
 * @author xuxueli 2026-09-05
 */
import defaultSettings from '@/default-settings'
import en from './locales/en.json'
import zh from './locales/zh.json'

/** 支持的语言 */
export type I18nLang = 'zh' | 'en'

/** 当前语言：由 default-settings.ts 配置，编译期固定 */
export const LANG: I18nLang = (defaultSettings.language as I18nLang) || 'zh'

/** 文案 key 联合类型：由 zh 文案对象推导，提供编译期补全与拼写校验（zh/en 始终保持成对） */
export type MessageKey = DeepKey<typeof zh>

type DeepKey<T> = T extends object
  ? { [K in keyof T]: T[K] extends object
      ? `${K & string}.${DeepKey<T[K]>}`
      : K & string
    }[keyof T]
  : never

/** 插值参数：数组按下标 {0}{1} 顺序替换；对象按 {name} 键名替换 */
export type I18nArgs = Array<string | number> | Record<string, string | number>

/* 构造期将嵌套文案拍平为 Map：key → 文案，避免运行时逐层取值与反复 split */
function flatten(
  data: Record<string, unknown>,
  prefix = '',
  out = new Map<string, string>()
): Map<string, string> {
  for (const [k, v] of Object.entries(data)) {
    const path = prefix ? `${prefix}.${k}` : k
    if (v != null && typeof v === 'object') {
      flatten(v as Record<string, unknown>, path, out)
    } else {
      out.set(path, String(v))
    }
  }
  return out
}

const messages: Record<I18nLang, Map<string, string>> = {
  zh: flatten(zh),
  en: flatten(en)
}

/** 单次正则插值：{0}{1} / {name} 一次性替换，参数缺失时保留占位符 */
function interpolate(tpl: string, args: I18nArgs): string {
  if (Array.isArray(args)) {
    return tpl.replace(/\{(\d+)\}/g, (raw, i: string) => {
      const v = args[Number(i)]
      return v == null ? raw : String(v)
    })
  }
  return tpl.replace(/\{(\w+)\}/g, (raw, name: string) => {
    const v = args[name]
    return v == null ? raw : String(v)
  })
}

/**
 * 翻译：按当前语言取文案，缺失时回退中文，仍无则返回 key 本身
 * @param key  文案 key，如 'system.message.title'
 * @param args 插值参数：数组按下标 {0}{1} 顺序替换；对象按 {name} 键名替换
 * @returns 翻译后的文案
 */
export function t(key: MessageKey, args?: I18nArgs): string {
  const raw = messages[LANG].get(key) ?? messages.zh.get(key) ?? key
  if (!args || raw.indexOf('{') === -1) return raw
  return interpolate(raw, args)
}

export default { t, LANG }