import { useAccount } from "@/app/hooks/useAccount";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { DashboardHeader } from "@/features/account/dashboard/sections/dashboardHeader";
import { Body } from "@/app/components/layout/body";
import { PoolList } from "@/app/components/poolList";
import { HintBox } from "@/app/components/hintBox";

export const AccountDashboard = () => {
  const router = useRouter();
  const { accountId, accountData } = useAccount();

  useEffect(() => {
    if (!accountId && router) {
      router.replace("/account/setup");
    }
  }, [accountId, router]);

  if (!accountId) return null;

  return (
    <div className="overflow-hidden h-[100vh]">
      <section>
        <DashboardHeader accountData={accountData} />
      </section>
      <div className="relative">
        <div className="absolute z-10 top-[-1px] bg-gradient-to-b from-base-100 h-4 w-full opacity-80" />
      </div>
      <Body className="overflow-x-auto h-[calc(100vh_-_240px_-_64px)]">
        <PoolList accountData={accountData} />
      </Body>
    </div>
  );
};
