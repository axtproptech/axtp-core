import { Button } from "react-daisyui";
import { accountActions } from "@/app/states/accountState";
import { useAccount } from "@/app/hooks/useAccount";
import { useAppDispatch } from "@/states/hooks";
import { useTranslation } from "next-i18next";
import { HintBox } from "@/app/components/hintBox";
import { useRouter } from "next/router";
import Link from "next/link";

export const Settings = () => {
  const { accountAddress } = useAccount();
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleOnClickDisconnect = async () => {
    dispatch(accountActions.resetAccount());
    await router.push("/");
  };

  return (
    <div className="relative">
      <header className="h-12 mb-4">
        <a
          href="https://signum.network"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="mx-auto h-full"
            src="/assets/img/powered.svg"
            alt="AXT Logo"
          />
        </a>
      </header>
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
      <section className="text-center mt-8 block">
        <div>
          <u>
            <Link href="/terms/usage">{t("terms_of_use")}</Link>
          </u>
        </div>
        <div>
          <u>
            <Link href="/terms/privacy">{t("privacy_policy")}</Link>
          </u>
        </div>
      </section>
    </div>
  );
};
