import {
  AnyAction,
  combineReducers,
  configureStore,
  Reducer,
} from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { isClientSide } from "@/app/isClientSide";
import { appSlice } from "@/app/states/appState";
import { storage } from "./storage";
import { accountSlice } from "@/app/states/accountState";
import { tokenSlice } from "@/app/states/tokenState";
import { marketSlice } from "@/app/states/marketState";
import { poolsSlice } from "@/app/states/poolsState";

function persist<T = any>(config: any, reducer: Reducer) {
  return isClientSide()
    ? persistReducer<T, AnyAction>(config, reducer)
    : reducer;
}

const appPersistConfig = {
  key: "app",
  version: 1,
  storage,
  // persist only the mentioned fields.
  whitelist: ["themeMode"],
};

const accountPersistConfig = {
  key: "account",
  version: 1,
  storage,
};

const tokenPersistConfig = {
  key: "token",
  version: 1,
  storage,
};

const poolPersistConfig = {
  key: "pools",
  version: 1,
  storage,
};

const marketPersistConfig = {
  key: "market",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  appState: persist<ReturnType<typeof appSlice.reducer>>(
    appPersistConfig,
    appSlice.reducer
  ),
  accountState: persist<ReturnType<typeof accountSlice.reducer>>(
    accountPersistConfig,
    accountSlice.reducer
  ),
  tokenState: persist<ReturnType<typeof tokenSlice.reducer>>(
    tokenPersistConfig,
    tokenSlice.reducer
  ),
  poolState: persist<ReturnType<typeof poolsSlice.reducer>>(
    poolPersistConfig,
    poolsSlice.reducer
  ),
  marketState: persist<ReturnType<typeof marketSlice.reducer>>(
    marketPersistConfig,
    marketSlice.reducer
  ),
  // add more states here
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
