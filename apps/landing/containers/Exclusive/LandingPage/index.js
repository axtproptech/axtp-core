import Fade from "react-reveal/Fade";

import { Welcome } from "./sections/Welcome";
import InvestmentPlan from "./sections/InvestmentPlan";
import Kpis from "./sections/Kpis";
import BoxCta from "./sections/BoxCta";
import Faq from "./sections/Faq";
import useSWR from "swr";
import { SmartContractViewerService } from "@axtp/core";

const AxtcContractId = process.env.NEXT_PUBLIC_MASTER_CONTRACT_ID || "";
const SignumNodeHost = process.env.NEXT_PUBLIC_SIGNUM_NODE_HOST || "";
const PoolContractIds = (process.env.NEXT_PUBLIC_AXTP_CONTRACT_IDS || "").split(
  ","
);

export const ExclusiveAreaPage = ({ articles }) => {
  const {
    data: poolData,
    error,
    isLoading,
  } = useSWR("fetchPoolContracts", async () => {
    const service = new SmartContractViewerService(
      SignumNodeHost,
      AxtcContractId
    );
    return service.poolContract.fetchContracts({
      contractIds: PoolContractIds,
    });
  });

  console.log("data", poolData);

  return (
    <div className="relative flex flex-col mb-32">
      <div className="absolute h-full inset-0 top-0 left-0 flex items-center justify-center overflow-hidden -z-10">
        <img
          className="w-full"
          style={{ opacity: 0.2 }}
          src="assets/exclusive/landingPageBackground.svg"
        />
      </div>

      <Fade up>
        <Welcome articles={articles} />
      </Fade>

      <Fade up delay={100}>
        <InvestmentPlan pools={poolData} />
      </Fade>

      <Fade up delay={100}>
        <Kpis />
      </Fade>

      <Fade up delay={100}>
        <BoxCta />
      </Fade>

      <Fade up delay={100}>
        <Faq />
      </Fade>
    </div>
  );
};
