import { TextLogo } from "@/app/components/logo/textLogo";
import { HintBox } from "@/app/components/hintBox";
import QRCode from "react-qr-code";
import { useTranslation } from "next-i18next";

interface Props {
  seed: string;
  address: string;
}
export const PrintableSeedDocument = ({ seed, address }: Props) => {
  const { t } = useTranslation();
  return (
    <div className="hidden print:block flex flex-col justify-between relative prose w-full mx-auto bg-white text-black p-0 m-0">
      <section className="text-center">
        <TextLogo className="w-1/2 mx-auto" />
        <h2>{t("your_seed")}</h2>
        <h3>
          {t("your_address")}&nbsp;{address}
        </h3>
      </section>
      <section>
        <HintBox text={""}>
          <div className="text-xl">{seed}</div>
        </HintBox>
        <div className="p-2 my-2 mx-auto w-1/2 bg-white">
          <QRCode
            value={seed}
            size={200}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            viewBox={`0 0 200 200`}
          />
        </div>
      </section>
      <section>
        <p className="font-bold">{t("your_seed_print_hint")}</p>
        <div className="mt-2 bg-white text-xs">
          <img
            className="h-[32px]"
            src="/assets/img/signum-logo-black.svg"
            alt="Signum Logo"
          />
          <p>{t("your_seed_signum_hint")}</p>
          <div>Sustainable and Secure Blockchain Platform</div>
          <div>https://signum.network</div>
        </div>
      </section>
    </div>
  );
};
