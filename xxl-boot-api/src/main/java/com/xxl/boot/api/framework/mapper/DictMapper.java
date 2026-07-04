package com.xxl.boot.api.framework.mapper;

import com.xxl.boot.api.framework.model.entity.XxlBootDict;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DictMapper {

    public int insert(@Param("xxlBootDict") XxlBootDict xxlBootDict);

    public int delete(@Param("ids") List<Integer> ids);

    public int update(@Param("xxlBootDict") XxlBootDict xxlBootDict);

    public XxlBootDict load(@Param("id") int id);

    public List<XxlBootDict> pageList(@Param("name") String name,
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
