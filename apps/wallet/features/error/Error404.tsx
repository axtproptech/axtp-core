import { AnimatedIconRoadBlock } from "@/app/components/animatedIcons/animatedIconRoadBlock";
import { useTranslation } from "next-i18next";

export const Error404 = () => {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <div className="w-[240px] mx-auto">
        <AnimatedIconRoadBlock loopDelay={5000} touchable />
      </div>
      <article className="prose mx-auto">
        <h2 className="text-center">{t("404_title")}</h2>
        <p className="text-justify md:text-left">{t("404_hint")}</p>
        <p>{t("404_hint2")}</p>
      </article>
    </div>
  );
};
