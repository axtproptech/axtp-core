import { AnimatedIconStockShare } from "@/app/components/animatedIcons/animatedIconStockShare";
import { useTranslation } from "next-i18next";
import { useNotification } from "@/app/hooks/useNotification";
import { useState } from "react";
import { useAccount } from "@/app/hooks/useAccount";
import { Button, Input } from "react-daisyui";
import { Address } from "@signumjs/core";
import { useAppDispatch } from "@/states/hooks";
import { accountActions } from "@/app/states/accountState";

export const Home = () => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotification();
  const { getKeys, accountAddress, accountId } = useAccount();
  const [pin, setPin] = useState("");
  const dispatch = useAppDispatch();

  const handleOnClickConfirm = async () => {
    try {
      const { publicKey } = await getKeys(pin);
      const id = Address.fromPublicKey(publicKey).getNumericId();
      if (id === accountId) {
        showSuccess("That worked");
      }
    } catch (e: any) {
      showError(e);
    }
  };

  const handleOnClickDisconnect = async () => {
    dispatch(accountActions.resetAccount());
  };

  return (
    <div className="my-5">
      <div className="w-[240px] mx-auto">
        <AnimatedIconStockShare loopDelay={5000} touchable />
      </div>
      <div className="prose text-center mx-auto">
        <h2>{t("good_things")}</h2>
        {accountAddress && (
          <>
            <p>You are connected as</p>
            <h3>{accountAddress}</h3>
            <Input
              size="lg"
              className="border-base-content"
              onChange={(e) => setPin(e.target.value)}
              value={pin}
            />
            <div className="mt-2">
              <Button color="ghost" onClick={handleOnClickDisconnect}>
                Disconnect
              </Button>
              <Button color="secondary" onClick={handleOnClickConfirm}>
                Confirm
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
