import { useTranslation } from "next-i18next";
import { FC, useEffect } from "react";
import { AnimatedIconError } from "@/app/components/animatedIcons/animatedIconError";

interface Props {
  seed: string;
}

export const StepThree: FC<Props> = ({ seed }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-center content-center text-center h-[90vh] relative prose max-w-none w-full">
      <section>
        <h2>{t("your_seed")}</h2>
      </section>
      <section className="relative">
        <p className="w-[75%] m-auto text-justify border border-base-content p-4 rounded relative  text-xl">
          {seed}
        </p>
      </section>
      <section className="w-[75%] m-auto text-justify border border-base-content/50 px-4 py-2 rounded relative">
        <div className="flex flex-col content-center">
          <div className="w-20 m-auto absolute bg-base-100 top-[-48px]">
            <AnimatedIconError touchable loopDelay={3000} />
          </div>
          <p>{t("your_seed_hint")}</p>
        </div>
      </section>
    </div>
  );
};
