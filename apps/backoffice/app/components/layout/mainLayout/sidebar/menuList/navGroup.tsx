import { useTheme } from "@mui/material/styles";
import { Divider, List, Typography } from "@mui/material";
import { NavItem } from "./navItem";
import { NavCollapse } from "./navCollapse";
import { FC, useMemo } from "react";
import { useAppSelector } from "@/states/hooks";
import { selectAllPools } from "@/app/states/poolsState";
import { NavigationGroupItem } from "@/types/navigationItem";
import { IconBuilding, IconBuildingHospital } from "@tabler/icons";
import { useAccountPermission } from "@/app/hooks/useAccountPermission";
interface Props {
  item: NavigationGroupItem;
}

export const NavGroup: FC<Props> = ({ item }) => {
  const theme = useTheme();

  // This is not nice, but works
  const pools = useAppSelector(selectAllPools);

  const items = useMemo(() => {
    if (item.id === "pools" && item.children) {
      for (let pool of pools) {
        const itemId = `pool-${pool.poolId}`;

        if (!item.children.find(({ id }) => id === itemId)) {
          const isNew = !pool.token.name;

          item.children.push({
            id: itemId,
            type: "item",
            url: `/admin/pools/${pool.poolId}`,
            title: isNew ? "New Pool" : `Pool ${pool.token.name}`,
            icon: isNew ? IconBuildingHospital : IconBuilding,
            breadcrumbs: true,
          });
        }
      }
    }
    return item.children?.map((menu: any) => {
      switch (menu.type) {
        case "collapse":
          return <NavCollapse key={menu.id} menu={menu} level={1} />;
        case "item":
          return <NavItem key={menu.id} item={menu} level={1} />;
        default:
          return (
            <Typography key={menu.id} variant="h6" color="error" align="center">
              Menu Items Error
            </Typography>
          );
      }
    });
  }, [item.children, pools]);

  return (
    <>
      <List
        subheader={
          item.title && (
            <Typography
              variant="caption"
              // @ts-ignore
              sx={{ ...theme.typography.menuCaption }}
              display="block"
              gutterBottom
            >
              {item.title}
              {item.caption && (
                <Typography
                  variant="caption"
                  // @ts-ignore
                  sx={{ ...theme.typography.subMenuCaption }}
                  display="block"
                  gutterBottom
                >
                  {item.caption}
                </Typography>
              )}
            </Typography>
          )
        }
      >
        {items}
      </List>
      <Divider sx={{ mt: 0.25, mb: 1.25 }} />
    </>
  );
};
