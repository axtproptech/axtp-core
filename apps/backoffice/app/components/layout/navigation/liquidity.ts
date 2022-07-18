import { IconAffiliate, IconBuildingBank } from "@tabler/icons";

export const liquidity = {
  id: "liquidity",
  title: "Liquidity",
  type: "group",
  children: [
    {
      id: "view-liquidity",
      title: "Manage Liquidity",
      type: "item",
      url: "/admin/liquidity",
      icon: IconBuildingBank,
      breadcrumbs: false,
    },
    {
      id: "view-contract",
      title: "View Master Contract",
      type: "item",
      url: "/admin/liquidity/master-contract",
      icon: IconAffiliate,
      breadcrumbs: false,
    },
  ],
};
