import { FC, useMemo } from "react";
import { PoolContractData } from "@/types/poolContractData";
import { useTranslation } from "next-i18next";
import { Button } from "react-daisyui";
import { openExternalUrl } from "@/app/openExternalUrl";
import { useRouter } from "next/router";
import { useAccount } from "@/app/hooks/useAccount";
import { useAppContext } from "@/app/hooks/useAppContext";
import { RegisterCustomerButton } from "@/app/components/buttons/registerCustomerButton";
import { HintBox } from "@/app/components/hintBox";
import { AnimatedIconCoins } from "@/app/components/animatedIcons/animatedIconCoins";
import { AnimatedIconError } from "@/app/components/animatedIcons/animatedIconError";
import { VerificationStatus } from "@/app/components/verificationStatus";

interface Props {
  poolData: PoolContractData;
}

export const PoolActions: FC<Props> = ({ poolData }) => {
  const { t } = useTranslation();
  const { TrackingEventService } = useAppContext();
  const router = useRouter();
  const { accountPublicKey, customer } = useAccount();

  const handleOpenDocumentation = () => {
    TrackingEventService.track({ msg: "Click Open Whitepaper" });
    const poolId = poolData.poolId;
    openExternalUrl("");
  };

  const handleAcquireShare = async () => {
    TrackingEventService.track({
      msg: "Click Buy Token",
      detail: { poolId: poolData.poolId, poolName: poolData.token.name },
    });
    await router.push(`/pool/${poolData.poolId}/acquisition`);
  };

  const handleSetupAccount = async () => {
    TrackingEventService.track({ msg: "Click Setup Account" });
    await router.push(`/account/setup`);
  };

  const handleDoKyc = async () => {
    TrackingEventService.track({ msg: "Click Register Customer" });
    await router.push(`/kyc/new`);
  };

  const { canBuy, reasonKey } = useMemo(() => {
    let reasonKey = "";
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

  return (
    <div>
      <div className="p-2 flex-col flex mx-auto justify-center w-fit">
        {canBuy && (
          <Button color="primary" onClick={handleAcquireShare}>
            {t("buy_token")}
          </Button>
        )}
        {!canBuy && (
          <HintBox>
            <div className="relative">
              <div className="absolute w-[64px] top-[-48px] bg-base-100">
                <AnimatedIconError loopDelay={5000} touchable />
              </div>
              <div className="flex flex-col justify-center text-center">
                <p className="text-lg font-bold py-4">
                  {t("buy_you_are_not_eligible")}
                </p>
                {reasonKey && (
                  <p className="text-sm text-error text-center mb-4">
                    {t(reasonKey)}
                  </p>
                )}
                {reasonKey === "buy_token_no_account" && (
                  <Button color="primary" onClick={handleSetupAccount}>
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
        )}
        {/*<Button*/}
        {/*  className="ml-4"*/}
        {/*  color="accent"*/}
        {/*  onClick={handleOpenDocumentation}*/}
        {/*>*/}
        {/*  {t("show_doc")}*/}
        {/*</Button>*/}
      </div>
    </div>
  );
};
