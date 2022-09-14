import { ChangeEvent, FC, useEffect, useState } from "react";
import { CustomerData } from "@/types/customerData";
import { HintBox } from "@/app/components/hintBox";
import { useTranslation } from "next-i18next";
import { AnimatedIconContract } from "@/app/components/animatedIcons/animatedIconContract";
import Link from "next/link";
import { Button, Checkbox } from "react-daisyui";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useAppDispatch } from "@/states/hooks";
import { accountActions } from "@/app/states/accountState";
import { VerificationLevelType } from "@/types/verificationLevelType";
import { useRouter } from "next/router";

interface Props {
  customer: CustomerData;
}

export const RegisterSuccess: FC<Props> = ({ customer }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { KycService } = useAppContext();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (!customer) return;

    dispatch(
      accountActions.setCustomer({
        customerId: customer.cuid,
        firstName: customer.firstName,
        verificationLevel: customer.verificationLevel as VerificationLevelType,
        acceptedTerms: false,
      })
    );
  }, [customer, dispatch]);

  const handleChecked = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setAccepted(e.target.checked);
      if (!e.target.checked) return;
      setSubmitting(true);
      await KycService.acceptTermsOfUse(customer.cuid);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRouteHome = async () => {
    await router.push("/");
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
              <Link href="/#">{t("terms_of_use")}</Link>
            </div>
          </div>
          <div className="text-center">
            <Button
              className="px-8"
              color="primary"
              onClick={handleRouteHome}
              disabled={!accepted && !submitting}
            >
              {t("home")}
            </Button>
          </div>
        </HintBox>
        <div className="mt-2">
          <Link href="/#">{t("privacy_policy")}</Link>
        </div>
      </section>
    </div>
  );
};
