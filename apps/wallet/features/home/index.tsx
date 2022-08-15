import { AnimatedIconStockShare } from "@/app/components/animatedIcons/animatedIconStockShare";
import { useTranslation } from "next-i18next";

export const Home = () => {
  const { t } = useTranslation();
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
