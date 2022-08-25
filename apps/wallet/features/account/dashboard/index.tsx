import { useAccount } from "@/app/hooks/useAccount";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { DashboardHeader } from "@/features/account/dashboard/sections/dashboardHeader";
import { Body } from "@/app/components/layout/body";
import { DashboardPools } from "./sections/dashboardPools";

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
      <Body className="overflow-x-scroll h-[calc(100vh_-_240px_-_64px)]">
        <DashboardPools accountData={accountData} />
      </Body>
    </div>
  );
};
