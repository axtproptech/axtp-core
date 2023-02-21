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
