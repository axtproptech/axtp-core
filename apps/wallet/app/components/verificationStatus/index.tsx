import { memo } from "react";
import { Steps } from "react-daisyui";
import { useTranslation } from "next-i18next";
import { VerificationLevelType } from "@/types/verificationLevelType";

interface Props {
  verificationLevel: VerificationLevelType;
  hideIfAccepted?: boolean;
}

export const VerificationStatus = memo<Props>(function VerificationStatus({
  verificationLevel,
  hideIfAccepted = false,
}) {
  const { t } = useTranslation();

  switch (verificationLevel) {
    case "Pending":
      return (
        <Steps>
          <Steps.Step color="success" value="✓">
            {t("kyc-registered")}
          </Steps.Step>
          <Steps.Step color="success" value="⏳">
            <span className="px-4 lg:px-8">{t("kyc-analyzing")}</span>
          </Steps.Step>
          <Steps.Step value="">{t("kyc-accepted")}</Steps.Step>
        </Steps>
      );
    case "Level1":
      return hideIfAccepted ? null : (
        <Steps>
          <Steps.Step color="success" value="✓">
            {t("kyc-registered")}
          </Steps.Step>
          <Steps.Step color="success" value="✓">
            <span className="px-4 lg:px-8">{t("kyc-analyzing")}</span>
          </Steps.Step>
          <Steps.Step color="success" value="L1">
            {t("kyc-accepted")}
          </Steps.Step>
        </Steps>
      );
    case "Level2":
      return hideIfAccepted ? null : (
        <Steps>
          <Steps.Step color="success" value="✓">
            {t("kyc-registered")}
          </Steps.Step>
          <Steps.Step color="success" value="✓">
            <span className="px-4 lg:px-8">{t("kyc-analyzing")}</span>
          </Steps.Step>
          <Steps.Step color="success" value="L2">
            {t("kyc-accepted")}
          </Steps.Step>
        </Steps>
      );
    case "NotVerified":
    default:
      return (
        <Steps>
          <Steps.Step color="primary" value="!">
            {t("kyc-registered")}
          </Steps.Step>
          <Steps.Step value="">
            <span className="px-4 lg:px-8">{t("kyc-analyzing")}</span>
          </Steps.Step>
          <Steps.Step value="">{t("kyc-accepted")}</Steps.Step>
        </Steps>
      );
  }
});
