import { useAccount } from "@/app/hooks/useAccount";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { DashboardHeader } from "@/features/account/dashboard/sections/dashboardHeader";
import { PaymentStatus } from "@/features/account/components/paymentStatus";
import { Body } from "@/app/components/layout/body";
import { PoolList } from "@/app/components/poolList";
import { HintBox } from "@/app/components/hintBox";
import { VerificationStatus } from "@/app/components/verificationStatus";
import { useTranslation } from "next-i18next";
import { Button } from "react-daisyui";
import { useDispatch } from "react-redux";
import { accountActions } from "@/app/states/accountState";
import useSWR from "swr";
import { useAppContext } from "@/app/hooks/useAppContext";
import Link from "next/link";
import { RiSurveyLine } from "react-icons/ri";

const StatusSlugMap = {
  NotVerified: "kyc-not-registered-hint",
  Pending: "kyc-analyzing-hint",
  Level1: "kyc-accepted-hint",
  Level2: "kyc-accepted-hint",
};

export const AccountDashboard = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    accountId,
    accountData,
    accountAddress,
    customer,
    showVerificationStatus,
  } = useAccount();
  const dispatch = useDispatch();
  const { KycService } = useAppContext();

  const { data: payments, error } = useSWR(
    customer && customer.customerId
      ? `getCustomerPayments/${customer.customerId}`
      : null,
    () => {
      if (customer && customer.customerId) {
        return KycService.fetchCustomerPayments(customer.customerId);
      }
      return null;
    }
  );

  useEffect(() => {
    if (!accountId && router) {
      router.replace("/account/setup");
    }
  }, [accountId, router]);

  if (!accountId) return null;

  const verificationLevel = customer
    ? customer.verificationLevel
    : "NotVerified";

  const isVerified = verificationLevel.startsWith("Level");

  const handleOnGotIt = () => {
    dispatch(accountActions.setShowVerificationStatus(false));
  };

  return (
    <div className="overflow-hidden h-[100vh]">
      <section>
        <DashboardHeader
          accountAddress={accountAddress || ""}
          accountData={accountData}
          verificationLevel={verificationLevel}
        />
      </section>
      <div className="relative">
        <div className="absolute z-10 top-4 bg-gradient-to-b from-base-100 h-4 w-full opacity-80" />
      </div>
      <Body className="overflow-x-auto scrollbar-thin scroll scrollbar-thumb-accent scrollbar-thumb-rounded-full scrollbar-track-transparent h-[calc(100vh_-_440px)]">
        {!customer && (
          <>
            <HintBox
              className="mx-auto"
              text={t(StatusSlugMap[verificationLevel])}
            >
              <div className="text-center">
                <div className="animate-wiggle py-2">
                  <Link href="/kyc/registry">
                    <Button
                      color="primary"
                      size="lg"
                      startIcon={<RiSurveyLine />}
                    >
                      {t("register")}
                    </Button>
                  </Link>
                </div>
              </div>
            </HintBox>
            <div className="text-center underline mt-2">
              <Link href="/kyc/link">{t("kyc_i_have_a_registry")}</Link>
            </div>
          </>
        )}
        {customer && showVerificationStatus && (
          <HintBox
            className="mx-auto"
            text={t(StatusSlugMap[verificationLevel])}
          >
            <div className=" flex flex-col justify-center">
              <VerificationStatus verificationLevel={verificationLevel} />
              {isVerified && (
                <div className="text-center animate-wiggle">
                  <Button
                    className="mt-4"
                    color="secondary"
                    size="md"
                    onClick={handleOnGotIt}
                  >
                    {t("kyc_verified_got_it")}
                  </Button>
                </div>
              )}
            </div>
          </HintBox>
        )}
        {payments && (
          <div className="mt-4">
            <PaymentStatus payments={payments} />
          </div>
        )}
        {isVerified && (
          <div className="mt-2">
            <PoolList accountData={accountData} />
          </div>
        )}
      </Body>
    </div>
  );
};
