import { Button } from "react-daisyui";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useNotification } from "@/app/hooks/useNotification";

export const JoinClubButton = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { showInfo } = useNotification();

  const handleOnJoinClick = async () => {
    showInfo("Not implemented yet");
  };

  return (
    <div className="animate-wiggle">
      <Button color="primary" size="lg" onClick={handleOnJoinClick}>
        {t("join_club")}
      </Button>
    </div>
  );
};
