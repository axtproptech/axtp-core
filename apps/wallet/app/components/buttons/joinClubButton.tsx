import { Button } from "react-daisyui";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { RiGroupLine } from "react-icons/ri";
import { useAppContext } from "@/app/hooks/useAppContext";

export const JoinClubButton = () => {
  const { t } = useTranslation();
  const { TrackingEventService } = useAppContext();
  const router = useRouter();

  const handleOnJoinClick = async () => {
    TrackingEventService.track({ msg: "Join Button Pushed" });
    await router.push("/kyc");
  };

  return (
    <div className="animate-wiggle">
      <Button
        color="primary"
        size="lg"
        onClick={handleOnJoinClick}
        startIcon={<RiGroupLine />}
      >
        {t("join_club")}
      </Button>
    </div>
  );
};
