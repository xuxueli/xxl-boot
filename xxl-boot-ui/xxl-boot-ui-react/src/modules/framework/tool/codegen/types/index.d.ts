/**
 * @fileoverview Codegen 类型定义
 * @description 代码生成表与字段实体，对应后端 CodegenDTO
 * @author xuxueli 2026-11-21
 */
declare namespace API {
  /** 代码生成表 */
  type Codegen = {
    /** 主键 */
    id?: number;
    /** 表名 */
    tableName?: string;
    /** 表描述 */
    tableComment?: string;
    /** 备注 */
    remark?: string;
    /** 包名 */
    packageName?: string;
    /** 模块名 */
    moduleName?: string;
    /** 业务名 */
    businessName?: string;
    /** 功能名 */
    functionName?: string;
    /** 作者 */
    functionAuthor?: string;
    /** 表单列数 */
    formColNum?: number;
    /** 模板类型：crud / tree */
    tplCategory?: string;
    /** 前端模板类型：antd-typescript / element-plus-typescript */
    tplWebType?: string;
    /** 添加时间 */
    addTime?: string;
    /** 更新时间 */
    updateTime?: string;
    /** 字段列表 */
    fieldList?: CodegenField[];
  };

  /** 代码生成列表查询条件：ProTable 分页 + 搜索栏字段 */
  type CodegenQuery = {
    /** 当前页码，默认 1 */
    current?: number;
    /** 每页条数，默认 10 */
    pageSize?: number;
    /** 表名，模糊匹配 */
    tableName?: string;
    /** 表描述，模糊匹配 */
    tableComment?: string;
  };

  /** 代码生成新增/修改表单：排除后端维护的时间字段 */
  type CodegenForm = Pick<
    Codegen,
    | 'id'
    | 'tableName'
    | 'tableComment'
    | 'remark'
    | 'packageName'
    | 'moduleName'
    | 'businessName'
    | 'functionName'
    | 'functionAuthor'
    | 'formColNum'
    | 'tplCategory'
    | 'tplWebType'
  > & {
    /** 字段列表 */
    fieldList?: CodegenField[];
  };

  /** 代码生成字段 */
  type CodegenField = {
    /** 主键 */
    id?: number;
    /** 所属生成表主键 */
    codegenId?: number;
    /** 列名 */
    columnName?: string;
    /** 列描述 */
    columnComment?: string;
    /** Java 类型 */
    javaType?: string;
    /** Java 属性名 */
    javaField?: string;
    /** 是否插入：1-是、0-否 */
    isInsert?: string;
    /** 是否编辑：1-是、0-否 */
    isEdit?: string;
    /** 是否列表展示：1-是、0-否 */
    isList?: string;
    /** 是否查询条件：1-是、0-否 */
    isQuery?: string;
    /** 是否必填：1-是、0-否 */
    isRequired?: string;
    /** 查询方式 */
    queryType?: string;
    /** 表单组件类型 */
    htmlType?: string;
    /** 字典标识 */
    dictType?: string;
    /** 排序值 */
    sort?: number;
    /** 添加时间 */
    addTime?: string;
    /** 更新时间 */
    updateTime?: string;
  };
}
