import { SpanWrapper } from "../../styles/landingPage.style";
import { PoolInvestmentCard } from "containers/Exclusive/components/PoolInvestmentCard";

export const InvestmentPlan = ({ pools }) => {
  return (
    <div className="mb-20 px-4">
      <p className="xs:hidden md:block text-6xl text-white text-center font-black mb-2">
        Escolha seu plano de <SpanWrapper>investmento</SpanWrapper>!
      </p>

      <SpanWrapper className="xs:block md:hidden text-6xl text-white text-center mb-4 font-black select-none">
        Escolha seu plano de investimento!
      </SpanWrapper>

      <p className="xs:text-xl md:text-xl text-white text-center opacity-80 mb-8">
        Não há opção para você? Estamos sempre em busca de novas oportunidades
        inovadoras de investimento. Em breve, poderemos oferecer mais opções.
      </p>

      <div className="w-full max-w-4xl flex flex-row gap-8 justify-center mx-auto xs:flex-wrap md:flex-nowrap">
        {pools.map((p) => (
          <PoolInvestmentCard key={p.poolId} pool={p} />
        ))}
      </div>
    </div>
  );
};
