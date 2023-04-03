import type { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { store } from "@/states/store";
import { AppContextProvider } from "@/app/contexts/appContext";
import { MetaTags } from "@/app/components/metaTags";
import { AppInitializer } from "@/app/components/appInitializer";
import { appWithTranslation } from "next-i18next";

import "./globals.css";
import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/features/error";
import { log } from "next-axiom";
import { Config } from "@/app/config";

export { reportWebVitals } from "next-axiom";

const persistor = persistStore(store);

const handleError = (error: Error, info: { componentStack: string }) => {
  log.error("[Frontend] Error Boundary", { error, info });
};

function App({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <MetaTags
        title="Wallet - AXT PropTech Company S/A"
        canonical={Config.CanonicalUrl}
        imgUrl={Config.CanonicalUrl + "/assets/img/seo-wallet.jpg"}
        keywords="axt, axtp, tokenomics, real estate, blockchain, signum, sustainable, tax deed, tax lien"
        description="The AXT Wallet opens you the door to a new world of digital assets."
        viewport="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />
      <ReduxProvider store={store}>
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={handleError}>
          <PersistGate loading={null} persistor={persistor}>
            <AppInitializer />
            <Component {...pageProps} />
          </PersistGate>
        </ErrorBoundary>
      </ReduxProvider>
    </AppContextProvider>
  );
}

// @ts-ignore
export default appWithTranslation(App);
