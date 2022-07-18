import { FC, createContext } from "react";
import { isClientSide } from "../isClientSide";
import { Config } from "../config";
import { DeeplinkableWallet, GenericExtensionWallet } from "@signumjs/wallets";
import { isMobile } from "react-device-detect";
import { ChildrenProps } from "@/types/childrenProps";

export interface AppContextType {
  IsClientSide: boolean;
  IsMobile: boolean;
  Wallet: {
    Extension: GenericExtensionWallet;
    Deeplink: DeeplinkableWallet;
  };
  Ledger: {
    IsTestnet: boolean;
    Network: string;
  };
  Platform: typeof Config.Platform;
}

const config: AppContextType = {
  IsMobile: isMobile,
  IsClientSide: isClientSide(),
  Platform: { ...Config.Platform },
  Wallet: {
    Extension: new GenericExtensionWallet(),
    Deeplink: new DeeplinkableWallet({ openInBrowser: true }),
  },
  Ledger: {
    IsTestnet: Config.Signum.IsTestnet,
    Network: Config.Signum.Network,
  },
};

export const AppContext = createContext<AppContextType>(config);

export const AppContextProvider: FC<ChildrenProps> = ({ children }) => {
  return <AppContext.Provider value={config}>{children}</AppContext.Provider>;
};
