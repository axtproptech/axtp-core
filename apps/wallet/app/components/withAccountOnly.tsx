import { useRouter } from "next/router";
import { useAccount } from "@/app/hooks/useAccount";
import { FC, useEffect } from "react";
import { ChildrenProps } from "@/types/childrenProps";

export const WithAccountOnly: FC<ChildrenProps> = ({ children }) => {
  const router = useRouter();
  const { accountId } = useAccount();

  useEffect(() => {
    if (!accountId && router) {
      router.replace("/account/setup");
    }
  }, [accountId, router]);

  if (!accountId) return null;

  return <>{children}</>;
};
