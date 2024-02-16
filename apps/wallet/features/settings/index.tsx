import { Button } from "react-daisyui";
import { accountActions } from "@/app/states/accountState";
import { useAccount } from "@/app/hooks/useAccount";
import { useAppDispatch } from "@/states/hooks";
import { useTranslation } from "next-i18next";
import { HintBox } from "@/app/components/hintBoxes/hintBox";
import { useRouter } from "next/router";
import Link from "next/link";
import { SafeExternalLink } from "@/app/components/navigation/externalLink";
import { useAppContext } from "@/app/hooks/useAppContext";

export const Settings = () => {
  const { accountAddress } = useAccount();
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { Documents, BuildId } = useAppContext();

  const handleOnClickDisconnect = async () => {
    dispatch(accountActions.resetAccount());
    await router.push("/");
  };

  return (
    <div className="relative">
      <header className="h-12 mb-2 text-center">
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
      <div className="w-full text-center">
        <small className="text-gray-500">Build: {BuildId}</small>
      </div>
      {accountAddress && (
        <div className="mt-4 mx-auto">
          <HintBox text={t("disconnect_hint")}>
            <div className="text-center mt-2">
              <Button color="error" onClick={handleOnClickDisconnect}>
                {t("disconnect")}
              </Button>
            </div>
          </HintBox>
        </div>
      )}
      <section className="mt-8 py-2 mx-auto text-center">
        <SafeExternalLink href={Documents.Manual}>
          <Button color="accent">{t("manual")}</Button>
        </SafeExternalLink>
      </section>
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
