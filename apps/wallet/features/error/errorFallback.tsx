import { FC } from "react";
import { AnimatedIconError } from "@/app/components/animatedIcons/animatedIconError";
import { useTranslation } from "next-i18next";
import { useAppContext } from "@/app/hooks/useAppContext";
import { FallbackProps } from "react-error-boundary";
import { Button } from "react-daisyui";
import { RiHome6Line, RiRestartLine } from "react-icons/ri";
import { Container } from "@/app/components/layout/container";
import {
  BottomNavigation,
  BottomNavigationItem,
} from "@/app/components/navigation/bottomNavigation";

const FallbackNav: BottomNavigationItem[] = [
  {
    route: "/",
    label: "Home",
    icon: <RiHome6Line />,
  },
];

export const ErrorFallback: FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const { t } = useTranslation();
  const { Ledger } = useAppContext();

  return (
    <Container>
      <div className="p-4">
        <div className="w-[240px] mx-auto">
          <AnimatedIconError loopDelay={5000} touchable />
        </div>
        <article className="prose mx-auto">
          <h2 className="text-center">{t("500_title")}</h2>
          {!Ledger.IsTestNet ? (
            <div className="my-4 mockup-code bg-accent">
              <code className="bg-accent">
                Message: {error.message} <br />
              </code>
              <code className="mt-8 bg-accent">
                Stack: {error.stack ? error.stack.substr(0, 384) : ""}...
              </code>
            </div>
          ) : (
            <>
              <p className="text-justify md:text-left">{t("500_hint")}</p>
              <p>{t("500_hint2")}</p>
            </>
          )}
        </article>
        <div className="mt-8 w-full flex flex-row justify-evenly items-center">
          <Button color="warning" onClick={resetErrorBoundary}>
            <RiRestartLine className="mr-2" />
            {t("try_again")}
          </Button>
        </div>
      </div>
      <BottomNavigation nav={FallbackNav} />
    </Container>
  );
};
