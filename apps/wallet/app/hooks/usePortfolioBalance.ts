import { useAppSelector } from "@/states/hooks";
import {
  selectActiveMarketData,
  selectBrlUsdMarketData,
} from "@/app/states/marketState";
import { useAccount } from "@/app/hooks/useAccount";
import { useAppContext } from "@/app/hooks/useAppContext";
import { selectAXTToken } from "@/app/states/tokenState";

interface BalanceType {
  ticker: string;
  balance: number;
  formatted: string;
}

export interface PortfolioBalance {
  axtBalance: BalanceType;
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
  const { name } = useAppSelector(selectAXTToken);
  const { accountData } = useAccount();
  const {
    Ledger: { SignaPrefix },
  } = useAppContext();

  const axtBalance: BalanceType = {
    balance: Number(accountData?.balanceAxt || "0"),
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
      axtBalance.balance * brlMarket.current_price,
    ticker: signaMarket.ticker.toUpperCase(),
    formatted: "",
  };

  axtBalance.formatted = format(axtBalance);
  signaBalance.formatted = format(signaBalance);
  fiatBalance.formatted = format(fiatBalance);

  return {
    axtBalance,
    fiatBalance,
    signaBalance,
  };
};
