import { IconArrowBigDownLines, IconUserCheck, IconGauge } from "@tabler/icons";
import { NavigationItem } from "@/types/navigationItem";

export const withdrawals: NavigationItem = {
  id: "withdrawals",
  title: "Withdrawals",
  type: "group",
  children: [
    {
      id: "withdrawal-status",
      title: "Status",
      type: "item",
      url: "/admin/withdrawals",
      icon: IconGauge,
      breadcrumbs: false,
    },
    {
      id: "manage-withdrawals-requests",
      title: "Requests",
      type: "item",
      url: "/admin/withdrawals/requests",
      icon: IconArrowBigDownLines,
      breadcrumbs: false,
      permissions: ["creditor", "master"],
    },
    {
      id: "manage-creditors",
      title: "Manage Creditors",
      type: "item",
      url: "/admin/withdrawals/creditors",
      icon: IconUserCheck,
      breadcrumbs: false,
      permissions: ["master"],
    },
  ],
};
