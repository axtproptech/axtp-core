import { FC, useEffect } from "react";
import { ChildrenProps } from "@/types/childrenProps";
import { Container } from "./container";
import {
  BottomNavigation,
  BottomNavigationItem,
} from "../navigation/bottomNavigation";
import { Body } from "./body";
import { RiHome6Line, RiQuestionLine, RiWallet3Line } from "react-icons/ri";
import { Notification } from "@/app/components/notification";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { useAppContext } from "@/app/hooks/useAppContext";
import { openExternalUrl } from "@/app/openExternalUrl";
import { useRouter } from "next/router";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, easing: "ease", speed: 400 });

// @ts-ignore
const PWAPrompt = dynamic(() => import("react-ios-pwa-prompt"), { ssr: false });

interface Props extends ChildrenProps {
  bottomNav?: BottomNavigationItem[];
  noBody?: boolean;
}

export const Layout: FC<Props> = ({ children, bottomNav, noBody = false }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { Documents } = useAppContext();

  useEffect(() => {
    const handleRouteChange = () => {
      NProgress.start();
    };

    const handleRouteChangeComplete = () => {
      NProgress.done();
    };

    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeComplete);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeComplete);
    };
  }, [router]);

  const navigateToManual = () => {
    openExternalUrl(Documents.Manual);
  };

  const DefaultNav: BottomNavigationItem[] = [
    {
      route: "/",
      label: t("home"),
      icon: <RiHome6Line />,
    },
    {
      onClick: navigateToManual,
      label: t("manual"),
      icon: <RiQuestionLine />,
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
      {/* @ts-ignore */}
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
