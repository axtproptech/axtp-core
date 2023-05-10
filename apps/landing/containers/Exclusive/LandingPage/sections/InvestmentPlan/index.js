import { SpanWrapper } from "../../styles/landingPage.style";
import PoolInvestmentCard from "containers/Exclusive/components/PoolInvestmentCard";

const InvestmentPlan = ({ pools }) => {
  return (
    <div className="mb-20 px-4">
      <p className="xs:hidden md:block text-6xl text-white text-center font-black mb-2">
        Pick your <SpanWrapper>Investment</SpanWrapper> plan!
      </p>

      <SpanWrapper className="xs:block md:hidden text-6xl text-white text-center mb-4 font-black select-none">
        Pick your Investment plan!
      </SpanWrapper>

      <p className="xs:text-2xl md:text-xl text-white text-center opacity-80 mb-8">
        Pick the pool of your preference and start investing
      </p>

      <div class="w-full max-w-4xl flex flex-row gap-8 justify-center mx-auto xs:flex-wrap md:flex-nowrap">
        <PoolInvestmentCard />
        <PoolInvestmentCard />
      </div>
    </div>
  );
};

export default InvestmentPlan;
