import { useRouter } from "next/router";
import { useAccount } from "@/app/hooks/useAccount";
import { FC, useEffect } from "react";
import { ChildrenProps } from "@/types/childrenProps";

export const WithAccountOnly: FC<ChildrenProps> = ({ children }) => {
  const router = useRouter();
  const { accountId } = useAccount();

  // TODO: consider blocked and inactive accounts!

  useEffect(() => {
    if (!accountId && router) {
      router.replace("/kyc");
    }
  }, [accountId, router]);

  if (!accountId) return null;

  return <>{children}</>;
};
