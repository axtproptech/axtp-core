import { HandlerFunction } from "@/bff/route";
import * as process from "process";
import { handleError } from "@/bff/handler/handleError";
import { HttpClientFactory } from "@signumjs/http";

function getProtocolContext(protocol: string) {
  const isTestnet = process.env.NEXT_PUBLIC_LEDGER_IS_TESTNET === "true";

  switch (protocol) {
    case "eth":
      return {
        protocol: "ethereum",
        network: isTestnet ? "goerli" : "mainnet",
        recipient: process.env.NEXT_PUBLIC_USDC_DEPOSIT_ACCOUNT_ETH,
      };
    case "sol":
      return {
        protocol: "solana",
        network: "mainnet", // no testnet supported yet
        recipient: process.env.NEXT_PUBLIC_USDC_DEPOSIT_ACCOUNT_SOL,
      };
    case "algo":
      return {
        protocol: "algorand",
        network: "mainnet", // no testnet supported yet
        recipient: process.env.NEXT_PUBLIC_USDC_DEPOSIT_ACCOUNT_ALGO,
      };
    default:
      throw new Error(`Unknown Protocol:  ${protocol}`);
  }
}

export const getUsdcTransactionStatus: HandlerFunction = async (req, res) => {
  try {
    const { txId, protocol: proto } = req.query;

    const client = HttpClientFactory.createHttpClient(
      "https://svc.blockdaemon.com/universal/v1",
      {
        headers: {
          Authorization: `Bearer ${
            process.env.NEXT_SERVER_BLOCKDAEMON_API_KEY || ""
          }`,
        },
      }
    );

    const { protocol, network, recipient } = getProtocolContext(
      proto as string
    );
    // see: https://ubiquity.docs.blockdaemon.com/#tag/Accounts/operation/GetTxsByAddress
    const { response } = await client.get(
      `${protocol}/${network}/account/${recipient}/txs`
    );

    console.log("transaction data", response);

    // we don't check the value here now...
    // Problem is that in the transaction itself it is not always possible to detect our deposit address
    // but if the txId is addressed to our recipient accounts.
    if (response && response.data.find((tx: any) => tx.id === txId)) {
      res.status(200).json({
        status: "confirmed",
      });
    }

    res.status(404);
  } catch (e: any) {
    handleError({ e, res });
  }
};
