import { useTranslation } from "next-i18next";
import { FC } from "react";
import { AnimatedIconError } from "@/app/components/animatedIcons/animatedIconError";
import { Button } from "react-daisyui";
import { RiClipboardLine } from "react-icons/ri";
import { useNotification } from "@/app/hooks/useNotification";

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
        <div className="relative w-[75%] mx-auto text-justify">
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
