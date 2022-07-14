import { IconBuildingBank } from "@tabler/icons";

export const pools = {
  id: "liquidity",
  title: "Liquidity",
  type: "group",
  children: [
    {
      id: "view-liquidity",
      title: "Manage Liquidity",
      type: "item",
      url: "/admin/liquididty",
      icon: IconBuildingBank,
      breadcrumbs: false,
    },
  ],
};
