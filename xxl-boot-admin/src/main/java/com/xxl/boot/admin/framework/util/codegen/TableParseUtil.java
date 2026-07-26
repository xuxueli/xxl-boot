package com.xxl.boot.admin.framework.util.codegen;


import com.xxl.tool.core.StringTool;
import com.xxl.tool.error.BizException;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 建表 SQL 解析工具，将 SQL 解析为 ClassInfo 对象用于代码生成
 * 
 * @author xuxueli 2018-05-02
 */
public class TableParseUtil {

    /**
     * 解析建表 SQL，生成 ClassInfo 对象（用于代码生成）
     *
     * <pre>
     * 输入 SQL 格式示例：
     *      CREATE TABLE `xxl_boot_user`
     *      (
     *          `id`            INT             NOT NULL AUTO_INCREMENT      COMMENT '用户ID',
     *          `username`      VARCHAR(50)     NOT NULL                     COMMENT '账号',
     *          `password`      VARCHAR(100)    NOT NULL                     COMMENT '密码加密信息',
     *          `status`        TINYINT         NOT NULL                     COMMENT '状态：0-正常、1-禁用',
     *          `add_time`      DATETIME        NOT NULL                     COMMENT '新增时间',
     *          `update_time`   DATETIME        NOT NULL                     COMMENT '更新时间',
     *          PRIMARY KEY (`id`),
     *          UNIQUE KEY `i_username` (`username`) USING BTREE
     *      ) ENGINE = InnoDB
     *        DEFAULT CHARSET = utf8mb4;
     * </pre>
     */
    public static ClassInfo processTableIntoClassInfo(String tableSql) throws IOException {

        // 空值校验
        if (StringTool.isBlank(tableSql)) {
            throw new BizException("Table structure can not be empty.");
        }

        // 转小写
        tableSql = tableSql.trim().toLowerCase();

        // 解析表名
        String tableName = null;
        if (tableSql.contains("table") && tableSql.contains("(")) {
            tableName = tableSql.substring(tableSql.indexOf("table")+5, tableSql.indexOf("("));
        } else {
            throw new BizException("Table structure (table name) anomaly.");
        }
        if (tableName.contains("`")) {
            tableName = tableName.substring(tableName.indexOf("`")+1, tableName.lastIndexOf("`"));
        }

        // 驼峰转类名
        String className = StringTool.upperCaseFirst(StringTool.underlineToCamelCase(tableName));

        // 解析表注释
        String classComment = "";
        if (tableSql.contains("comment=")) {
            String classCommentTmp = tableSql.substring(tableSql.lastIndexOf("comment=")+8).trim();
            if (classCommentTmp.contains("'") || classCommentTmp.indexOf("'")!=classCommentTmp.lastIndexOf("'")) {
                classCommentTmp = classCommentTmp.substring(classCommentTmp.indexOf("'")+1, classCommentTmp.lastIndexOf("'"));
            }
            if (!classCommentTmp.trim().isEmpty()) {
                classComment = classCommentTmp;
            }
        }

        // 提取字段 SQL 片段（括号中的部分）
        String fieldListTmp = tableSql.substring(tableSql.indexOf("(")+1, tableSql.lastIndexOf(")"));

        // 替换字段注释中的英文逗号为中文逗号，避免误分割
        Matcher matcher = Pattern.compile("\\ comment '(.*?)\\'").matcher(fieldListTmp);
        while(matcher.find()){
            String commentFull = matcher.group();
            if (commentFull.contains(",")) {
                String commentFinal = commentFull.replace(",", "，");
                fieldListTmp = fieldListTmp.replace(commentFull, commentFinal);
            }
        }

        // 逐行解析字段
        List<FieldInfo> fieldList = new ArrayList<>();
        String[] fieldLineList = fieldListTmp.split(",");
        for (String columnLine : fieldLineList) {
            columnLine = columnLine.trim();

            // 跳过非字段行（主键、索引等）
            if (columnLine.isEmpty()
                    || columnLine.startsWith("primary")
                    || columnLine.startsWith("unique")
                    || columnLine.startsWith("key")
                    || columnLine.startsWith("index")) {
                continue;
            }

            // 解析列名
            int firstSpace = columnLine.indexOf(" ");
            if (firstSpace == -1) continue;
            String columnName = columnLine.substring(0, firstSpace);
            if (columnName.startsWith("`")) {
                columnName = columnName.replace("`", "");
            }
            columnLine = columnLine.substring(firstSpace + 1).trim();

            // 驼峰转属性名
            String fieldName = StringTool.lowerCaseFirst(StringTool.underlineToCamelCase(columnName));
            if (fieldName.contains("_")) {
                fieldName = fieldName.replace("_", "");
            }

            // 根据 SQL 类型映射 Java 类型
            String fieldClass = Object.class.getSimpleName();
            if (columnLine.startsWith("int")
                    || columnLine.startsWith("tinyint")
                    || columnLine.startsWith("smallint")) {
                fieldClass = Integer.TYPE.getSimpleName();
            } else if (columnLine.startsWith("bigint")) {
                fieldClass = Long.TYPE.getSimpleName();
            } else if (columnLine.startsWith("float")) {
                fieldClass = Float.TYPE.getSimpleName();
            } else if (columnLine.startsWith("double")) {
                fieldClass = Double.TYPE.getSimpleName();
            } else if (columnLine.startsWith("datetime")
                    || columnLine.startsWith("timestamp")) {
                fieldClass = Date.class.getSimpleName();
            } else if (columnLine.startsWith("varchar")
                    || columnLine.startsWith("text")
                    || columnLine.startsWith("char")) {
                fieldClass = String.class.getSimpleName();
            } else if (columnLine.startsWith("decimal")) {
                fieldClass = BigDecimal.class.getSimpleName();
            }

            // 解析字段注释
            String fieldComment = "";
            if (columnLine.contains("comment")) {
                String commentTmp = columnLine.substring(columnLine.indexOf("comment") + 7).trim();
                if (commentTmp.contains("'") && commentTmp.indexOf("'") != commentTmp.lastIndexOf("'")) {
                    commentTmp = commentTmp.substring(commentTmp.indexOf("'") + 1, commentTmp.lastIndexOf("'"));
                }
                fieldComment = commentTmp;
            }

            // 封装字段信息
            FieldInfo fieldInfo = new FieldInfo();
            fieldInfo.setColumnName(columnName);
            fieldInfo.setFieldName(fieldName);
            fieldInfo.setFieldClass(fieldClass);
            fieldInfo.setFieldComment(fieldComment);
            fieldList.add(fieldInfo);
        }

        if (fieldList.isEmpty()) {
            throw new BizException("Table structure anomaly.");
        }

        // 封装结果
        ClassInfo codeJavaInfo = new ClassInfo();
        codeJavaInfo.setTableName(tableName);
        codeJavaInfo.setClassName(className);
        codeJavaInfo.setClassComment(classComment);
        codeJavaInfo.setFieldList(fieldList);
        return codeJavaInfo;
    }

}
