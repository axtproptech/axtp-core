import "./globals.css";
import type { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { AppContextProvider } from "@/app/contexts/AppContext";
import { store, storePersistor } from "@/states/store";
import { AppInitializer } from "@/app/components/AppInitializer";

function App({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <ReduxProvider store={store}>
        <AppInitializer />
        <PersistGate loading={null} persistor={storePersistor}>
          <Component {...pageProps} />
        </PersistGate>
      </ReduxProvider>
    </AppContextProvider>
  );
}

export default App;
