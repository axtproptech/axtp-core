import { FC, useMemo } from "react";
import { ChildrenProps } from "@/types/childrenProps";
import { useAccount } from "@/app/hooks/useAccount";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useRouter } from "next/router";
import { HintBox } from "@/app/components/hintBox";
import { AnimatedIconError } from "@/app/components/animatedIcons/animatedIconError";
import { Button } from "react-daisyui";
import { RegisterCustomerButton } from "@/app/components/buttons/registerCustomerButton";
import { VerificationStatus } from "@/app/components/verificationStatus";
import { useTranslation } from "next-i18next";
import { RiWallet3Line } from "react-icons/ri";
import { AnimatedIconContract } from "@/app/components/animatedIcons/animatedIconContract";

export const IfEligibleForAcquisition: FC<ChildrenProps> = ({ children }) => {
  const { accountPublicKey, customer } = useAccount();
  const { TrackingEventService } = useAppContext();
  const router = useRouter();
  const { t } = useTranslation();

  const handleSetupAccount = async () => {
    TrackingEventService.track({ msg: "Click Setup Account" });
    await router.push(`/account/setup`);
  };

  const { canBuy, reasonKey } = useMemo(() => {
    let reasonKey = "buy_token_not_registered";

    if (!customer) {
      reasonKey = "buy_token_not_registered";
    } else if (!customer?.verificationLevel.startsWith("Level")) {
      reasonKey = "buy_token_not_verified";
    } else if (customer?.isBlocked) {
      reasonKey = "buy_token_blocked";
    } else if (!customer?.isActive) {
      reasonKey = "buy_token_not_active";
    } else if (!accountPublicKey) {
      reasonKey = "buy_token_no_account";
    }

    return {
      canBuy: reasonKey.length === 0,
      reasonKey,
    };
  }, [accountPublicKey, customer]);

  if (canBuy) {
    return <>{children}</>;
  }

  return (
    <div className="mt-[25%] px-4">
      <HintBox>
        <div className="relative">
          <div className="absolute w-[64px] top-[-48px] bg-base-100">
            <AnimatedIconContract loopDelay={5000} touchable />
          </div>
          <div className="flex flex-col justify-center text-center">
            <p className="py-4">{t("buy_you_are_not_eligible")}</p>
            {reasonKey && (
              <p className="text-sm text-error text-center mb-4">
                {t(reasonKey)}
              </p>
            )}
            {reasonKey === "buy_token_no_account" && (
              <Button
                className="w-fit mx-auto animate-wiggle"
                color="primary"
                onClick={handleSetupAccount}
                startIcon={<RiWallet3Line />}
              >
                {t("setup_account")}
              </Button>
            )}
            {reasonKey === "buy_token_not_registered" && (
              <RegisterCustomerButton />
            )}
            {reasonKey === "buy_token_not_verified" && (
              <VerificationStatus
                verificationLevel={customer!.verificationLevel}
              />
            )}
          </div>
        </div>
      </HintBox>
    </div>
  );
};
