import { IconDashboard } from "@tabler/icons";
const icons = { IconDashboard };

export const dashboard = {
  id: "dashboard",
  title: "Dashboard",
  type: "group",
  children: [
    {
      id: "default",
      title: "Dashboard",
      type: "item",
      url: "/admin",
      icon: icons.IconDashboard,
      breadcrumbs: false,
    },
  ],
};
