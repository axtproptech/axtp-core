import { useTranslation } from "next-i18next";
import { useAccount } from "@/app/hooks/useAccount";
import { StepProps } from "@/features/kyc/termsSigning/steps/stepProps";
import { useBottomNavigation } from "@/app/components/navigation/bottomNavigation";
import { useEffect } from "react";
import { RiArrowRightCircleLine, RiHome6Line } from "react-icons/ri";
import { voidFn } from "@/app/voidFn";
import { Fade } from "react-awesome-reveal";

export const StepIntro = (props: StepProps) => {
  const { t } = useTranslation();
  const { customer } = useAccount();
  const { setNavItems } = useBottomNavigation();

  useEffect(() => {
    setNavItems([
      {
        route: "/",
        label: t("home"),
        icon: <RiHome6Line />,
      },
      {
        label: "",
        disabled: true,
        hideLabel: true,
        onClick: voidFn,
        icon: <></>,
      },
      {
        label: t("next"),
        icon: <RiArrowRightCircleLine />,
        color: "secondary",
        onClick: props.nextStep,
      },
    ]);
  }, []);

  return (
    <Fade className="opacity-0">
      <section>
        <h2>{t("kyc-sign-document-title")}</h2>
        <p className="text-justify">
          {t("kyc-sign-document-intro", { name: customer?.firstName })}
        </p>
      </section>
    </Fade>
  );
};
