/**
 * 画布实时渲染组件（generator/render）
 * 通过 render 函数将画布上的组件配置（conf）渲染为真实 Element Plus 组件。
 */
import { defineComponent, h } from 'vue'
import { makeMap } from '@/utils/generator/config'

const isAttr = makeMap(
  'accept,accept-charset,accesskey,action,align,alt,async,autocomplete,' +
    'autofocus,autoplay,autosave,bgcolor,border,buffered,challenge,charset,' +
    'checked,cite,class,code,codebase,color,cols,colspan,content,http-equiv,' +
    'name,contenteditable,contextmenu,controls,coords,data,datetime,default,' +
    'defer,dir,dirname,disabled,download,draggable,dropzone,enctype,method,for,' +
    'form,formaction,headers,height,hidden,high,href,hreflang,http-equiv,' +
    'icon,id,ismap,itemprop,keytype,kind,label,lang,language,list,loop,low,' +
    'manifest,max,maxlength,media,method,GET,POST,min,multiple,email,file,' +
    'muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,' +
    'preload,radiogroup,readonly,rel,required,reversed,rows,rowspan,sandbox,' +
    'scope,scoped,seamless,selected,shape,size,type,text,password,sizes,span,' +
    'spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,' +
    'target,title,type,usemap,value,width,wrap' +
    'prefix-icon'
)
const isNotProps = makeMap('layout,prepend,regList,tag,document,changeTag,defaultValue')

function useVModel(props: any, emit: any) {
  return {
    modelValue: props.defaultValue,
    'onUpdate:modelValue': (val: any) => emit('update:modelValue', val)
  }
}

/** 子组件渲染函数：h 渲染函数，conf 组件配置，key 键名 */
type ChildRenderFn = (h: any, conf: any, key: string) => any

/**
 * 子节点渲染器表（componentChild）
 * 按组件标签（tag）维护各子节点的渲染函数（如 el-select 的 options、el-radio-group 的 radio 项）
 * 运行时根据 conf 的组件标签取对应渲染器生成子节点 VNode。
 */
const componentChild: Record<string, Record<string, ChildRenderFn>> = {
  'el-button': {
    default(h, conf, key) {
      return conf[key]
    }
  },
  'el-select': {
    options(h, conf, key) {
      return conf.options.map((item: any) =>
        h(resolveComponent('el-option'), {
          label: item.label,
          value: item.value
        })
      )
    }
  },
  'el-radio-group': {
    options(h, conf, key) {
      return conf.optionType === 'button'
        ? conf.options.map((item: any) =>
            h(
              resolveComponent('el-checkbox-button'),
              {
                label: item.value
              },
              () => item.label
            )
          )
        : conf.options.map((item: any) =>
            h(
              resolveComponent('el-radio'),
              {
                label: item.value,
                border: conf.border
              },
              () => item.label
            )
          )
    }
  },
  'el-checkbox-group': {
    options(h, conf, key) {
      return conf.optionType === 'button'
        ? conf.options.map((item: any) =>
            h(
              resolveComponent('el-checkbox-button'),
              {
                label: item.value
              },
              () => item.label
            )
          )
        : conf.options.map((item: any) =>
            h(
              resolveComponent('el-checkbox'),
              {
                label: item.value,
                border: conf.border
              },
              () => item.label
            )
          )
    }
  },
  'el-upload': {
    'list-type': (h, conf, key) => {
      const option: Record<string, any> = {}
      // if (conf.showTip) {
      //   tip = h('div', {
      //     class: "el-upload__tip"
      //   }, () => '只能上传不超过' + conf.fileSize + conf.sizeUnit + '的' + conf.accept + '文件')
      // }
      if (conf['list-type'] === 'picture-card') {
        return h(resolveComponent('el-icon'), option, () => h(resolveComponent('Plus')))
      } else {
        // option.size = "small"
        option.type = 'primary'
        option.icon = 'Upload'
        return h(resolveComponent('el-button'), option, () => conf.buttonText)
      }
    }
  }
}
/**
 * 插槽渲染器表（componentSlot）
 * 按组件标签维护插槽内容渲染函数（如 el-upload 的 tip 提示插槽）。
 */
const componentSlot: Record<string, Record<string, ChildRenderFn>> = {
  'el-upload': {
    tip: (h, conf, key) => {
      if (conf.showTip) {
        return () =>
          h(
            'div',
            {
              class: 'el-upload__tip'
            },
            '只能上传不超过' + conf.fileSize + conf.sizeUnit + '的' + conf.accept + '文件'
          )
      }
    }
  }
}
export default defineComponent({
  // 使用 render 函数
  render() {
    const self = this as any
    const dataObject: Record<string, any> & {
      attrs: Record<string, any>
      props: Record<string, any>
      on: Record<string, any>
      style: Record<string, any>
    } = {
      attrs: {},
      props: {},
      on: {},
      style: {}
    }
    const confClone = JSON.parse(JSON.stringify(self.conf))
    const children: any[] = []
    const slot: Record<string, any> = {}
    const childObjs = componentChild[confClone.tag]
    if (childObjs) {
      Object.keys(childObjs).forEach((key) => {
        const childFunc = childObjs[key]
        if (confClone[key]) {
          children.push(childFunc(h, confClone, key))
        }
      })
    }
    const slotObjs = componentSlot[confClone.tag]
    if (slotObjs) {
      Object.keys(slotObjs).forEach((key) => {
        const childFunc = slotObjs[key]
        if (confClone[key]) {
          slot[key] = childFunc(h, confClone, key)
        }
      })
    }
    Object.keys(confClone).forEach((key) => {
      const val = confClone[key]
      if (dataObject[key]) {
        dataObject[key] = val
      } else if (isAttr(key)) {
        dataObject.attrs[key] = val
      } else if (!isNotProps(key)) {
        dataObject.props[key] = val
      }
    })
    if (children.length > 0) {
      slot.default = () => children
    }

    return h(
      resolveComponent(self.conf.tag),
      {
        modelValue: self.$attrs.modelValue,
        ...dataObject.props,
        ...dataObject.attrs,
        style: {
          ...dataObject.style
        }
      },
      slot ?? null
    )
  },
  props: {
    conf: {
      type: Object,
      required: true
    }
  }
})
