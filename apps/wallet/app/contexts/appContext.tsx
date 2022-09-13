import { FC, createContext } from "react";
import { isClientSide } from "../isClientSide";
import { isMobile } from "react-device-detect";
import { ChildrenProps } from "@/types/childrenProps";
import { Config } from "@/app/config";
import { Ledger, LedgerClientFactory } from "@signumjs/core";
import { KycService } from "@/app/services/kycService";

type AddressPrefixType = "TS" | "S";

export interface AppContextType {
  IsClientSide: boolean;
  IsMobile: boolean;
  AXTTokenId: string;
  AXTPoolTokenIds: string[];
  JotFormId: string;
  KycService: KycService;
  Ledger: {
    Client: Ledger;
    AddressPrefix: AddressPrefixType;
    SignaPrefix: "TSIGNA" | "SIGNA";
    Hosts: string[];
    PollingInterval: number;
  };
}

const config: AppContextType = {
  IsMobile: isMobile,
  IsClientSide: isClientSide(),
  AXTTokenId: Config.Tokens.AXT,
  AXTPoolTokenIds: Config.Tokens.AXTPs,
  JotFormId: Config.JotForm.Id,
  KycService: new KycService(),
  Ledger: {
    Client: LedgerClientFactory.createClient({
      nodeHost: Config.Ledger.Hosts[0],
    }),
    AddressPrefix: Config.Ledger.AddressPrefix as AddressPrefixType,
    SignaPrefix: Config.Ledger.AddressPrefix === "TS" ? "TSIGNA" : "SIGNA",
    Hosts: Config.Ledger.Hosts,
    PollingInterval: Config.Ledger.PollingInterval,
  },
};

export const AppContext = createContext<AppContextType>(config);

export const AppContextProvider: FC<ChildrenProps> = ({ children }) => {
  return <AppContext.Provider value={config}>{children}</AppContext.Provider>;
};
