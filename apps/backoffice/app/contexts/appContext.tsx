import { FC, createContext } from "react";
import { isClientSide } from "../isClientSide";
import { Config } from "../config";
import { DeeplinkableWallet, GenericExtensionWallet } from "@signumjs/wallets";
import { isMobile } from "react-device-detect";
import { ChildrenProps } from "@/types/childrenProps";
import { FiatTickerService } from "@axtp/core/markets/fiatTickerService";
import { WithdrawalService } from "@/app/services/withdrawalService/withdrawalService";

export interface AppContextType {
  IsClientSide: boolean;
  IsMobile: boolean;
  Wallet: {
    Extension: GenericExtensionWallet;
    Deeplink: DeeplinkableWallet;
  };
  Ledger: {
    DefaultNode: string;
    IsTestnet: boolean;
    Network: string;
    ExploreBaseUrl: string;
    Prefix: string;
    Ticker: string;
  };
  WithdrawalService: WithdrawalService;
  Platform: typeof Config.Platform;
  Accounts: typeof Config.Accounts;
}

const config: AppContextType = {
  IsMobile: isMobile,
  IsClientSide: isClientSide(),
  Platform: { ...Config.Platform },
  Accounts: {
    ...Config.Accounts,
  },
  Wallet: {
    Extension: new GenericExtensionWallet(),
    Deeplink: new DeeplinkableWallet({ openInBrowser: true }),
  },
  Ledger: {
    IsTestnet: Config.Signum.IsTestnet,
    DefaultNode: Config.Signum.DefaultNode,
    Network: Config.Signum.Network,
    ExploreBaseUrl: Config.Signum.IsTestnet
      ? "https://t-chain.signum.network"
      : "https://chain.signum.network",
    Prefix: Config.Signum.IsTestnet ? "TS" : "S",
    Ticker: Config.Signum.IsTestnet ? "TSIGNA" : "SIGNA",
  },
  WithdrawalService: new WithdrawalService(),
};

export const AppContext = createContext<AppContextType>(config);

export const AppContextProvider: FC<ChildrenProps> = ({ children }) => {
  return <AppContext.Provider value={config}>{children}</AppContext.Provider>;
};
