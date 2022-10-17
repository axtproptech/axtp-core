import { IconUsers, IconUserPlus } from "@tabler/icons";
import { NavigationItem } from "@/types/navigationItem";

export const customers: NavigationItem = {
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
    {
      id: "manage-pending-customers",
      title: "Pending Token Holders",
      type: "item",
      url: "/admin/customers/pending",
      icon: IconUserPlus,
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
