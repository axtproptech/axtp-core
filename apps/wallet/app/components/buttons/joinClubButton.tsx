import { Button } from "react-daisyui";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export const JoinClubButton = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleOnJoinClick = async () => {
    await router.push("/kyc/new");
  };

  return (
    <div className="animate-wiggle">
      <Button color="primary" size="lg" onClick={handleOnJoinClick}>
        {t("join_club")}
      </Button>
    </div>
  );
};
