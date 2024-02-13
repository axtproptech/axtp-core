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
  persistStore,
} from "redux-persist";
import { isClientSide } from "@/app/isClientSide";
import { storage } from "./storage";

import { appSlice } from "@/app/states/appState";
import { accountSlice } from "@/app/states/accountState";
import { masterContractSlice } from "@/app/states/masterContractState";
import { burnContractSlice } from "@/app/states/burnContractState";
import { poolsSlice } from "@/app/states/poolsState";
import { notificationsSlice } from "@/app/states/notificationsState";
import { marketDataSlice } from "@/app/states/marketDataState";

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

const masterContractPersistConfig = {
  key: "masterContract",
  version: 1,
  storage,
  whitelist: ["masterContract"],
};

const burnContractPersistConfig = {
  key: "burnContract",
  version: 1,
  storage,
  whitelist: ["burnContract"],
};

const poolsPersistConfig = {
  key: "pools",
  version: 1,
  storage,
};

const notificationsPersistConfig = {
  key: "notifications",
  version: 1,
  storage,
};

const marketDataConfig = {
  key: "marketData",
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
  masterContractState: persist<ReturnType<typeof masterContractSlice.reducer>>(
    masterContractPersistConfig,
    masterContractSlice.reducer
  ),
  burnContractState: persist<ReturnType<typeof burnContractSlice.reducer>>(
    burnContractPersistConfig,
    burnContractSlice.reducer
  ),
  poolsState: persist<ReturnType<typeof poolsSlice.reducer>>(
    poolsPersistConfig,
    poolsSlice.reducer
  ),
  notificationsState: persist<ReturnType<typeof notificationsSlice.reducer>>(
    notificationsPersistConfig,
    notificationsSlice.reducer
  ),
  marketDataState: persist<ReturnType<typeof marketDataSlice.reducer>>(
    marketDataConfig,
    marketDataSlice.reducer
  ),
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

export const storePersistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
