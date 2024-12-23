<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="Dao路径.${classInfo.className}Mapper">

    <resultMap id="${classInfo.className}" type="Model路径.${classInfo.className}" >
    <#if classInfo.fieldList?exists && classInfo.fieldList?size gt 0>
    <#list classInfo.fieldList as fieldItem >
        <result column="${fieldItem.columnName}" property="${fieldItem.fieldName}" />
    </#list>
    </#if>
    </resultMap>

    <sql id="Base_Column_List">
    <#if classInfo.fieldList?exists && classInfo.fieldList?size gt 0>
    <#list classInfo.fieldList as fieldItem >
        t.`${fieldItem.columnName}`<#if fieldItem_has_next>,</#if>
    </#list>
    </#if>
    </sql>

    <insert id="insert" parameterType="java.util.Map" >
        INSERT INTO ${classInfo.tableName} (
        <#if classInfo.fieldList?exists && classInfo.fieldList?size gt 0>
        <#list classInfo.fieldList as fieldItem >
            <#if fieldItem.columnName?lower_case != "id" >
            `${fieldItem.columnName}`<#if fieldItem_has_next>,</#if>
            </#if>
        </#list>
        </#if>
        )
        VALUES(
        <#if classInfo.fieldList?exists && classInfo.fieldList?size gt 0>
        <#list classInfo.fieldList as fieldItem >
        <#if fieldItem.columnName?lower_case != "id" >
            <#if fieldItem.columnName?lower_case == "add_time" || fieldItem.columnName?lower_case = "update_time" >
            NOW() <#if fieldItem_has_next>,</#if>
            <#else>
            ${r"#{"}${classInfo.className?uncap_first}.${fieldItem.fieldName}${r"}"} <#if fieldItem_has_next>,</#if>
            </#if>
        </#if>
        </#list>
        </#if>
        )
    </insert>

    <delete id="delete" parameterType="java.util.Map" >
        DELETE FROM ${classInfo.tableName}
        WHERE `id` in
        <foreach collection="ids" item="item" open="(" close=")" separator="," >
            ${r"#{"}item${r"}"}
        </foreach>
    </delete>

    <update id="update" parameterType="java.util.Map" >
        UPDATE ${classInfo.tableName}
        SET
        <#list classInfo.fieldList as fieldItem >
        <#if fieldItem.columnName?lower_case != "id" && fieldItem.columnName?lower_case != "add_time" && fieldItem.columnName?lower_case != "update_time" >
            `${fieldItem.columnName}` = ${r"#{"}${classInfo.className?uncap_first}.${fieldItem.fieldName}${r"}"},
        </#if>
        </#list>
            `update_time` = NOW()
        WHERE `id` = ${r"#{"}${classInfo.className?uncap_first}.id${r"}"}
    </update>

    <select id="load" parameterType="java.util.Map" resultMap="${classInfo.className}">
        SELECT <include refid="Base_Column_List" />
        FROM ${classInfo.tableName} AS t
        WHERE t.`id` = ${r"#{id}"}
    </select>

    <select id="pageList" parameterType="java.util.Map" resultMap="${classInfo.className}">
        SELECT <include refid="Base_Column_List" />
        FROM ${classInfo.tableName} AS t
        LIMIT ${r"#{offset}"}, ${r"#{pagesize}"}
    </select>

    <select id="pageListCount" parameterType="java.util.Map" resultType="int">
        SELECT count(1)
        FROM ${classInfo.tableName} AS t
    </select>

</mapper>
