/**
 * 类型定义：代码生成
 * 对应后端代码生成表（Codegen）与字段（CodegenField）。
 */
declare namespace API {
  /** 代码生成表 */
  type Codegen = {
    id?: number;
    tableName?: string;
    tableComment?: string;
    remark?: string;
    packageName?: string;
    moduleName?: string;
    businessName?: string;
    functionName?: string;
    functionAuthor?: string;
    formColNum?: number;
    tplCategory?: string;
    tplWebType?: string;
    addTime?: string;
    updateTime?: string;
    fieldList?: CodegenField[];
  };

  /** 代码生成字段 */
  type CodegenField = {
    id?: number;
    codegenId?: number;
    columnName?: string;
    columnComment?: string;
    javaType?: string;
    javaField?: string;
    isInsert?: string;
    isEdit?: string;
    isList?: string;
    isQuery?: string;
    isRequired?: string;
    queryType?: string;
    htmlType?: string;
    dictType?: string;
    sort?: number;
    addTime?: string;
    updateTime?: string;
  };
}
