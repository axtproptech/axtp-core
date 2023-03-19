import { ChangeEvent, FC, useEffect, useState } from "react";
import { HintBox } from "@/app/components/hintBox";
import { useTranslation } from "next-i18next";
import { AnimatedIconContract } from "@/app/components/animatedIcons/animatedIconContract";
import Link from "next/link";
import { Button, Checkbox } from "react-daisyui";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useAppDispatch } from "@/states/hooks";
import { accountActions } from "@/app/states/accountState";
import { useRouter } from "next/router";
import { CustomerSafeData } from "@/types/customerSafeData";
import { RiHome6Line, RiWallet3Line } from "react-icons/ri";
import { useAccount } from "@/app/hooks/useAccount";

interface Props {
  customer: CustomerSafeData;
}

export const RegisterSuccess: FC<Props> = ({ customer }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { KycService } = useAppContext();
  const { accountId } = useAccount();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (!customer) return;

    dispatch(accountActions.setCustomer(customer));
  }, [customer, dispatch]);

  const handleChecked = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setAccepted(e.target.checked);
      if (!e.target.checked) return;
      setSubmitting(true);
      await KycService.acceptTermsOfUse(customer.customerId);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const { firstName } = customer;

  return (
    <div className="flex flex-col text-center h-[80vh] relative prose w-full mx-auto">
      <section>
        <div className="w-[180px] mx-auto">
          <AnimatedIconContract loopDelay={7500} touchable />
        </div>
      </section>
      <section className="prose">
        <h2>{t("register_welcome", { firstName })}</h2>
        <HintBox text={t("register_description")}>
          <div className="flex flex-row items-center justify-center mt-8">
            <Checkbox
              className="mr-2"
              color={"primary"}
              checked={accepted}
              onChange={handleChecked}
              disabled={submitting}
            />
            <div>
              <span className="mt-2 mr-1">{t("accept_terms")}</span>
              <Link href="/terms/usage">{t("terms_of_use")}</Link>
            </div>
          </div>
          <div className="text-center mt-4">
            {accountId ? (
              <Link href="/">
                <Button
                  color="primary"
                  disabled={!accepted && !submitting}
                  startIcon={<RiHome6Line />}
                >
                  {t("home")}
                </Button>
              </Link>
            ) : (
              <div className="w-fit mx-auto">
                <Link href="/account/setup">
                  <Button
                    color="primary"
                    disabled={!accepted && !submitting}
                    startIcon={<RiWallet3Line />}
                  >
                    {t("setup_account")}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </HintBox>
        <div className="mt-2">
          <Link href="/terms/privacy">{t("privacy_policy")}</Link>
        </div>
      </section>
    </div>
  );
};
