import { BlockchainProtocolType } from "@/types/blockchainProtocolType";

export type PaymentMethod = "pix" | "usdc";

export interface AcquisitionFormData {
  paymentMethod: PaymentMethod;
  quantity: number;
  usdcProtocol: BlockchainProtocolType;
  paid: boolean;
  poolId: string;
}
