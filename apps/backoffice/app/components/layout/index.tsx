import { Fragment, FC, useEffect } from "react";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useSnackbar } from "../../hooks/useSnackbar";
import { SnackBar } from "./components/SnackBar";
import { ChildrenProps } from "@/types/childrenProps";
import { MainLayout } from "./mainLayout";

export const Layout: FC<ChildrenProps> = ({ children }) => {
  const router = useRouter();

  const { hideSnackbar } = useSnackbar();

  useEffect(() => {
    NProgress.configure({ showSpinner: false, easing: "ease", speed: 400 });

    router.events.on("routeChangeStart", () => {
      NProgress.start();
    });

    router.events.on("routeChangeComplete", () => {
      NProgress.done();
    });

    router.events.on("routeChangeError", () => {
      NProgress.done();
    });

    hideSnackbar();
  }, [hideSnackbar, router.events]);

  return (
    <MainLayout>
      <SnackBar />
      {children}
    </MainLayout>
  );
};
