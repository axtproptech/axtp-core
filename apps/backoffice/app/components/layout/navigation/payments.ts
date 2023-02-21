import { IconUserPlus, IconCoin, IconBusinessplan } from "@tabler/icons";
import { NavigationItem } from "@/types/navigationItem";

export const payments: NavigationItem = {
  id: "payments",
  title: "Payments",
  type: "group",
  children: [
    {
      id: "manage-payments",
      title: "Manage Payments",
      type: "item",
      url: "/admin/payments",
      icon: IconBusinessplan,
      breadcrumbs: false,
    },
    {
      id: "manage-pending-payments",
      title: "Pending Payments",
      type: "item",
      url: "/admin/payments/pending",
      icon: IconCoin,
      breadcrumbs: false,
    },
  ],
};
