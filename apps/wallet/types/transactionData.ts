export interface TransactionData {
  id: string;
  type: number;
  subtype: number;
  explorerUrl: string;
  dateTime: string; // ISO-DATE
  timestamp: number;
  isPending: boolean;
  direction: "out" | "in" | "self" | "burn";
  signa: number;
  feeSigna: number;
  tokens: {
    name: string;
    amount: number;
  }[];
  sender: string;
  senderAddress: string;
  receiver: string;
  receiverAddress: string;
  message: string;
  hasEncryptedMessage: boolean;
}
