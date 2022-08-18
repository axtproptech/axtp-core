import { useAccount } from "@/app/hooks/useAccount";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useIsReady } from "@/app/hooks/useIsReady";

export const AppInitializer = () => {
  const router = useRouter();
  const isReady = useIsReady();
  const { accountId } = useAccount();

  useEffect(() => {
    if (!isReady) return;

    if (!accountId && !router.route.startsWith("/account")) {
      router.push("/account");
    }
  }, [accountId, isReady]);

  return (
    <>
      {/* if you need to initialize your app then this is a good point to add initilizer components here */}
    </>
  );
};
