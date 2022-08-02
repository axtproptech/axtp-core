import type { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { store } from "@/states/store";
import { AppContextProvider } from "@/app/contexts/AppContext";
import { isClientSide } from "@/app/isClientSide";
import { SEOMetaTags } from "@/app/components/SEOMetaTags";
import { AppInitializer } from "@/app/components/AppInitializer";

import "./globals.css";
import * as React from "react";

const persistor = persistStore(store);

// TODO: we can get the host (Canonical) dynamically - no need for an env var here
function App({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <SEOMetaTags
        title="Fixcoin.eco"
        // canonical={Config.Platform.CanonicalUrl + router.asPath}
        // imgUrl={Config.Platform.CanonicalUrl + "/assets/img/seo.jpg"}
        keywords="Blockchain, Payback, Fidelity, Signum"
        description="bla bla bla"
        viewport="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />

      <ReduxProvider store={store}>
        {isClientSide() ? (
          <>
            <AppInitializer />
            <PersistGate loading={null} persistor={persistor}>
              <Component {...pageProps} />
            </PersistGate>
          </>
        ) : (
          <Component {...pageProps} />
        )}
      </ReduxProvider>
    </AppContextProvider>
  );
}

export default App;
