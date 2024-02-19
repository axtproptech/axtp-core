import { FC, createContext } from "react";
import { isClientSide } from "../isClientSide";
import { isMobile } from "react-device-detect";
import { ChildrenProps } from "@/types/childrenProps";
import { Config } from "@/app/config";
import { Ledger, LedgerClientFactory } from "@signumjs/core";
import {
  PaymentService,
  KycService,
  TrackingEventService,
  AccountActivationService,
  trackingEventService,
} from "@/app/services";
import { Http, HttpClientFactory } from "@signumjs/http";
import { FileService } from "@/app/services/fileService";
import { RewardService } from "@/app/services/rewardService";

type AddressPrefixType = "TS" | "S";
type SignaPrefixType = "TSIGNA" | "SIGNA";

export interface AppContextType {
  IsClientSide: boolean;
  IsMobile: boolean;
  BuildId: string;
  AXTTokenId: string;
  AXTPoolTokenIds: string[];
  JotFormId: string;
  BffClient: Http;
  KycService: KycService;
  PaymentService: PaymentService;
  RewardService: RewardService;
  FileService: FileService;
  ActivationService: AccountActivationService;
  TrackingEventService: TrackingEventService;
  Documents: {
    Use: string;
    Privacy: string;
    Manual: string;
  };
  Accounts: {
    Principal: string;
  };
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
  Payment: {
    PixKey: string;
    BankAccountInfo: {
      Name: string;
      Bank: string;
      Agency: string;
      Account: string;
    };
    Usdc: {
      DepositAccountEth: string;
      DepositAccountAlgo: string;
      DepositAccountSol: string;
      DepositAccountMatic: string;
    };
  };
}

const bffClient = HttpClientFactory.createHttpClient("/api", {
  headers: {
    // this is not "security", but at least some obstacle
    // we don't need fully fledged auth as the BFF returns only minimum, safe data
    "x-api-key": Config.BffApiKey,
  },
});

const config: AppContextType = {
  IsMobile: isMobile,
  IsClientSide: isClientSide(),
  BuildId: Config.BuildId,
  AXTTokenId: Config.Tokens.AXTC,
  AXTPoolTokenIds: Config.Tokens.AXTPs,
  JotFormId: Config.JotForm.Id,
  BffClient: bffClient,
  KycService: new KycService(bffClient),
  PaymentService: new PaymentService(bffClient),
  RewardService: new RewardService(bffClient),
  FileService: new FileService(bffClient),
  ActivationService: new AccountActivationService(),
  TrackingEventService: trackingEventService,
  Documents: {
    Use: Config.TermsOfUsefUrl,
    Privacy: Config.PrivacyfUrl,
    Manual: Config.ManualUrl,
  },
  Market: {
    BrlUsdAdjustment: Config.Market.BrlUsdAdjustment,
  },
  Payment: {
    PixKey: Config.Payment.PixKey,
    BankAccountInfo: Config.Payment.BankAccountInfo,
    Usdc: Config.Payment.Usdc,
  },
  Accounts: {
    Principal: Config.Accounts.Principal,
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
