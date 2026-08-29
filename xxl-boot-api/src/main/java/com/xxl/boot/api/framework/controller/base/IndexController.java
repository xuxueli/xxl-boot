package com.xxl.boot.api.framework.controller.base;

import com.xxl.boot.api.framework.constant.enums.ResourceTypeEnum;
import com.xxl.boot.api.framework.model.dto.MetaVo;
import com.xxl.boot.api.framework.model.dto.RouterVo;
import com.xxl.boot.api.framework.service.ResourceService;
import com.xxl.boot.api.framework.util.I18nUtil;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.sso.core.helper.XxlSsoHelper;
import com.xxl.sso.core.model.LoginInfo;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.core.StringTool;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * index controller
 *
 * @author xuxueli 2015-12-19 16:13:16
 */
@RestController
public class IndexController {

	@Resource
	private ResourceService resourceService;

    // ---------------------- index ----------------------

	@RequestMapping("/")
	@XxlSso(login = false)
	public String index() {
        return StringTool.format("Welcome to {0}  {1} ",
                I18nUtil.getString("admin_name_full"),
                I18nUtil.getString("admin_version")
        );
	}


	// ---------------------- getRouters ----------------------

	/**
	 * 获取路由菜单
	 *
	 * 转换为前端 Vue Router 可消费的树形结构
	 */
	@RequestMapping("/getRouters")
	@XxlSso
	public Response<List<RouterVo>> getRouters(HttpServletRequest request) {

		// login check
		Response<LoginInfo> loginCheckResult = XxlSsoHelper.loginCheckWithAttr(request);

		// query user resource
		int userId = Integer.parseInt(loginCheckResult.getData().getUserId());
		List<com.xxl.boot.api.framework.model.entity.Resource> resourceList = resourceService.queryResourceByUserid(userId, -1);

		// 直接从 flat list 构建 RouterVo 树（Resource 实体无 children 字段）
		List<RouterVo> routerList = buildRoutersFromFlatList(resourceList);

		return Response.ofSuccess(routerList);
	}

	/**
	 * 从 flat Resource 列表直接构建 RouterVo 树
	 *
	 * 参考旧项目 SysMenuServiceImpl#buildMenus：
	 *   CATALOG(0): parentId=0→Layout, parentId!=0→ParentView, 递归子路由
	 *   MENU(1): parentId=0→Layout+子节点包装, parentId!=0→InnerLink/component
	 *   BUTTON(2): 跳过
	 */
	private List<RouterVo> buildRoutersFromFlatList(List<com.xxl.boot.api.framework.model.entity.Resource> resourceList) {
		if (CollectionTool.isEmpty(resourceList)) {
			return new ArrayList<>();
		}
		// 按 parentId 分组
		Map<Integer, List<com.xxl.boot.api.framework.model.entity.Resource>> parentMap = new HashMap<>();
		for (com.xxl.boot.api.framework.model.entity.Resource resource : resourceList) {
			if (resource.getType() == ResourceTypeEnum.BUTTOM.getCode()) {
				continue;
			}
			parentMap.computeIfAbsent(resource.getParentId(), k -> new ArrayList<>()).add(resource);
		}
		// 从根节点开始构建
		return buildRouterChildren(parentMap.get(0), parentMap);
	}

	private List<RouterVo> buildRouterChildren(List<com.xxl.boot.api.framework.model.entity.Resource> resources, Map<Integer, List<com.xxl.boot.api.framework.model.entity.Resource>> parentMap) {
		if (CollectionTool.isEmpty(resources)) {
			return new ArrayList<>();
		}
		List<RouterVo> routers = new ArrayList<>();
		for (com.xxl.boot.api.framework.model.entity.Resource resource : resources) {

			// build router
			RouterVo router = new RouterVo();
			router.setName("menu_" + resource.getId());
			router.setPath(resource.getUrl());
			router.setHidden(resource.getVisible() == 1);
			router.setMeta(new MetaVo(resource.getName(), resource.getIcon()));

			int type = resource.getType();
			boolean isRoot = (resource.getParentId() == 0);
			List<com.xxl.boot.api.framework.model.entity.Resource> childrenRes = parentMap.get(resource.getId());

			if (type == ResourceTypeEnum.CATALOG.getCode()) {
				if (isRoot) {
					// 目录 - 根节点
					router.setComponent("Layout");
				} else {
					// 目录 - 非根节点
					router.setComponent("ParentView");
				}

				// 子节点
				if (CollectionTool.isNotEmpty(childrenRes)) {
					router.setChildren(buildRouterChildren(childrenRes, parentMap));
				}
			} else if (type == ResourceTypeEnum.MENU.getCode()) {
				if (isRoot) {
					// 菜单 - 根节点
					router.setComponent("Layout");
					router.setMeta(null);

					// 模拟子节点
					RouterVo child = new RouterVo();
					child.setName("child_menu_" + resource.getId());
					child.setPath(resource.getUrl());
					child.setComponent(isHttp(resource.getUrl()) ? "InnerLink" : resource.getUrl());
					child.setMeta(new MetaVo(resource.getName(), resource.getIcon()));

					router.setChildren(List.of(child));
				} else {
					// 菜单 - 非根节点
					router.setComponent(isHttp(resource.getUrl()) ? "InnerLink" : resource.getUrl());
				}
			}
			routers.add(router);
		}
		return routers;
	}

	private boolean isHttp(String url) {
		return url != null && (url.startsWith("http://") || url.startsWith("https://"));
	}


	// ---------------------- default error page ----------------------

	@RequestMapping(value = "/errorpage")
	@XxlSso(login = false)
	public Response<String> errorPage(HttpServletResponse response) {
		String exceptionMsg = "Error, HTTP Status Code: "+response.getStatus();
		return Response.ofFail(exceptionMsg);
	}

}
