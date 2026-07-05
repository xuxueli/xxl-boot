package com.xxl.boot.admin.framework.mapper;

import com.xxl.boot.admin.framework.model.entity.DictItem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DictItemMapper {

    public int insert(@Param("xxlBootDictItem") DictItem xxlBootDictItem);

    public int delete(@Param("ids") List<Integer> ids);

    public int deleteByDictIds(@Param("dictIds") List<Integer> dictIds);

    public int update(@Param("xxlBootDictItem") DictItem xxlBootDictItem);

    public DictItem load(@Param("id") int id);

    public List<DictItem> pageList(@Param("dictId") long dictId,
                                          @Param("offset") int offset,
                                          @Param("pagesize") int pagesize);

    public int pageListCount(@Param("dictId") long dictId,
                             @Param("offset") int offset,
                             @Param("pagesize") int pagesize);

    public List<DictItem> findByDictId(@Param("dictId") long dictId);

}
