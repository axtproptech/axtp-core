import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DefaultTokenData, TokenData } from "@/types/tokenData";

export interface TokenState {
  axt: TokenData;
  poolTokens: {
    [key: string]: TokenData;
  };
}

const initialState: TokenState = {
  axt: DefaultTokenData,
  poolTokens: {},
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    updateAXTToken: (state, action: PayloadAction<TokenData>) => {
      state.axt = action.payload;
    },
    updatePoolTokenData: (state, action: PayloadAction<TokenData>) => {
      const { id } = action.payload;
      console.log("updatePoolTokenData", action.payload);

      state.poolTokens[id] = action.payload;
    },
  },
});

export const { actions: tokenActions } = tokenSlice;
