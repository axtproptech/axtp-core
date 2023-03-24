import { FC } from "react";
import { ChildrenProps } from "@/types/childrenProps";
import { Container } from "./container";
import {
  BottomNavigation,
  BottomNavigationItem,
} from "../navigation/bottomNavigation";
import { Body } from "./body";
import { RiHome6Line, RiWallet3Line } from "react-icons/ri";
import { Notification } from "@/app/components/notification";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { useAppContext } from "@/app/hooks/useAppContext";

// @ts-ignore
const PWAPrompt = dynamic(() => import("react-ios-pwa-prompt"), { ssr: false });

interface Props extends ChildrenProps {
  bottomNav?: BottomNavigationItem[];
  noBody?: boolean;
}

export const Layout: FC<Props> = ({ children, bottomNav, noBody = false }) => {
  const { t } = useTranslation();
  const DefaultNav: BottomNavigationItem[] = [
    {
      route: "/",
      label: t("home"),
      icon: <RiHome6Line />,
    },
    {
      route: "/account",
      label: t("account"),
      icon: <RiWallet3Line />,
    },
  ];

  return (
    <Container>
      {noBody ? children : <Body>{children}</Body>}
      <BottomNavigation nav={bottomNav || DefaultNav} />
      <Notification />
      <PWAPrompt
        /* @ts-ignore */
        copyTitle={t("pwa-ios-copy-title")}
        copyBody={t("pwa-ios-copy-body")}
        copyAddHomeButtonLabel={t("pwa-ios-add-button-label")}
        copyShareButtonLabel={t("pwa-ios-share-button-label")}
        copyClosePrompt={t("close")}
        permanentlyHideOnDismiss={false}
        timesToShow={3}
      />
    </Container>
  );
};
