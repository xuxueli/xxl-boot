import java.util.Map;
import java.util.List;

import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

/**
* ${classInfo.className} Service
*
* Created by xuxueli on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.
*/
public interface ${classInfo.className}Service {

    /**
    * 新增
    */
    public Response<String> insert(${classInfo.className} ${classInfo.className?uncap_first});

    /**
    * 删除
    */
    public Response<String> delete(List<Integer> ids);

    /**
    * 更新
    */
    public Response<String> update(${classInfo.className} ${classInfo.className?uncap_first});

    /**
    * Load查询
    */
    public Response<${classInfo.className}> load(int id);

    /**
    * 分页查询
    */
    public PageModel<${classInfo.className}> pageList(int offset, int pagesize);

}
