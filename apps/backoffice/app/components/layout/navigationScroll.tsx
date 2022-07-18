import { FC, ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import { ChildrenProps } from "@/types/childrenProps";

export const NavigationScroll: FC<ChildrenProps<ReactElement>> = ({
  children,
}) => {
  const router = useRouter();
  const { pathname } = router;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return children || null;
};
