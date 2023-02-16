import { FC } from "react";
import { AnimatedIconError } from "@/app/components/animatedIcons/animatedIconError";
import { useTranslation } from "next-i18next";
import { useAppContext } from "@/app/hooks/useAppContext";
import { FallbackProps } from "react-error-boundary";
import { useRouter } from "next/router";
import { Button } from "react-daisyui";
import { RiHome6Line, RiRestartLine } from "react-icons/ri";

export const ErrorFallback: FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const { t } = useTranslation();
  const { Ledger } = useAppContext();
  const router = useRouter();

  const goBackHome = () => {
    router.replace("/");
  };

  return (
    <div className="p-4">
      <div className="w-[240px] mx-auto">
        <AnimatedIconError loopDelay={5000} touchable />
      </div>
      <article className="prose mx-auto">
        <h2 className="text-center">{t("500_title")}</h2>
        {Ledger.IsTestNet ? (
          <p>
            <pre>{error.message}</pre>
          </p>
        ) : (
          <>
            <p className="text-justify md:text-left">{t("500_hint")}</p>
            <p>{t("500_hint2")}</p>
          </>
        )}
        <Button onClick={goBackHome}>
          <RiHome6Line className="mr-2" />
          {t("home")}
        </Button>
        <Button color="warning" onClick={resetErrorBoundary}>
          <RiRestartLine className="mr-2" />
          {t("try_again")}
        </Button>
      </article>
    </div>
  );
};
