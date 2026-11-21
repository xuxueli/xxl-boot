/**
 * 名称：菜单适配工具
 * 功能：后端纯菜单树 → ProLayout 菜单数据，并生成目录跳转映射
 *
 * @author xuxueli 2026-11-21
 */
import type { MenuDataItem } from '@ant-design/pro-components';
import { getIconComponent } from '@/utils/icon';

/**
 * 构建菜单：一次遍历同时产出「菜单数据」与「目录→第一个叶子路径」映射
 *
 * 后端结构：纯业务菜单节点（type：0-目录、1-菜单），不含任何路由/组件语义；
 *   - visible=1 的隐藏菜单不参与渲染；
 *   - 目录：url 作为菜单路径并递归 children；
 *   - 菜单：url 作为跳转路径；
 *   - 图标：icon 字符串经 UI 图标库解析。
 *
 * @param menus 后端 /getMenus 返回的菜单树
 * @returns items：ProLayout 菜单数据；redirectMap：目录路径 → 第一个叶子路径
 */
export function buildMenu(
  menus: API.MenuNode[],
): { items: MenuDataItem[]; redirectMap: Record<string, string> } {
  const redirectMap: Record<string, string> = {};

  /* 查找子树中的第一个叶子路径（目录点击跳转用） */
  const findFirstLeaf = (nodes: API.MenuNode[]): string | undefined => {
    for (const node of nodes) {
      /* 叶子节点：直接使用其路径 */
      if (!node.children?.length) return node.url;
      /* 目录节点：递归向下查找 */
      const leafPath = findFirstLeaf(node.children);
      if (leafPath) return leafPath;
    }
    return undefined;
  };

  /* 递归转换：过滤隐藏项、构造菜单项，并记录目录跳转映射 */
  const toItems = (nodes: API.MenuNode[]): MenuDataItem[] =>
    nodes
      .filter((node) => node.visible !== 1)
      .map((node) => {
        /* 目录节点：记录「目录路径 → 第一个叶子路径」，供菜单点击跳转（避免目录 404） */
        if (node.children?.length && node.url) {
          const firstLeaf = findFirstLeaf(node.children);
          if (firstLeaf) redirectMap[node.url] = firstLeaf;
        }

        /* 普通节点：path、name、icon、children */
        const item: MenuDataItem = { path: node.url, name: node.name };
        const Icon = getIconComponent(node.icon);
        if (Icon) item.icon = <Icon />;
        if (node.children?.length) item.children = toItems(node.children);
        return item;
      });

  return { items: toItems(menus), redirectMap };
}
