/**
 * i18n - 前端国际化文案中心
 *
 * 功能：文案维护于 src/i18n/locales/{zh,en}.json；语言默认 zh，由后端基础配置经 setLang 同步；
 *       新增语言仅在 bundles 追加一行即可（I18nLang 类型与文案表随之自动派生）；
 *       语言变更后由根组件整树重挂载刷新文案。
 *
 * @author xuxueli 2026-09-05
 */
import en from './locales/en.json';
import zh from './locales/zh.json';

/** 语言注册表：新增语言仅需追加一行 */
const bundles = { zh, en } as const;

/** 支持的语言（由注册表派生，禁止另行维护） */
export type I18nLang = keyof typeof bundles;

/** 默认语言 */
const DEFAULT_LANG: I18nLang = 'zh';

/** 当前语言：默认 zh，非法值回退默认 */
let lang: I18nLang = DEFAULT_LANG;

/** 获取当前语言 */
export const getLang = (): I18nLang => lang;

/** 设置当前语言（由后端基础配置同步，非法值回退默认） */
export const setLang = (value?: string): void => {
  lang = value != null && value in bundles ? (value as I18nLang) : DEFAULT_LANG;
};

/** 文案 key 联合类型：由 zh 文案推导，提供编译期补全与拼写校验（各语言成对） */
export type MessageKey = DeepKey<typeof zh>;
type DeepKey<T> = T extends object
  ? { [K in keyof T]: T[K] extends object ? `${K & string}.${DeepKey<T[K]>}` : K & string }[keyof T]
  : never;

/** 拍平嵌套文案：{ a: { b: 'x' } } → { 'a.b': 'x' } */
const flat = (data: Record<string, unknown>, prefix = ''): Record<string, string> =>
  Object.entries(data).reduce((out, [k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    return Object.assign(
      out,
      v && typeof v === 'object' ? flat(v as Record<string, unknown>, key) : { [key]: String(v) },
    );
  }, {} as Record<string, string>);

const messages = Object.fromEntries(
  Object.entries(bundles).map(([key, value]) => [key, flat(value)]),
) as Record<I18nLang, Record<string, string>>;

/**
 * 翻译：按当前语言取文案，缺失回退默认语言，再缺失返回 key；支持 {0}/{name} 插值
 *
 * @param key  文案 key，如 'system.message.title'
 * @param args 插值参数：数组按下标 {0}{1}、对象按 {name} 取值
 * @returns 翻译后的文案
 */
export function t(key: MessageKey, args?: Array<string | number> | Record<string, string | number>): string {
  const raw = messages[lang][key] ?? messages[DEFAULT_LANG][key] ?? key;
  if (!args) return raw;
  const vars = args as Record<string, string | number>;
  return raw.replace(/\{(\w+)\}/g, (placeholder, name) => (vars[name] == null ? placeholder : String(vars[name])));
}
