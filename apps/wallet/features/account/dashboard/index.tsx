import { useAccount } from "@/app/hooks/useAccount";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { DashboardHeader } from "@/features/account/dashboard/sections/dashboardHeader";
import { Body } from "@/app/components/layout/body";

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
    <div>
      <section>
        <DashboardHeader accountData={accountData} />
      </section>
      <Body>
        <section>Body</section>
      </Body>
    </div>
  );
};
