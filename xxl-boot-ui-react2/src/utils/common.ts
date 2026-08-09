/**
 * common - 通用工具函数
 *
 * 工具列表：
 *   1. parseTime   - 日期格式化（支持多种输入和自定义模板）
 *   2. formatDate  - 表格列日期格式化（YYYY-MM-DD HH:mm:ss）
 *   3. handleTree  - 扁平数组转树形结构
 *   4. tansParams  - 参数序列化（支持嵌套对象展开）
 *   5. blobValidate - 验证 blob 是否为合法文件数据
 *   6. deepClone   - 简易深克隆
 */

// ==================== 日期 / 时间 ====================

/**
 * 日期格式化
 * @param time    - Date 对象 / 时间戳 / ISO 字符串
 * @param pattern - 模板，默认 '{y}-{m}-{d} {h}:{i}:{s}'
 *   占位符：{y}年 {m}月 {d}日 {h}时 {i}分 {s}秒 {a}星期
 * @returns 格式化后的日期字符串；无有效输入时返回 null
 */
export function parseTime(
  time: Date | number | string,
  pattern?: string,
): string | null {
  if (!time) {
    return null;
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}';
  let date: Date;
  if (typeof time === 'object') {
    date = time;
  } else {
    let t: number | string = time;
    if (typeof t === 'string' && /^[0-9]+$/.test(t)) {
      t = parseInt(t, 10);
    } else if (typeof t === 'string') {
      t = t
        .replace(new RegExp(/-/gm), '/')
        .replace('T', ' ')
        .replace(new RegExp(/\.[\d]{3}/gm), '');
    }
    if (typeof t === 'number' && t.toString().length === 10) {
      t = t * 1000;
    }
    date = new Date(t);
  }
  const formatObj: Record<string, number> = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const timeStr = format.replace(
    /{(y|m|d|h|i|s|a)+}/g,
    (result: string, key: string): string => {
      let value: number | string = formatObj[key];
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value];
      }
      if (result.length > 0 && value < 10) {
        value = `0${value}`;
      }
      return String(value || '0');
    },
  );
  return timeStr;
}

/**
 * 表格列时间格式化（parseTime 的简化版，固定 YYYY-MM-DD HH:mm:ss）
 * @param cellValue - 时间值
 * @returns 格式化后的时间字符串
 */
export function formatDate(
  cellValue: number | string | null | undefined,
): string {
  if (cellValue == null || cellValue === '') return '';
  return parseTime(cellValue) || '';
}

// ==================== 树形 ====================

/**
 * 扁平数组转树形结构
 * 两次遍历：先建 id→节点 映射，再挂载子节点到父节点。
 * @param data     - 含 id/parentId 的扁平数组
 * @param id       - id 字段名，默认 'id'
 * @param parentId - 父 id 字段名，默认 'parentId'
 * @param children - 子节点数组字段名，默认 'children'
 * @returns 根节点列表
 */
export function handleTree<T extends Record<string, any>>(
  data: T[],
  id?: string,
  parentId?: string,
  children?: string,
): T[] {
  const config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children',
  };
  const childrenListMap: Record<string, T> = {};
  const tree: T[] = [];
  for (const d of data) {
    childrenListMap[d[config.id]] = d;
    if (!d[config.childrenList]) {
      (d as Record<string, any>)[config.childrenList] = [];
    }
  }
  for (const d of data) {
    const parent = childrenListMap[d[config.parentId]];
    if (!parent) {
      tree.push(d);
    } else {
      (parent as Record<string, any>)[config.childrenList].push(d);
    }
  }
  return tree;
}

// ==================== URL / 参数 ====================

/**
 * 参数序列化到 URL 查询字符串（支持嵌套对象与数组）
 * 嵌套对象展开为 key[subKey]=value 格式，忽略 null/''/undefined。
 * @param params - 参数对象
 * @returns 序列化结果（末尾带 &）
 */
export function tansParams(params: Record<string, any>): string {
  let result = '';
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    const part = `${encodeURIComponent(propName)}=`;
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (
            value[key] !== null &&
            value[key] !== '' &&
            typeof value[key] !== 'undefined'
          ) {
            const p = `${propName}[${key}]`;
            const subPart = `${encodeURIComponent(p)}=`;
            result += `${subPart}${encodeURIComponent(value[key])}&`;
          }
        }
      } else {
        result += `${part}${encodeURIComponent(value)}&`;
      }
    }
  }
  return result;
}

// ==================== 文件 / Blob ====================

/**
 * 关闭当前页面：有历史记录返回上一页，否则跳转首页
 */
export function closePage(): void {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = '/dashboard';
  }
}

/**
 * 验证 blob 是否为合法文件数据（非 JSON 错误报文）
 * @param data - Blob 数据
 * @returns true 为文件数据，false 为 JSON 错误
 */
export function blobValidate(data: Blob): boolean {
  return data.type !== 'application/json';
}

// ==================== 对象 ====================

/**
 * 简易深克隆（递归复制，不处理 Date/RegExp/Function）
 * @param source - 待克隆对象
 * @returns 完全独立的拷贝
 */
export function deepClone<T>(source: T): T {
  if (!source || typeof source !== 'object') {
    throw new Error('error arguments: deepClone');
  }
  const targetObj: any = (source as any).constructor === Array ? [] : {};
  Object.keys(source as any).forEach((keys) => {
    if ((source as any)[keys] && typeof (source as any)[keys] === 'object') {
      targetObj[keys] = deepClone((source as any)[keys]);
    } else {
      targetObj[keys] = (source as any)[keys];
    }
  });
  return targetObj as T;
}
