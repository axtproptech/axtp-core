import { Button } from "react-daisyui";
import { accountActions } from "@/app/states/accountState";
import { useAccount } from "@/app/hooks/useAccount";
import { useAppDispatch } from "@/states/hooks";
import { useTranslation } from "next-i18next";
import { HintBox } from "@/app/components/hintBox";

export const Settings = () => {
  const { accountAddress } = useAccount();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleOnClickDisconnect = async () => {
    dispatch(accountActions.resetAccount());
  };

  return (
    <div>
      {accountAddress && (
        <div className="mt-2 mx-auto">
          <HintBox text={t("disconnect_hint")}>
            <div className="text-center">
              <Button color="error" onClick={handleOnClickDisconnect}>
                {t("disconnect")}
              </Button>
            </div>
          </HintBox>
        </div>
      )}
    </div>
  );
};
