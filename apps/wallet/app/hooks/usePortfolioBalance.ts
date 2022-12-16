import { useAppSelector } from "@/states/hooks";
import {
  selectActiveMarketData,
  selectBrlUsdMarketData,
} from "@/app/states/marketState";
import { useAccount } from "@/app/hooks/useAccount";
import { useAppContext } from "@/app/hooks/useAppContext";
import { selectAXTToken } from "@/app/states/tokenState";
import { useMemo } from "react";
import { selectAllPools } from "@/app/states/poolsState";
import { ChainValue } from "@signumjs/util";

interface BalanceType {
  ticker: string;
  balance: number;
  formatted: string;
}

export interface PortfolioBalance {
  axtcBalance: BalanceType;
  axtcReservedBalance: BalanceType;
  axtcTotalBalance: BalanceType;
  fiatBalance: BalanceType;
  signaBalance: BalanceType;
}

const numberFormat = new Intl.NumberFormat("pt-BR");

function format(balance: BalanceType) {
  return `${numberFormat.format(balance.balance)} ${balance.ticker}`;
}

export const usePortfolioBalance = (): PortfolioBalance => {
  const signaMarket = useAppSelector(selectActiveMarketData);
  const brlMarket = useAppSelector(selectBrlUsdMarketData);
  const { name, decimals } = useAppSelector(selectAXTToken);
  const pools = useAppSelector(selectAllPools);
  const { accountData } = useAccount();
  const {
    Ledger: { SignaPrefix },
  } = useAppContext();

  const axtcReservedBalance: BalanceType = useMemo(() => {
    const reserved = accountData.balancesPools.reduce((axtcSum, b) => {
      const pool = pools.find((p) => p.token.id === b.id);
      if (!pool) {
        return axtcSum;
      }
      // token rate is compound and not quantity
      const poolAXTC = ChainValue.create(b.decimals)
        .setAtomic(b.quantity)
        .multiply(pool.tokenRate)
        .getCompound();

      return axtcSum.add(ChainValue.create(decimals).setCompound(poolAXTC));
    }, ChainValue.create(decimals));

    return {
      balance: Number(reserved.getCompound()),
      ticker: name.toUpperCase(),
      formatted: "",
    };
  }, [accountData.balancesPools, decimals, name, pools]);

  const axtcBalance: BalanceType = {
    balance: Number(accountData?.balanceAxt || "0"),
    ticker: name.toUpperCase(),
    formatted: "",
  };

  const axtcTotalBalance: BalanceType = {
    balance:
      Number(accountData?.balanceAxt || "0") + axtcReservedBalance.balance,
    ticker: name.toUpperCase(),
    formatted: "",
  };

  const signaBalance: BalanceType = {
    balance: Number(accountData?.balanceSigna || "0"),
    ticker: SignaPrefix.toUpperCase(),
    formatted: "",
  };

  const fiatBalance: BalanceType = {
    balance:
      signaBalance.balance * signaMarket.current_price +
      axtcTotalBalance.balance * brlMarket.current_price,
    ticker: signaMarket.ticker.toUpperCase(),
    formatted: "",
  };

  axtcBalance.formatted = format(axtcBalance);
  axtcReservedBalance.formatted = format(axtcReservedBalance);
  axtcTotalBalance.formatted = format(axtcTotalBalance);
  signaBalance.formatted = format(signaBalance);
  fiatBalance.formatted = format(fiatBalance);

  return {
    axtcBalance,
    axtcReservedBalance,
    axtcTotalBalance,
    fiatBalance,
    signaBalance,
  };
};
