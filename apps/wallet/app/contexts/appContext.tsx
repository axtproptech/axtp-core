import { FC, createContext } from "react";
import { isClientSide } from "../isClientSide";
import { isMobile } from "react-device-detect";
import { ChildrenProps } from "@/types/childrenProps";
import { Config } from "@/app/config";

export interface AppContextType {
  IsClientSide: boolean;
  IsMobile: boolean;
  Ledger: {
    AddressPrefix: string;
    Hosts: string[];
  };
  // put all _global_ and _constant_ status herein
}

const config: AppContextType = {
  IsMobile: isMobile,
  IsClientSide: isClientSide(),
  Ledger: {
    AddressPrefix: Config.Ledger.AddressPrefix,
    Hosts: Config.Ledger.Hosts,
  },
};

export const AppContext = createContext<AppContextType>(config);

export const AppContextProvider: FC<ChildrenProps> = ({ children }) => {
  return <AppContext.Provider value={config}>{children}</AppContext.Provider>;
};
