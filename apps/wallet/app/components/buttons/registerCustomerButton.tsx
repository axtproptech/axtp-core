import Link from "next/link";
import { Button } from "react-daisyui";
import { RiSurveyLine } from "react-icons/ri";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useTranslation } from "next-i18next";

export const RegisterCustomerButton = () => {
  const { t } = useTranslation();
  const { TrackingEventService } = useAppContext();
  const handleOnClick = async () => {
    TrackingEventService.track({ msg: "Register Customer Button Pushed" });
  };

  return (
    <div>
      <div className="animate-wiggle">
        <Link href="/kyc/registry">
          <Button
            color="primary"
            size="lg"
            startIcon={<RiSurveyLine />}
            onClick={handleOnClick}
          >
            {t("register_customer")}
          </Button>
        </Link>
      </div>
      <div className="text-center underline mt-2">
        <Link href="/kyc/link">{t("kyc_i_have_a_registry")}</Link>
      </div>
    </div>
  );
};
