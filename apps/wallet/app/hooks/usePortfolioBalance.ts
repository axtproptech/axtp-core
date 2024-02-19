import { useAppSelector } from "@/states/hooks";
import {
  selectActiveMarketData,
  selectBrlUsdMarketData,
} from "@/app/states/marketState";
import { useAccount } from "@/app/hooks/useAccount";
import { selectAXTToken } from "@/app/states/tokenState";
import { useMemo } from "react";
import { selectAllPools } from "@/app/states/poolsState";
import { ChainValue } from "@signumjs/util";

interface BalanceType {
  ticker: string;
  balance: number;
  formatted: string;
}

interface PoolBalanceType extends BalanceType {
  poolTicker: string;
  poolQuantity: string;
}

export interface PortfolioBalance {
  axtcBalance: BalanceType;
  axtcReservedBalance: BalanceType;
  axtcPoolBalances: PoolBalanceType[];
  axtcTotalBalance: BalanceType;
  fiatBalance: BalanceType;
  // signaBalance: BalanceType;
}

const numberFormat = new Intl.NumberFormat("pt-BR");

function format(balance: BalanceType) {
  return `${numberFormat.format(balance.balance)} ${balance.ticker}`;
}

export const usePortfolioBalance = (): PortfolioBalance => {
  const activeMarket = useAppSelector(selectActiveMarketData);
  const brlUsdMarket = useAppSelector(selectBrlUsdMarketData);
  const { name, decimals } = useAppSelector(selectAXTToken);
  const pools = useAppSelector(selectAllPools);
  const { accountData } = useAccount();

  const [axtcReservedBalance, axtcPoolBalances] = useMemo(() => {
    let reservedAXTC = ChainValue.create(decimals);
    let poolBalancesAXTC: PoolBalanceType[] = [];
    for (let pb of accountData.balancesPools) {
      const pool = pools.find((p) => p.token.id === pb.id);
      if (!pool) {
        continue;
      }
      const poolAXTC = ChainValue.create(pb.decimals)
        .setAtomic(pb.quantity)
        .multiply(pool.tokenRate)
        .getCompound();

      const poolBalance: PoolBalanceType = {
        balance: Number(poolAXTC),
        poolQuantity: pb.quantity,
        poolTicker: pb.name.toUpperCase(),
        ticker: name.toUpperCase(),
        formatted: "",
      };
      poolBalance.formatted = format(poolBalance);
      poolBalancesAXTC.push(poolBalance);
      reservedAXTC.add(ChainValue.create(decimals).setCompound(poolAXTC));
    }

    // const reserved = accountData.balancesPools.reduce((axtcSum, b) => {
    //   const pool = pools.find((p) => p.token.id === b.id);
    //   if (!pool) {
    //     return axtcSum;
    //   }
    //   // token rate is compound and not quantity
    //   const poolAXTC = ChainValue.create(b.decimals)
    //     .setAtomic(b.quantity)
    //     .multiply(pool.tokenRate)
    //     .getCompound();
    //
    //   return axtcSum.add(ChainValue.create(decimals).setCompound(poolAXTC));
    // }, ChainValue.create(decimals));

    const reservedBalanceAXTC = {
      balance: Number(reservedAXTC.getCompound()),
      ticker: name.toUpperCase(),
      formatted: "",
    };
    reservedBalanceAXTC.formatted = format(reservedBalanceAXTC);

    return [reservedBalanceAXTC, poolBalancesAXTC];
  }, [accountData.balancesPools, decimals, name, pools]);

  const axtcBalance: BalanceType = {
    balance: Number(accountData?.balanceAXTC || "0"),
    ticker: name.toUpperCase(),
    formatted: "",
  };

  const axtcTotalBalance: BalanceType = {
    balance:
      Number(accountData?.balanceAXTC || "0") + axtcReservedBalance.balance,
    ticker: name.toUpperCase(),
    formatted: "",
  };

  // const signaBalance: BalanceType = {
  //   balance: Number(accountData?.balanceSigna || "0"),
  //   ticker: SignaPrefix.toUpperCase(),
  //   formatted: "",
  // };

  const fiatBalance: BalanceType = {
    balance:
      // TODO: signa is not of importance here...
      // signaBalance.balance * signaMarket.current_price +
      axtcTotalBalance.balance * brlUsdMarket.current_price,
    ticker: activeMarket.ticker.toUpperCase(),
    formatted: "",
  };

  axtcBalance.formatted = format(axtcBalance);
  axtcTotalBalance.formatted = format(axtcTotalBalance);
  // signaBalance.formatted = format(signaBalance);
  fiatBalance.formatted = format(fiatBalance);

  return {
    axtcBalance,
    axtcReservedBalance,
    axtcPoolBalances,
    axtcTotalBalance,
    fiatBalance,
    // signaBalance,
  };
};
