import type { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { store } from "@/states/store";
import { AppContextProvider } from "@/app/contexts/appContext";
import { MetaTags } from "@/app/components/metaTags";
import { AppInitializer } from "@/app/components/appInitializer";

import "./globals.css";
import * as React from "react";

const persistor = persistStore(store);

function App({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <MetaTags
        title="Fixcoin.eco"
        // canonical={Config.Platform.CanonicalUrl + router.asPath}
        // imgUrl={Config.Platform.CanonicalUrl + "/assets/img/seo.jpg"}
        keywords="Blockchain, Payback, Fidelity, Signum"
        description="bla bla bla"
        viewport="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />
      <ReduxProvider store={store}>
        <AppInitializer />
        <PersistGate loading={null} persistor={persistor}>
          <Component {...pageProps} />
        </PersistGate>
      </ReduxProvider>
    </AppContextProvider>
  );
}

export default App;
