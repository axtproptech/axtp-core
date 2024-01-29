import { AccountHeader } from "@/features/account/components/accountHeader";
import * as React from "react";
import { useRef } from "react";
import { useTranslation } from "next-i18next";
import { useAccount } from "@/app/hooks/useAccount";
import { Body } from "@/app/components/layout/body";
import { LoadingBox } from "@/app/components/hintBoxes/loadingBox";
import { useAccountRewards } from "@/app/hooks/useAccountRewards";
import { RewardItemCard, NoRewardsBox } from "./rewardItem";
import { FixedSizeList } from "react-window";
import { RewardItemData } from "@/types/rewardItemData";
import { Slide, Zoom } from "react-awesome-reveal";

const PaddingSize = 8;

export const AccountRewards = () => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation("rewards");
  const { accountData } = useAccount();
  const { rewards, isLoading } = useAccountRewards();

  const height = bodyRef.current
    ? bodyRef.current.clientHeight - 112 - 64 - 40
    : 600;

  return (
    <div ref={bodyRef} className="overflow-hidden h-[100vh]">
      <section className="pt-12 md:pt-8 flex-row flex mx-auto justify-center">
        <AccountHeader account={accountData} />
      </section>
      <Body className="relative">
        {isLoading && (
          <section className="mt-[30%]">
            <LoadingBox
              title={t("loadingRewards")}
              text={t("loadingRewardsHint")}
            />
          </section>
        )}

        {!isLoading && rewards.length === 0 && (
          <section className="mt-[30%]">
            <Zoom triggerOnce>
              <NoRewardsBox />
            </Zoom>
          </section>
        )}

        {!isLoading && rewards.length > 0 && (
          <>
            <p className="text-xs text-gray-400">{t("clickViewNft")}</p>
            <div className="absolute z-10 top-8 bg-gradient-to-b from-base-100 h-4 w-full opacity-80" />
            <Slide direction="up" triggerOnce>
              <FixedSizeList<RewardItemData[]>
                className={
                  "overflow-x-auto scrollbar-thin scroll scrollbar-thumb-accent scrollbar-thumb-rounded-full scrollbar-track-transparent h-[calc(100vh_-_440px)]"
                }
                height={height}
                width="100%"
                itemCount={rewards.length}
                itemSize={240 + PaddingSize * 2}
                itemData={rewards}
              >
                {RewardItemCard}
              </FixedSizeList>
            </Slide>
            <div className="absolute z-10 bottom-4 bg-gradient-to-t from-base-100 h-4 w-full opacity-80" />
          </>
        )}
      </Body>
    </div>
  );
};
