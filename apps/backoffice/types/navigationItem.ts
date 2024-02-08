import { TablerIcon } from "@tabler/icons";
import { PermissionRole } from "@/types/permissionRole";

export type NavigationItem =
  | NavigationGroupItem
  | NavigationCollapseItem
  | NavigationIconItem;

interface NavigationItemBase {
  id: string;
  title: string;
  type: "group" | "item" | "collapse";
}

export interface NavigationGroupItem extends NavigationItemBase {
  type: "group";
  caption?: string;
  children: NavigationItem[];
}

export interface NavigationCollapseItem extends NavigationItemBase {
  type: "collapse";
  icon: TablerIcon;
  children: NavigationItem[];
}

export interface NavigationIconItem extends NavigationItemBase {
  type: "item";
  url: string;
  icon?: TablerIcon;
  breadcrumbs?: boolean;
  target?: boolean;
  external?: boolean;
  permissions?: PermissionRole[];
}
