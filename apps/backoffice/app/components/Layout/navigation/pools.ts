import { IconBuildingCommunity, IconNewSection } from "@tabler/icons";

export const pools = {
  id: "pools",
  title: "Pools",
  type: "group",
  children: [
    {
      id: "all-pools",
      title: "All Pools",
      type: "item",
      url: "/pools",
      icon: IconBuildingCommunity,
      breadcrumbs: false,
    },
    {
      id: "create-pool",
      title: "Create Pool",
      type: "item",
      url: "/pools/new",
      icon: IconNewSection,
      breadcrumbs: false,
    },
  ],
};
