import { Typography } from "@mui/material";
import { NavGroup } from "./navGroup";
import { menuItems } from "../../../navigation";

export const MenuList = () => (
  <>
    {menuItems.map((item) => {
      if (item.type === "group") {
        return <NavGroup key={item.id} item={item} />;
      } else {
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
      }
    })}
  </>
);
