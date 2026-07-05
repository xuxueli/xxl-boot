package com.xxl.boot.admin.framework.mapper;

import com.xxl.boot.admin.framework.model.entity.Config;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ConfigMapper {

    public int insert(@Param("xxlBootConfig") Config xxlBootConfig);

    public int delete(@Param("ids") List<Integer> ids);

    public int update(@Param("xxlBootConfig") Config xxlBootConfig);

    public Config load(@Param("id") int id);

    public List<Config> pageList(@Param("status") int status,
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
