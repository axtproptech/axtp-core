import { TokenMetaData } from "@/types/tokenMetaData";

export interface TokenData extends TokenMetaData {
  supply: string;
  numHolders: number;
}

export const DefaultTokenData: TokenData = {
  supply: "0",
  decimals: 0,
  name: "",
  id: "",
  numHolders: 0,
};
