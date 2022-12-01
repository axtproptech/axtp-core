import { FC, createContext } from "react";
import { isClientSide } from "../isClientSide";
import { isMobile } from "react-device-detect";
import { ChildrenProps } from "@/types/childrenProps";
import { Config } from "@/app/config";
import { Ledger, LedgerClientFactory } from "@signumjs/core";
import { KycService } from "@/app/services/kycService";

type AddressPrefixType = "TS" | "S";
type SignaPrefixType = "TSIGNA" | "SIGNA";

export interface AppContextType {
  IsClientSide: boolean;
  IsMobile: boolean;
  AXTTokenId: string;
  AXTPoolTokenIds: string[];
  JotFormId: string;
  KycService: KycService;
  Ledger: {
    IsTestNet: boolean;
    Client: Ledger;
    AddressPrefix: AddressPrefixType;
    SignaPrefix: SignaPrefixType;
    Hosts: string[];
    PollingInterval: number;
    ExplorerUrl: string;
  };
  Market: {
    BrlUsdAdjustment: number;
  };
}

const config: AppContextType = {
  IsMobile: isMobile,
  IsClientSide: isClientSide(),
  AXTTokenId: Config.Tokens.AXTC,
  AXTPoolTokenIds: Config.Tokens.AXTPs,
  JotFormId: Config.JotForm.Id,
  KycService: new KycService(),
  Market: {
    BrlUsdAdjustment: Config.Market.BrlUsdAdjustment,
  },
  Ledger: {
    IsTestNet: Config.Ledger.IsTestNet,
    Client: LedgerClientFactory.createClient({
      nodeHost: Config.Ledger.Hosts[0],
    }),
    AddressPrefix: Config.Ledger.IsTestNet ? "TS" : "S",
    SignaPrefix: Config.Ledger.IsTestNet ? "TSIGNA" : "SIGNA",
    Hosts: Config.Ledger.Hosts,
    PollingInterval: Config.Ledger.PollingInterval,
    ExplorerUrl: Config.Ledger.ExplorerUrl,
  },
};

export const AppContext = createContext<AppContextType>(config);

export const AppContextProvider: FC<ChildrenProps> = ({ children }) => {
  return <AppContext.Provider value={config}>{children}</AppContext.Provider>;
};
