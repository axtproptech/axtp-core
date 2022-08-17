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
const DefaultNav = [
  {
    route: "/",
    icon: <RiHome6Line />,
  },
  {
    route: "/stats",
    icon: <RiLineChartLine />,
  },
  {
    route: "/account",
    icon: <RiAccountBoxLine />,
  },
];

interface Props extends ChildrenProps {
  bottomNav?: BottomNavigationItem[];
}

export const Layout: FC<Props> = ({ children, bottomNav }) => {
  return (
    <Container>
      <Notification />
      <Body>{children}</Body>
      <BottomNavigation nav={bottomNav || DefaultNav} />
    </Container>
  );
};
