/**
 * @fileoverview 菜单适配工具
 * @description 后端纯菜单树 → ProLayout 菜单数据，并生成目录跳转映射
 * @author xuxueli 2026-11-21
 */
import type { MenuDataItem } from '@ant-design/pro-components';
import { getIconComponent } from '@/utils/icon';

/**
 * 构建菜单：一次遍历同时产出「菜单数据」「目录→第一个叶子路径」映射与不可跳转目录集合
 *
 * 后端结构：纯业务菜单节点（type：0-目录、1-菜单），不含任何路由/组件语义；
 *   - visible=1 的隐藏菜单不参与渲染；
 *   - 目录：url 作为菜单路径并递归 children；无可见子菜单时仅展示、不可点击；
 *   - 菜单：url 作为跳转路径；
 *   - 图标：icon 字符串经 UI 图标库解析。
 *
 * @param menus 后端 /getMenus 返回的菜单树
 * @returns items：ProLayout 菜单数据；redirectMap：目录路径 → 第一个叶子路径；nonNavigablePaths：不可跳转的目录路径
 */
export function buildMenu(menus: API.MenuNode[]): {
  items: MenuDataItem[];
  redirectMap: Record<string, string>;
  nonNavigablePaths: Set<string>;
} {
  const redirectMap: Record<string, string> = {};
  /* 无可见子菜单的目录：仅展示标题与图标，不参与路由跳转（避免目录自身路径 404） */
  const nonNavigablePaths = new Set<string>();

  /* 查找子树中的第一个可跳转叶子路径（目录点击跳转用，跳过隐藏与空目录节点） */
  const findFirstLeaf = (nodes: API.MenuNode[]): string | undefined => {
    for (const node of nodes) {
      if (node.visible === 1) continue;
      /* 目录节点：递归向下查找，空目录跳过 */
      if (node.type === 0) {
        const leafPath = findFirstLeaf(node.children ?? []);
        if (leafPath) return leafPath;
        continue;
      }
      /* 叶子菜单：直接使用其路径 */
      return node.url;
    }
    return undefined;
  };

  /* 递归转换：过滤隐藏项、构造菜单项，并记录目录跳转映射 */
  const toItems = (nodes: API.MenuNode[]): MenuDataItem[] =>
    nodes
      .filter((node) => node.visible !== 1)
      .map((node) => {
        /* 普通节点：path、name、icon */
        const item: MenuDataItem = { path: node.url, name: node.name };
        const Icon = getIconComponent(node.icon);
        if (Icon) item.icon = <Icon />;

        /* 仅可见子菜单参与渲染与跳转映射 */
        const visibleChildren = (node.children ?? []).filter(
          (child) => child.visible !== 1,
        );
        if (visibleChildren.length) {
          /* 目录节点：记录「目录路径 → 第一个叶子路径」，供菜单点击跳转（避免目录 404） */
          if (node.type === 0 && node.url) {
            const firstLeaf = findFirstLeaf(visibleChildren);
            if (firstLeaf) redirectMap[node.url] = firstLeaf;
          }
          item.children = toItems(visibleChildren);
        } else if (node.type === 0 && node.url) {
          /* 无子菜单的目录：展示但不可点击 */
          nonNavigablePaths.add(node.url);
        }

        return item;
      });

  return { items: toItems(menus), redirectMap, nonNavigablePaths };
}
