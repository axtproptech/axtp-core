import { Button } from "react-daisyui";
import { useTranslation } from "next-i18next";
import { RiWallet3Line } from "react-icons/ri";
import { useAppContext } from "@/app/hooks/useAppContext";
import Link from "next/link";

export const ShowAccountButton = () => {
  const { t } = useTranslation();
  const { TrackingEventService } = useAppContext();

  const handleOnClick = async () => {
    TrackingEventService.track({ msg: "Show Portfolio Pushed" });
  };

  return (
    <div className="animate-wiggle">
      <Link href={"/account"}>
        <Button
          color="accent"
          size="lg"
          onClick={handleOnClick}
          startIcon={<RiWallet3Line />}
        >
          {t("my_portfolio")}
        </Button>
      </Link>
    </div>
  );
};
