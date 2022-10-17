import { IconDashboard } from "@tabler/icons";
import { NavigationItem } from "@/types/navigationItem";

export const dashboard: NavigationItem = {
  id: "dashboard",
  title: "Dashboard",
  type: "group",
  children: [
    {
      id: "default",
      title: "Dashboard",
      type: "item",
      url: "/admin",
      icon: IconDashboard,
      breadcrumbs: false,
    },
  ],
};
