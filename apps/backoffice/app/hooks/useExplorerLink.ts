import { useAppContext } from "@/app/hooks/useAppContext";

export const useExplorerLink = () => {
  const {
    Ledger: { ExploreBaseUrl },
  } = useAppContext();

  return {
    getAccountLink: (accountId: string) =>
      `${ExploreBaseUrl}/address/${accountId}`,
    getContractLink: (contractId: string) =>
      `${ExploreBaseUrl}/at/${contractId}`,
    getTokenLink: (tokenId: string) => `${ExploreBaseUrl}/asset/${tokenId}`,
    getTransactionLink: (txId: string) => `${ExploreBaseUrl}/tx/${txId}`,
  };
};
