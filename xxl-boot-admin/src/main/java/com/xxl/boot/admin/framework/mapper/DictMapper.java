package com.xxl.boot.admin.framework.mapper;

import com.xxl.boot.admin.framework.model.entity.Dict;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DictMapper {

    public int insert(@Param("xxlBootDict") Dict xxlBootDict);

    public int delete(@Param("ids") List<Integer> ids);

    public int update(@Param("xxlBootDict") Dict xxlBootDict);

    public Dict load(@Param("id") int id);

    public List<Dict> pageList(@Param("name") String name,
                                      @Param("code") String code,
                                      @Param("status") int status,
                                      @Param("offset") int offset,
                                      @Param("pagesize") int pagesize);

    public int pageListCount(@Param("name") String name,
                             @Param("code") String code,
                             @Param("status") int status,
                             @Param("offset") int offset,
                             @Param("pagesize") int pagesize);

}
