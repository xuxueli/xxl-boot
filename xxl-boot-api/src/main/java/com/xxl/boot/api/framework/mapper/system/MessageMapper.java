package com.xxl.boot.api.framework.mapper.system;

import com.xxl.boot.api.framework.model.entity.Message;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 消息 Mapper
 *
 * @author xuxueli 2024-11-03
 */
@Mapper
public interface MessageMapper {

    /**
     * 新增消息
     */
    public int insert(@Param("xxlBootMessage") Message xxlBootMessage);

    /**
     * 批量删除消息
     */
    public int delete(@Param("ids") List<Integer> ids);

    /**
     * 更新消息
     */
    public int update(@Param("xxlBootMessage") Message xxlBootMessage);

    /**
     * Load查询（按ID查询单条消息）
     */
    public Message load(@Param("id") int id);

    /**
     * 分页查询消息列表（分类/状态过滤，标题内容模糊匹配）
     */
	public List<Message> pageList(@Param("category") int category,
                                  @Param("status") int status,
                                  @Param("title") String title,
                                  @Param("offset") int offset,
                                  @Param("pagesize") int pagesize);

    /**
     * 分页查询消息总数
     */
    public int pageListCount(@Param("category") int category,
                             @Param("status") int status,
                             @Param("title") String title,
                             @Param("offset") int offset,
                             @Param("pagesize") int pagesize);

}
