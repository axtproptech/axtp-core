import { useTranslation } from "next-i18next";
import { useAccount } from "@/app/hooks/useAccount";
import { Button } from "react-daisyui";
import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { accountActions } from "@/app/states/accountState";
import { DashboardStats } from "./sections/dashboardStats";
import { TextLogo } from "@/app/components/logo/textLogo";
import { Fade, Slide } from "react-awesome-reveal";
import { selectAllPools } from "@/app/states/poolsState";
import { useMemo } from "react";
import { useRouter } from "next/router";
import { PoolList } from "@/app/components/poolList";
import { useNotification } from "@/app/hooks/useNotification";

export const Home = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { showInfo } = useNotification();
  const pools = useAppSelector(selectAllPools);

  const stats = useMemo(() => {
    return {
      initialShareholderValue: 10_000_000,
      shareholderCount: 352,
      poolsCount: 2,
      paidDividends: 1_520_000,
    };
  }, [pools]);

  const handleOnJoinClick = async () => {
    showInfo("Not implemented yet");
  };

  return (
    <div>
      <section className="relative">
        <Slide direction="down">
          <Fade>
            <TextLogo className="py-4 h-full mx-auto w-[50%] lg:w-[33%]" />
          </Fade>
        </Slide>
      </section>
      <div className="relative">
        <div className="absolute z-10 top-[-1px] bg-gradient-to-b from-base-100 h-4 w-full opacity-80" />
      </div>
      <div className="relative overflow-x-hidden h-[calc(100vh_-_140px_-_64px)] lg:h-[calc(100vh_-_180px_-_64px)]">
        <section className="w-full">
          <DashboardStats stats={stats} />
        </section>
        <section className="prose text-center mx-auto mt-4">
          <div className="animate-wiggle">
            <Button color="primary" size="lg" onClick={handleOnJoinClick}>
              {t("join_club")}
            </Button>
          </div>
        </section>
        <section className="mt-8">
          <PoolList />
        </section>
      </div>
    </div>
  );
};
