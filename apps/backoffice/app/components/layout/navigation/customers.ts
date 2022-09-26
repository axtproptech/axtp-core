import { IconUsers } from "@tabler/icons";

export const customers = {
  id: "customers",
  title: "Token Holders",
  type: "group",
  children: [
    {
      id: "manage-customers",
      title: "Manage Token Holders",
      type: "item",
      url: "/admin/customers",
      icon: IconUsers,
      breadcrumbs: false,
    },
    // {
    //   id: "view-contract",
    //   title: "View Master Contract",
    //   type: "item",
    //   url: "/admin/liquidity/master-contract",
    //   icon: IconAffiliate,
    //   breadcrumbs: false,
    // },
  ],
};
