package com.xxl.boot.admin.mapper;

import com.xxl.boot.admin.model.entity.XxlBootUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * @author xuxueli 2019-05-04 16:44:59
 */
@Mapper
public interface UserMapper {

	public int insert(XxlBootUser xxlJobUser);

	public int delete(@Param("id") int id);

	public int deleteByIds(@Param("ids") List<Integer> ids);

	public int update(XxlBootUser xxlJobUser);

	public XxlBootUser loadByUserName(@Param("username") String username);

	public XxlBootUser load(@Param("id") int id);

	public List<XxlBootUser> pageList(@Param("offset") int offset,
									  @Param("pagesize") int pagesize,
									  @Param("username") String username,
									  @Param("status") int status);
	public int pageListCount(@Param("offset") int offset,
							 @Param("pagesize") int pagesize,
							 @Param("username") String username,
							 @Param("status") int status);


}
