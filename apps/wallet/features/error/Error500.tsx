import { useTranslation } from "next-i18next";
import { AnimatedIconError } from "@/app/components/animatedIcons/animatedIconError";

export const Error500 = () => {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <div className="w-[240px] mx-auto">
        <AnimatedIconError loopDelay={5000} touchable />
      </div>
      <article className="prose mx-auto">
        <h2 className="text-center">{t("500_title")}</h2>
        <p className="text-justify md:text-left">{t("500_hint")}</p>
        <p>{t("500_hint2")}</p>
      </article>
    </div>
  );
};
