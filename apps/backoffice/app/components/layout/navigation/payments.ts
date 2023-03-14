import {
  IconUserPlus,
  IconCoin,
  IconBusinessplan,
  IconCirclePlus,
} from "@tabler/icons";
import { NavigationItem } from "@/types/navigationItem";

export const payments: NavigationItem = {
  id: "payments",
  title: "Payments",
  type: "group",
  children: [
    {
      id: "register-payment",
      title: "Register Payment",
      type: "item",
      url: "/admin/payments/new",
      icon: IconCirclePlus,
      breadcrumbs: false,
    },
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
