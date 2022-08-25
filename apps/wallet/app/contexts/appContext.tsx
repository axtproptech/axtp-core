import { FC, createContext } from "react";
import { isClientSide } from "../isClientSide";
import { isMobile } from "react-device-detect";
import { ChildrenProps } from "@/types/childrenProps";
import { Config } from "@/app/config";
import { Ledger, LedgerClientFactory } from "@signumjs/core";

type AddressPrefixType = "TS" | "S";

export interface AppContextType {
  IsClientSide: boolean;
  IsMobile: boolean;
  AXTTokenId: string;
  AXTPoolTokenIds: string[];
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
