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

export const Home = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const pools = useAppSelector(selectAllPools);
  const { accountAddress } = useAccount();
  const dispatch = useAppDispatch();

  const stats = useMemo(() => {
    return {
      initialShareholderValue: 10_000_000,
      shareholderCount: 352,
      poolsCount: 2,
      paidDividends: 1_520_000,
    };
  }, [pools]);

  const handleOnClickDisconnect = async () => {
    dispatch(accountActions.resetAccount());
  };

  const handleOnJoinClick = async () => {
    router.push("/pools");
  };

  return (
    <div>
      <section>
        <Slide direction="down">
          <Fade>
            <TextLogo className="pt-8 h-full mx-auto w-[50%] lg:w-[33%]" />
          </Fade>
        </Slide>
      </section>
      <section className="w-full">
        <DashboardStats stats={stats} />
      </section>
      <div className="prose text-center mx-auto mt-4">
        <div className="animate-wiggle">
          <Button color="primary" size="lg" onClick={handleOnJoinClick}>
            {t("join_club")}
          </Button>
        </div>

        {accountAddress && (
          <>
            <p>You are connected as</p>
            <h3>{accountAddress}</h3>
            <div className="mt-2">
              <Button color="ghost" onClick={handleOnClickDisconnect}>
                Disconnect
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
