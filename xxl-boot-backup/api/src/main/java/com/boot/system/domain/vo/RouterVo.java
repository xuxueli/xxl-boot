package com.boot.system.domain.vo;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

/**
 * 路由配置信息
 *
 * <pre>
 *   {
 *     path: '/',                                           // 1. 基础路径：必需‌，路由的路径字符串，支持动态参数（如 :id）
 *     name: 'Home',                                        // 2. 命名路由：路由的唯一标识名称，用于编程式导航（router.push({ name: 'Home' })）
 *     component: () => import('@/views/HomeView.vue'),     // 3. 组件映射：当路由匹配时渲染的组件，支持懒加载写法 () => import(...)
 *     // redirect: '/dashboard',                           // 4. 重定向 (可选)：重定向目标。当访问该路由时，自动跳转到指定路径。如 '/target-path'、'{ name: 'UserProfile' }'
 *     // alias: '/home',                                   // 5. 别名 (可选）：允许通过别名路径访问该路由，但 URL 保持为别名，且匹配规则与原路径一致。
 *     meta: {                                              // 6. 元信息：不会干涉其内容，但会将其附加到路由记录上，常用于权限判断、标题设置、KeepAlive缓存标识等。
 *       icon: user,                                            // 自定义：用于菜单图标展示
 *       title: '首页',
 *       keepAlive: true,                                       // 自定义：通常配合 <keep-alive> 使用，由业务代码判断是否缓存组件
 *       noCache:true
 *     },
 *     // props: true,                                      // 7. Props 解耦：是否将 params 作为 props 传递给组件。
 *     children: [                                          // 8. 子路由 (嵌套路由)
 *       {
 *         path: 'user/:id',                                        // 基础路径
 *         name: 'UserProfile',                                     // 命名路由
 *         component: () => import('@/views/UserProfile.vue'),      // 组件映射
 *         meta: {                                                  // 元信息
 *           icon: user,
 *           title: '用户管理'
 *         }
 *       }
 *     ],
 *     hidden:false                                         // 自定义：用于控制该路由是否在侧边栏菜单中隐藏
 *   }
 * </pre>
 */
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class RouterVo
{
    /**
     * 路由名字
     */
    private String name;

    /**
     * 路由地址
     */
    private String path;

    /**
     * 是否隐藏路由，当设置 true 的时候该路由不会再侧边栏出现
     */
    private boolean hidden;

    /**
     * 重定向地址，当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
     */
    private String redirect;

    /**
     * 组件地址
     */
    private String component;

    /**
     * 路由参数：如 {"id": 1, "name": "ry"}
     */
    /*private String query;*/

    /**
     * 其他元素
     */
    private MetaVo meta;

    /**
     * 子路由
     */
    private List<RouterVo> children;

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public String getPath()
    {
        return path;
    }

    public void setPath(String path)
    {
        this.path = path;
    }

    public boolean getHidden()
    {
        return hidden;
    }

    public void setHidden(boolean hidden)
    {
        this.hidden = hidden;
    }

    public String getRedirect()
    {
        return redirect;
    }

    public void setRedirect(String redirect)
    {
        this.redirect = redirect;
    }

    public String getComponent()
    {
        return component;
    }

    public void setComponent(String component)
    {
        this.component = component;
    }

    /*public String getQuery()
    {
        return query;
    }

    public void setQuery(String query)
    {
        this.query = query;
    }*/

    public MetaVo getMeta()
    {
        return meta;
    }

    public void setMeta(MetaVo meta)
    {
        this.meta = meta;
    }

    public List<RouterVo> getChildren()
    {
        return children;
    }

    public void setChildren(List<RouterVo> children)
    {
        this.children = children;
    }
}
