import { FC } from "react";
import { ChildrenProps } from "@/types/childrenProps";
import { Container } from "./container";
import {
  BottomNavigation,
  BottomNavigationItem,
} from "../navigation/bottomNavigation";
import { Body } from "./body";
import { RiHome6Line, RiLineChartLine, RiAccountBoxLine } from "react-icons/ri";
import { Notification } from "@/app/components/notification";

// TODO: configure correct
const DefaultNav: BottomNavigationItem[] = [
  {
    route: "/",
    label: "Home",
    icon: <RiHome6Line />,
  },
  {
    route: "/stats",
    label: "Stats",
    icon: <RiLineChartLine />,
  },
  {
    route: "/account",
    label: "Account",
    icon: <RiAccountBoxLine />,
  },
];

interface Props extends ChildrenProps {
  bottomNav?: BottomNavigationItem[];
  noBody?: boolean;
}

export const Layout: FC<Props> = ({ children, bottomNav, noBody = false }) => {
  return (
    <Container>
      <Notification />
      {noBody ? children : <Body>{children}</Body>}
      <BottomNavigation nav={bottomNav || DefaultNav} />
    </Container>
  );
};
