import { HandlerFunction } from "@/bff/route";
import * as process from "process";
import { handleError } from "@/bff/handler/handleError";
import { HttpClientFactory } from "@signumjs/http";

const isTestnet = process.env.NEXT_PUBLIC_LEDGER_IS_TESTNET === "true";

interface ProtocolContext {
  protocol: "ethereum" | "solana" | "algorand";
  network: string;
  recipient: string;
  denomination: string;
}

/*
Example answer from blockdaemon universal api
{
    "id": "6WNWEWLPRZOD2RUV6BZ7PBYA2RYKMTJLJIG7LBA4JSQJ4Y3L3UMA",
    "block_id": "PRBBTXZZCLSYBQXD3ZD4MB4CBZNTJU6KKGZMPJXPYMAZ4P7KN3TQ",
    "date": 1670412912,
    "status": "completed",
    "num_events": 2,
    "block_number": 25376323,
    "events": [
        {
            "id": "6WNWEWLPRZOD2RUV6BZ7PBYA2RYKMTJLJIG7LBA4JSQJ4Y3L3UMA-fee",
            "transaction_id": "6WNWEWLPRZOD2RUV6BZ7PBYA2RYKMTJLJIG7LBA4JSQJ4Y3L3UMA",
            "type": "fee",
            "denomination": "ALGO",
            "destination": "fees",
            "date": 1670412912,
            "amount": 1000,
            "decimals": 6
        },
        {
            "id": "6WNWEWLPRZOD2RUV6BZ7PBYA2RYKMTJLJIG7LBA4JSQJ4Y3L3UMA-asset_transfer",
            "transaction_id": "6WNWEWLPRZOD2RUV6BZ7PBYA2RYKMTJLJIG7LBA4JSQJ4Y3L3UMA",
            "type": "transfer",
            "denomination": "USDC",
            "source": "3XBWFSSX2FZ6QQSTI5FGJNYEEGVWSXYUOWWZV3YSW3LAPVHTSKRV6CASFY",
            "destination": "CFADRLIEHBHKLCVCO6EIEMUSSBUYRECMIFMFV6RHBGJ37SVOW4VIGF36WQ",
            "date": 1670412912,
            "amount": 100000000,
            "decimals": 6
        }
    ]
}
 */

function verifyTransaction(
  { recipient, denomination }: ProtocolContext,
  tx: any
): boolean {
  if (!isTestnet && Date.now() - tx.date * 1000 > 60 * 60 * 1000) {
    return false;
  }

  const event = tx.events.find(
    (e: any) =>
      e.destination &&
      (e.destination === recipient ||
        e.destination.toLowerCase() === recipient.toLowerCase())
  );
  if (!event) {
    return false;
  }

  // we could check for amount also
  return event.denomination.indexOf(denomination) !== -1;
}

function getProtocolContext(protocol: string): ProtocolContext {
  switch (protocol) {
    case "eth":
      return {
        protocol: "ethereum",
        network: isTestnet ? "goerli" : "mainnet",
        recipient: process.env.NEXT_PUBLIC_USDC_DEPOSIT_ACCOUNT_ETH || "",
        denomination: isTestnet
          ? "0x07865c6e87b9f70255377e024ace6630c1eaa37f"
          : "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      };
    case "sol":
      return {
        protocol: "solana",
        network: "mainnet", // no testnet supported yet
        recipient: process.env.NEXT_PUBLIC_USDC_DEPOSIT_ACCOUNT_SOL || "",
        denomination: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      };
    case "algo":
      return {
        protocol: "algorand",
        network: "mainnet", // no testnet supported yet
        recipient: process.env.NEXT_PUBLIC_USDC_DEPOSIT_ACCOUNT_ALGO || "",
        denomination: "USDC",
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

    const protocolContext = getProtocolContext(proto as string);

    // see: https://ubiquity.docs.blockdaemon.com/#tag/Accountsoperation/GetTxsByAddress
    const { protocol, network } = protocolContext;
    const { response } = await client.get(`${protocol}/${network}/tx/${txId}`);

    if (response && verifyTransaction(protocolContext, response)) {
      res.status(200).json({
        status: "confirmed",
      });
    }

    res.status(404).end();
  } catch (e: any) {
    handleError({ e, res });
  }
};
