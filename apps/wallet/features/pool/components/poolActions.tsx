import { FC, useMemo } from "react";
import { PoolContractData } from "@/types/poolContractData";
import { useTranslation } from "next-i18next";
import { Button } from "react-daisyui";
import { openExternalUrl } from "@/app/openExternalUrl";
import { useRouter } from "next/router";
import { useAccount } from "@/app/hooks/useAccount";
import { useAppContext } from "@/app/hooks/useAppContext";

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
    let canBuy = true;

    if (!customer) {
      reasonKey = "buy_token_not_registered";
      canBuy &&= false;
    }

    if (!customer?.verificationLevel.startsWith("Level")) {
      reasonKey = "buy_token_not_verified";
      canBuy &&= false;
    }

    if (customer?.isBlocked) {
      reasonKey = "buy_token_blocked";
      canBuy &&= false;
    }

    if (!customer?.isActive) {
      reasonKey = "buy_token_not_active";
      canBuy &&= false;
    }

    if (!customer?.verificationLevel.startsWith("Level")) {
      reasonKey = "buy_token_not_verified";
      canBuy &&= false;
    }
    if (!accountPublicKey) {
      reasonKey = "buy_token_no_account";
      canBuy &&= false;
    }
    return {
      canBuy,
      reasonKey,
    };
  }, [accountPublicKey, customer]);

  return (
    <div>
      <div className="p-2 flex-row flex mx-auto justify-center">
        {canBuy && (
          <Button color="primary" onClick={handleAcquireShare}>
            {t("buy_token")}
          </Button>
        )}
        {reasonKey === "buy_token_no_account" && (
          <Button className="ml-4" color="primary" onClick={handleSetupAccount}>
            {t("setup_account")}
          </Button>
        )}
        {reasonKey === "buy_token_not_registered" && (
          <Button className="ml-4" color="primary" onClick={handleDoKyc}>
            {t("join_club")}
          </Button>
        )}
        {/*<Button*/}
        {/*  className="ml-4"*/}
        {/*  color="accent"*/}
        {/*  onClick={handleOpenDocumentation}*/}
        {/*>*/}
        {/*  {t("show_doc")}*/}
        {/*</Button>*/}
      </div>
      {reasonKey && (
        <p className="text-sm text-error text-center my-1">{t(reasonKey)}</p>
      )}
    </div>
  );
};
