package com.xxl.boot.api.framework.mapper;

import com.xxl.boot.api.framework.model.entity.XxlBootConfig;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ConfigMapper {

    public int insert(@Param("xxlBootConfig") XxlBootConfig xxlBootConfig);

    public int delete(@Param("ids") List<Integer> ids);

    public int update(@Param("xxlBootConfig") XxlBootConfig xxlBootConfig);

    public XxlBootConfig load(@Param("id") int id);

    public List<XxlBootConfig> pageList(@Param("status") int status,
                                        @Param("name") String name,
                                        @Param("key") String key,
                                        @Param("offset") int offset,
                                        @Param("pagesize") int pagesize);

    public int pageListCount(@Param("status") int status,
                             @Param("name") String name,
                             @Param("key") String key,
                             @Param("offset") int offset,
                             @Param("pagesize") int pagesize);

}
