import type { FormConf, FormItemConf } from './config'

const styles: Record<string, string> = {
  'el-rate': '.el-rate{display: inline-block; vertical-align: text-top;}',
  'el-upload': '.el-upload__tip{line-height: 1.2;}'
}

function addCss(cssList: string[], el: FormItemConf) {
  const css = el.tag ? styles[el.tag] : undefined
  css && cssList.indexOf(css) === -1 && cssList.push(css)
  if (el.children) {
    el.children.forEach(el2 => addCss(cssList, el2))
  }
}

export function makeUpCss(conf: FormConf & { fields: FormItemConf[] }): string {
  const cssList: string[] = []
  conf.fields.forEach(el => addCss(cssList, el))
  return cssList.join('\n')
}
