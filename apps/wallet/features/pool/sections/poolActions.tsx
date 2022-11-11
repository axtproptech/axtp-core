import { FC, useMemo } from "react";
import { useAccount } from "@/app/hooks/useAccount";
import { Number } from "@/app/components/number";
import { useRouter } from "next/router";
import { PoolContractData } from "@/types/poolContractData";
// @ts-ignore
import hashicon from "hashicon";
import { useTranslation } from "next-i18next";
import { Button } from "react-daisyui";
import { openExternalUrl } from "@/app/openExternalUrl";

interface Props {
  poolData: PoolContractData;
}

export const PoolActions: FC<Props> = ({ poolData }) => {
  // const account = useAccount();
  const { t } = useTranslation();

  const handleOpenDocumentation = () => {
    const poolId = poolData.poolId;
    openExternalUrl("");
  };

  const handleAcquireShare = () => {};

  return (
    <div className="p-2 flex-row flex mx-auto justify-center">
      <Button color="primary" onClick={handleAcquireShare}>
        {t("buy_token")}
      </Button>
      <Button className="ml-4" onClick={handleOpenDocumentation}>
        {t("show_doc")}
      </Button>
    </div>
  );
};
