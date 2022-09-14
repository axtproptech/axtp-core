import { useTranslation } from "next-i18next";
import { FC } from "react";
import { AnimatedIconWarn } from "@/app/components/animatedIcons/animatedIconWarn";
import { Button } from "react-daisyui";
import { RiClipboardLine } from "react-icons/ri";
import { useNotification } from "@/app/hooks/useNotification";
import { HintBox } from "@/app/components/hintBox";

interface Props {
  seed: string;
}

export const StepViewSeed: FC<Props> = ({ seed }) => {
  const { t } = useTranslation();
  const { showInfo, showWarning } = useNotification();

  const handleOnCLick = async () => {
    try {
      await navigator.clipboard.writeText(seed);
      showInfo(t("copy_clipboard_success"));
    } catch (e) {
      showWarning(t("copy_clipboard_failure"));
    }
  };

  return (
    <div className="flex flex-col justify-between text-center h-[80vh] relative prose w-full mx-auto">
      <section>
        <h2>{t("your_seed")}</h2>
      </section>
      <section className="relative">
        <div className="relative w-full lg:w-[75%] mx-auto text-justify">
          <div className="border border-base-content p-4 rounded relative text-xl">
            {seed}
          </div>
          <div className="text-right w-full my-2">
            <Button color="secondary" onClick={handleOnCLick}>
              <RiClipboardLine className="mr-2" />
              {t("copy")}
            </Button>
          </div>
        </div>
      </section>
      <section>
        <HintBox text={""}>
          <div className="w-20 m-auto absolute bg-base-100 top-[-48px]">
            <AnimatedIconWarn touchable loopDelay={3000} />
          </div>
          <p>{t("your_seed_hint")}</p>
        </HintBox>
      </section>
    </div>
  );
};
