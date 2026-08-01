package com.xxl.boot.api.framework.mapper.system;

import com.xxl.boot.api.framework.model.entity.DictItem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 字典项 Mapper
 *
 * @author xuxueli 2024-11-03
 */
@Mapper
public interface DictItemMapper {

    /**
     * 新增字典项
     */
    int insert(@Param("xxlBootDictItem") DictItem xxlBootDictItem);

    /**
     * 批量删除字典项
     */
    int delete(@Param("ids") List<Integer> ids);

    /**
     * 按字典ID列表批量删除字典项
     */
    int deleteByDictIds(@Param("dictIds") List<Integer> dictIds);

    /**
     * 更新字典项
     */
    int update(@Param("xxlBootDictItem") DictItem xxlBootDictItem);

    /**
     * Load查询（按ID查询单条字典项）
     */
    DictItem load(@Param("id") int id);

    /**
     * 分页查询某字典下的字典项列表
     */
    List<DictItem> pageList(@Param("dictId") long dictId,
                            @Param("offset") int offset,
                            @Param("pagesize") int pagesize);

    /**
     * 分页查询某字典下的字典项总数
     */
    int pageListCount(@Param("dictId") long dictId,
                      @Param("offset") int offset,
                      @Param("pagesize") int pagesize);

    /**
     * 查询某字典下的全部字典项（按顺序排序）
     */
    List<DictItem> findByDictId(@Param("dictId") long dictId);

    /**
     * 按字典ID + 字典项标识查询（唯一性校验）
     */
    DictItem findByDictIdAndCode(@Param("dictId") long dictId, @Param("itemCode") String itemCode);

}
