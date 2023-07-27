import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";
import { FC, useState } from "react";
import { PoolHeader } from "../components/poolHeader";
import { PoolData } from "../components/poolData";
import { PoolActions } from "../components/poolActions";
import { useTranslation } from "next-i18next";
import { Body } from "@/app/components/layout/body";
import { Fade, Slide, Zoom } from "react-awesome-reveal";
import { CollapsableDivider } from "@/app/components/collapsableDivider";
import { useAppContext } from "@/app/hooks/useAppContext";

interface Props {
  poolId: string;
}

export const PoolContractDetails: FC<Props> = ({ poolId }) => {
  const { t } = useTranslation();
  const { IsMobile } = useAppContext();
  const pool = useAppSelector(selectPoolContractState(poolId));
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!pool) return null;

  const height = IsMobile ? "420px" : "300px";
  return (
    <div className="overflow-hidden h-[100vh]">
      <section
        className="relative transition-[height] overflow-hidden duration-300"
        style={{
          height: isCollapsed ? "128px" : height,
        }}
      >
        <Slide direction="down" triggerOnce>
          <Fade>
            <PoolHeader poolData={pool} showStats />
          </Fade>
        </Slide>
        <Zoom triggerOnce>
          <Fade triggerOnce>
            <PoolActions poolData={pool} />
          </Fade>
        </Zoom>
      </section>
      <CollapsableDivider
        isCollapsed={isCollapsed}
        onCollapse={setIsCollapsed}
        text={t("details")}
      />
      <Fade>
        <div className="relative z-10">
          <Body
            className="overflow-x-auto scrollbar-thin scroll scrollbar-thumb-accent scrollbar-thumb-rounded-full scrollbar-track-transparent"
            style={{
              height: isCollapsed
                ? "calc(100vh - 228px)"
                : "calc(100vh - 520px)",
            }}
          >
            <PoolData poolData={pool} />
          </Body>
          <div className="absolute top-[-1px] bg-gradient-to-b from-base-100 h-4 w-full" />
        </div>
      </Fade>
    </div>
  );
};
