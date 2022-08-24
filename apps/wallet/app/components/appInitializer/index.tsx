import { useAccount } from "@/app/hooks/useAccount";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { TokenInitializer } from "./tokenInitializer";

export const AppInitializer = () => {
  const router = useRouter();
  const { accountId } = useAccount();

  useEffect(() => {
    if (!accountId && !router.route.startsWith("/account")) {
      router.push("/account");
    }
  }, [accountId]);

  return (
    <>
      <TokenInitializer />.
      {/* if you need to initialize your app then this is a good point to add initilizer components here */}
    </>
  );
};
