import { useAppSelector } from "@/states/hooks";
import { DashboardStats } from "./sections/dashboardStats";
import { TextLogo } from "@/app/components/logo/textLogo";
import { Fade, Slide } from "react-awesome-reveal";
import { selectAllPools } from "@/app/states/poolsState";
import { useMemo } from "react";
import { PoolList } from "@/app/components/poolList";
import { useAccount } from "@/app/hooks/useAccount";
import { VerificationStatus } from "@/app/components/verificationStatus";
import { JoinClubButton } from "@/app/components/buttons/joinClubButton";
import { ShowAccountButton } from "@/app/components/buttons/showAccountButton";
import { RegisterCustomerButton } from "@/app/components/buttons/registerCustomerButton";
import { Greeting } from "@/app/components/greeting";
import { FileUploader } from "@/app/components/fileUploader";

export const Home = () => {
  const pools = useAppSelector(selectAllPools);
  const { accountId, customer } = useAccount();
  const stats = useMemo(() => {
    let totalCurrentGMV = 0;
    let totalPaidDividends = 0;
    let shareholderCount = 0;
    let initialGMV = 0;
    const poolsCount = pools.length;
    for (const p of pools) {
      totalCurrentGMV += p.grossMarketValue;
      totalPaidDividends += p.paidDistribution;
      shareholderCount += p.token.numHolders;
      initialGMV += p.nominalLiquidity;
    }

    return {
      totalCurrentGMV,
      performancePercent:
        initialGMV > 0 ? (totalCurrentGMV / initialGMV) * 100 - 100 : 0,
      poolsCount,
      shareholderCount,
      totalPaidDividends,
    };
  }, [pools]);

  return (
    <div>
      <section className="relative">
        <Slide direction="down">
          <Fade>
            <TextLogo className="mx-auto w-[40%] lg:w-[33%]" />
          </Fade>
        </Slide>
      </section>

      <FileUploader
        onUploadSuccess={console.log}
        fileTypes={["image/*", "application/pdf"]}
      />

      <div className="relative">
        <div className="absolute z-10 top-[-1px] bg-gradient-to-b from-base-100 h-4 w-full opacity-80" />
      </div>
      <div className="relative overflow-x-hidden h-[calc(100vh_-_100px_-_64px)] lg:h-[calc(100vh_-_120px_-_64px)]">
        <section className="w-full">
          <DashboardStats stats={stats} />
        </section>
        <section className="prose text-center mx-auto mt-4">
          <Greeting />
          {!customer ? (
            accountId ? (
              <RegisterCustomerButton />
            ) : (
              <JoinClubButton />
            )
          ) : (
            <VerificationStatus
              verificationLevel={customer.verificationLevel}
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
