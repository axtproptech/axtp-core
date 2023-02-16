import { useTranslation } from "next-i18next";
import { FC } from "react";
import { AnimatedIconWarn } from "@/app/components/animatedIcons/animatedIconWarn";
import { HintBox } from "@/app/components/hintBox";
import { CopyButton } from "@/app/components/buttons/copyButton";
import QRCode from "react-qr-code";
import { TextLogo } from "@/app/components/logo/textLogo";

interface Props {
  seed: string;
}

export const StepViewSeed: FC<Props> = ({ seed }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="print:hidden flex flex-col justify-between text-center h-[80vh] relative prose w-full mx-auto">
        <section>
          <h2>{t("your_seed")}</h2>
        </section>
        <section className="relative">
          <div className="relative w-full lg:w-[75%] mx-auto text-justify">
            <div className="border border-base-content p-4 rounded relative text-xl">
              {seed}
            </div>
            <CopyButton textToCopy={seed} />
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

      {/* PRINT SECTION */}
      <div className="hidden print:block flex flex-col justify-between h-[80vh] relative prose w-full mx-auto text-black">
        <section className="text-center">
          <TextLogo className="w-1/2 mx-auto" />
          <h2>{t("your_seed")}</h2>
        </section>
        <section>
          <HintBox text={""}>
            <div className="text-xl">{seed}</div>
          </HintBox>
          <div className="p-2 my-2 mx-auto w-1/2 bg-white">
            <QRCode
              value={seed}
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox={`0 0 256 256`}
            />
          </div>
        </section>
        <section>
          <p>{t("your_seed_print_hint")}</p>
          <div className="mt-2 bg-white text-xs">
            <p>{t("your_seed_signum_hint")}</p>
            <img
              className="h-[32px]"
              src="/assets/img/signum-logo-black.svg"
              alt="Signum Logo"
            />
            <div>Sustainable and Secure Blockchain Platform</div>
            <div>https://signum.network</div>
          </div>
        </section>
      </div>
    </>
  );
};
