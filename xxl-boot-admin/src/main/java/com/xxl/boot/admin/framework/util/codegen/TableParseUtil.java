package com.xxl.boot.admin.framework.util.codegen;


import com.xxl.tool.core.StringTool;
import com.xxl.tool.error.BizException;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author xuxueli 2018-05-02 21:10:45
 */
public class TableParseUtil {

    /**
     * 解析建表SQL生成代码（model-dao-xml）
     *
     * <pre>
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
        if (StringTool.isBlank(tableSql)) {
            throw new BizException("Table structure can not be empty.");
        }
        tableSql = tableSql.trim();

        // 1、table Name
        String tableName = null;
        if (tableSql.contains("TABLE") && tableSql.contains("(")) {
            tableName = tableSql.substring(tableSql.indexOf("TABLE")+5, tableSql.indexOf("("));
        } else if (tableSql.contains("table") && tableSql.contains("(")) {
            tableName = tableSql.substring(tableSql.indexOf("table")+5, tableSql.indexOf("("));
        } else {
            throw new BizException("Table structure anomaly.");
        }
        if (tableName.contains("`")) {
            tableName = tableName.substring(tableName.indexOf("`")+1, tableName.lastIndexOf("`"));
        }

        // 2、class Name
        String className = StringTool.upperCaseFirst(StringTool.underlineToCamelCase(tableName));
        if (className.contains("_")) {
            className = className.replace("_", "");
        }

        // 3、class Comment
        String classComment = "";
        if (tableSql.contains("COMMENT=")) {
            String classCommentTmp = tableSql.substring(tableSql.lastIndexOf("COMMENT=")+8).trim();
            if (classCommentTmp.contains("'") || classCommentTmp.indexOf("'")!=classCommentTmp.lastIndexOf("'")) {
                classCommentTmp = classCommentTmp.substring(classCommentTmp.indexOf("'")+1, classCommentTmp.lastIndexOf("'"));
            }
            if (!classCommentTmp.trim().isEmpty()) {
                classComment = classCommentTmp;
            }
        }

        // 4、field List
        List<FieldInfo> fieldList = new ArrayList<>();

        String fieldListTmp = tableSql.substring(tableSql.indexOf("(")+1, tableSql.lastIndexOf(")"));

        // replace "," by "，" in comment
        Matcher matcher = Pattern.compile("\\ COMMENT '(.*?)\\'").matcher(fieldListTmp);     // "\\{(.*?)\\}"
        while(matcher.find()){

            String commentTmp = matcher.group();
            commentTmp = commentTmp.replaceAll("\\ COMMENT '|\\'", "");         // "\\{|\\}"

            if (commentTmp.contains(",")) {
                String commentTmpFinal = commentTmp.replace(",", "，");
                fieldListTmp = fieldListTmp.replace(commentTmp, commentTmpFinal);
            }
        }

        // remove invalid data
        for (Pattern pattern: Arrays.asList(
                Pattern.compile("[\\s]*PRIMARY KEY .*(\\),|\\))"),      // remove PRIMARY KEY
                Pattern.compile("[\\s]*UNIQUE KEY .*(\\),|\\))"),       // remove UNIQUE KEY
                Pattern.compile("[\\s]*KEY .*(\\),|\\))")               // remove KEY
        )) {
            Matcher patternMatcher = pattern.matcher(fieldListTmp);
            while(patternMatcher.find()){
                fieldListTmp = fieldListTmp.replace(patternMatcher.group(),"");
            }
        }

        // collect column
        String[] fieldLineList = fieldListTmp.split(",");
        for (String columnLine : fieldLineList) {
            columnLine = columnLine.trim();                                                 // `userid` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',

            // 4.1、column Name
            int firstSpace = columnLine.indexOf(" ");
            if (firstSpace == -1) continue;
            String columnName = columnLine.substring(0, firstSpace);
            if (columnName.startsWith("`")) {
                columnName = columnName.replace("`", "");
            }
            columnLine = columnLine.substring(firstSpace + 1).trim().toLowerCase();

            // 4.2、field Name
            String fieldName = StringTool.lowerCaseFirst(StringTool.underlineToCamelCase(columnName));
            if (fieldName.contains("_")) {
                fieldName = fieldName.replace("_", "");
            }

            // 4.3、field class
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

            // field comment
            String fieldComment = "";
            if (columnLine.contains("comment")) {
                String commentTmp = columnLine.substring(columnLine.indexOf("comment") + 7).trim();
                if (commentTmp.contains("'") && commentTmp.indexOf("'") != commentTmp.lastIndexOf("'")) {
                    commentTmp = commentTmp.substring(commentTmp.indexOf("'") + 1, commentTmp.lastIndexOf("'"));
                }
                fieldComment = commentTmp;
            }

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

        // result
        ClassInfo codeJavaInfo = new ClassInfo();
        codeJavaInfo.setTableName(tableName);
        codeJavaInfo.setClassName(className);
        codeJavaInfo.setClassComment(classComment);
        codeJavaInfo.setFieldList(fieldList);

        return codeJavaInfo;
    }

}
