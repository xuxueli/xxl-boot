package com.xxl.boot.api.framework.mapper;

import com.xxl.boot.api.framework.model.entity.DbTable;
import com.xxl.boot.api.framework.model.entity.DbTableColumn;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 数据库元数据 Mapper（查询 information_schema）
 */
@Mapper
public interface DbTableMapper {

    List<DbTable> listDbTable(@Param("tableName") String tableName,
                              @Param("offset") int offset, @Param("pagesize") int pagesize);
    int listDbTableCount(@Param("tableName") String tableName);
    List<DbTableColumn> listDbTableColumn(@Param("tableName") String tableName);
}
