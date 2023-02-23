import { LedgerClientFactory } from "@signumjs/core";

const fromArray = (csv: string): string[] => csv.split(",");

export const createLedgerClient = () => {
  const hosts = fromArray(
    process.env.NEXT_PUBLIC_LEDGER_HOST_URLS || "http://localhost:6876"
  );

  return LedgerClientFactory.createClient({
    nodeHost: hosts[0],
    reliableNodeHosts: hosts.length > 1 ? hosts.slice(1) : undefined,
    httpOptions: {
      transformRequest: (data: any, headers: any) => {
        console.log("transformRequest", data, headers);
        return data;
      },
    },
  });
};
