import { FC } from "react";
import { PoolContractData } from "@/types/poolContractData";
// @ts-ignore
import hashicon from "hashicon";
import { useTranslation } from "next-i18next";
import { Button } from "react-daisyui";
import { openExternalUrl } from "@/app/openExternalUrl";
import { useRouter } from "next/router";

interface Props {
  poolData: PoolContractData;
}

export const PoolActions: FC<Props> = ({ poolData }) => {
  // const account = useAccount();
  const { t } = useTranslation();
  const router = useRouter();

  const handleOpenDocumentation = () => {
    const poolId = poolData.poolId;
    openExternalUrl("");
  };

  const handleAcquireShare = async () => {
    await router.push(`/pool/${poolData.poolId}/acquisition`);
  };

  return (
    <div className="p-2 flex-row flex mx-auto justify-center">
      <Button color="primary" onClick={handleAcquireShare}>
        {t("buy_token")}
      </Button>
      <Button className="ml-4" color="accent" onClick={handleOpenDocumentation}>
        {t("show_doc")}
      </Button>
    </div>
  );
};
