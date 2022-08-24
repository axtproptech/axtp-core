import { useAccount } from "@/app/hooks/useAccount";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Dataviz } from "@/features/account/dashboard/sections/dataviz";

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
      <section>{accountData && <Dataviz accountData={accountData} />}</section>
      <section>Body</section>
    </div>
  );
};
