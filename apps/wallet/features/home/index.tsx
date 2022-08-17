import { AnimatedIconStockShare } from "@/app/components/animatedIcons/animatedIconStockShare";
import { useTranslation } from "next-i18next";
import { useNotification } from "@/app/hooks/useNotification";
import { useEffect } from "react";

export const Home = () => {
  const { t } = useTranslation();
  const { showSuccess } = useNotification();

  useEffect(() => {
    showSuccess("Test messane");
  }, []);

  return (
    <div className="my-5">
      <div className="w-[240px] mx-auto">
        <AnimatedIconStockShare loopDelay={5000} touchable />
      </div>
      <div className="prose">
        <h1>{t("good_things")}</h1>
      </div>
    </div>
  );
};
