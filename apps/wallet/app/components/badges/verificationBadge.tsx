import { memo } from "react";
import { Badge } from "react-daisyui";
import { useTranslation } from "next-i18next";
import { VerificationLevelType } from "@/types/verificationLevelType";
import { useRouter } from "next/router";

interface Props {
  verificationLevel: VerificationLevelType;
}

export const VerificationBadge = memo<Props>(function VerificationStatus({
  verificationLevel,
}) {
  const { t } = useTranslation();
  const router = useRouter();

  const handleRegister = () => {
    router.push("/kyc/new");
  };

  switch (verificationLevel) {
    case "Pending":
      return <Badge color="success">{t("kyc-analyzing")}</Badge>;
    case "Level1":
      return <Badge color="info">{t("kyc-accepted")}&nbsp;L1</Badge>;
    case "Level2":
      return <Badge color="info">{t("kyc-accepted")}&nbsp;L2</Badge>;
    case "NotVerified":
    default:
      return (
        <Badge color="warning" onClick={handleRegister}>
          {t("kyc-not-registered")}
        </Badge>
      );
  }
});
