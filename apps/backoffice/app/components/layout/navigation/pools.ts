import { IconBuildingSkyscraper, IconNewSection } from "@tabler/icons";
import { NavigationItem } from "@/types/navigationItem";

export const pools: NavigationItem = {
  id: "pools",
  title: "Pools",
  type: "group",
  children: [
    {
      id: "create-pool",
      title: "Create Pool",
      type: "item",
      url: "/admin/pools/new",
      icon: IconNewSection,
      breadcrumbs: false,
    },
    {
      id: "all-pools",
      title: "All Pools",
      type: "item",
      url: "/admin/pools",
      icon: IconBuildingSkyscraper,
      breadcrumbs: false,
    },
  ],
};
