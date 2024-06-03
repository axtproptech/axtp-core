import { useTranslation } from "next-i18next";
import { useAccount } from "@/app/hooks/useAccount";

export const StepIntro = () => {
  const { t } = useTranslation();
  const { customer } = useAccount();

  return (
    <section>
      <h2>{t("kyc-sign-document-title")}</h2>
      <p className="text-justify">
        {t("kyc-sign-document-intro", { name: customer?.firstName })}
      </p>
    </section>
  );
};
