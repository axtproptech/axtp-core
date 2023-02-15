import { useAppSelector } from "@/states/hooks";
import { DashboardStats } from "./sections/dashboardStats";
import { TextLogo } from "@/app/components/logo/textLogo";
import { Fade, Slide } from "react-awesome-reveal";
import { selectAllPools } from "@/app/states/poolsState";
import { useEffect, useMemo } from "react";
import { PoolList } from "@/app/components/poolList";
import { useAccount } from "@/app/hooks/useAccount";
import { VerificationStatus } from "@/app/components/verificationStatus";
import { JoinClubButton } from "@/app/components/buttons/joinClubButton";
import { useRouter } from "next/router";
import { ShowAccountButton } from "@/app/components/buttons/showAccountButton";

export const Home = () => {
  const pools = useAppSelector(selectAllPools);
  const { accountId, customer } = useAccount();
  const stats = useMemo(() => {
    // TODO: calc the correct values
    return {
      initialShareholderValue: 10_000_000,
      shareholderCount: 352,
      poolsCount: 2,
      paidDividends: 1_520_000,
    };
  }, [pools]);

  return (
    <div>
      <section className="relative">
        <Slide direction="down">
          <Fade>
            <TextLogo className="py-4 mx-auto w-[50%] lg:w-[33%]" />
          </Fade>
        </Slide>
      </section>
      <div className="relative">
        <div className="absolute z-10 top-[-1px] bg-gradient-to-b from-base-100 h-4 w-full opacity-80" />
      </div>
      <div className="relative overflow-x-hidden h-[calc(100vh_-_140px_-_64px)] lg:h-[calc(100vh_-_180px_-_64px)]">
        <section className="w-full">
          <DashboardStats stats={stats} />
        </section>
        <section className="prose text-center mx-auto mt-4">
          {!customer ? (
            <JoinClubButton />
          ) : (
            <VerificationStatus
              verificationLevel={customer?.verificationLevel || ""}
              hideIfAccepted
            />
          )}
          {accountId && customer && <ShowAccountButton />}
        </section>
        <section className="mt-8">
          <PoolList />
        </section>
      </div>
    </div>
  );
};
