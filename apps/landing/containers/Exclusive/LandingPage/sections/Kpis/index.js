import { useMemo } from "react";
import { useRouter } from "next/router";
import { getCompactNumberFormatter } from "common/numbers";

export const Kpis = ({ pools }) => {
  const { locale } = useRouter();
  const compactFormatter = useMemo(
    () => getCompactNumberFormatter(locale),
    [locale]
  );

  const kpis = useMemo(() => {
    let totalCurrentGMV = 0;
    let totalPaidDividends = 0;
    let shareholderCount = 0;
    let initialGMV = 0;
    const poolsCount = pools.length;
    for (const p of pools) {
      totalCurrentGMV += p.grossMarketValue;
      totalPaidDividends += p.paidDistribution;
      shareholderCount += p.token.numHolders;
      initialGMV += p.nominalLiquidity;
    }

    return {
      totalCurrentGMV,
      performancePercent:
        initialGMV > 0 ? (totalCurrentGMV / initialGMV) * 100 - 100 : 0,
      poolsCount,
      shareholderCount,
      totalPaidDividends,
    };
  }, [pools]);

  return (
    <div className="w-full p-4 bg-gray-500 mx-auto border-gray-100/10 border-y-2 bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-10 mb-12 overflow-hidden">
      <div className="w-full max-w-5xl mx-auto flex xs:flex-col  md:flex-row xs:gap-4 md:gap-0 justify-center items-center flex-wrap">
        <div className="flex flex-1 flex-col justify-center text-center py-2 px-4 gap-1">
          <p className="text-white text-6xl font-bold ">
            {compactFormatter.format(kpis.totalCurrentGMV)}
          </p>
          <p className="text-white text-xl opacity-80">Gross Market Value</p>
        </div>

        <div className="flex flex-1 flex-col justify-center text-center py-2 px-4 gap-1 border-gray-100/10 xs:border-0 md:border-l-2">
          <p className="text-white text-6xl font-bold ">
            {kpis.shareholderCount}
          </p>
          <p className="text-white text-xl opacity-80">Total Shareholders</p>
        </div>

        <div className="flex flex-1 flex-col justify-center text-center py-2 px-4 gap-1 border-gray-100/10 xs:border-0 md:border-l-2">
          <p className="text-white text-6xl font-bold ">
            {compactFormatter.format(kpis.totalPaidDividends)}
          </p>
          <p className="text-white text-xl opacity-80">Total Paid Dividends</p>
        </div>
      </div>
    </div>
  );
};
