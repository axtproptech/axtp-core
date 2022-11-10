import { useAccount } from "@/app/hooks/useAccount";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { DashboardHeader } from "@/features/account/dashboard/sections/dashboardHeader";
import { Body } from "@/app/components/layout/body";
import { PoolList } from "@/app/components/poolList";
import { HintBox } from "@/app/components/hintBox";
import { JoinClubButton } from "@/app/components/buttons/joinClubButton";
import { VerificationStatus } from "@/app/components/verificationStatus";
import { useTranslation } from "next-i18next";
import { Button } from "react-daisyui";
import { useDispatch } from "react-redux";
import { accountActions } from "@/app/states/accountState";

const StatusSlugMap = {
  NotVerified: "kyc-not-registered-hint",
  Pending: "kyc-analyzing-hint",
  Level1: "kyc-accepted-hint",
  Level2: "kyc-accepted-hint",
};

export const AccountDashboard = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { accountId, accountData, customer, showVerificationStatus } =
    useAccount();
  const dispatch = useDispatch();

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
          accountData={accountData}
          verificationLevel={verificationLevel}
        />
      </section>
      <div className="relative">
        <div className="absolute z-10 top-[-1px] bg-gradient-to-b from-base-100 h-4 w-full opacity-80" />
      </div>
      <Body className="overflow-x-auto h-[calc(100vh_-_240px_-_64px)]">
        {!customer && (
          <HintBox
            className="mx-auto"
            text={t(StatusSlugMap[verificationLevel])}
          >
            <div className="text-center">
              <JoinClubButton />
            </div>
          </HintBox>
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
        {isVerified && (
          <div className="mt-16">
            <PoolList accountData={accountData} />
          </div>
        )}
      </Body>
    </div>
  );
};
