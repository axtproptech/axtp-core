import { Button } from "react-daisyui";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { RiGroupLine } from "react-icons/ri";

export const JoinClubButton = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleOnJoinClick = async () => {
    await router.push("/kyc/new");
  };

  return (
    <div className="animate-wiggle">
      <Button color="primary" size="lg" onClick={handleOnJoinClick}>
        <RiGroupLine className="mr-2" size="28" />
        {t("join_club")}
      </Button>
    </div>
  );
};
