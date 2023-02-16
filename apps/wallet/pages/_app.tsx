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

export { reportWebVitals } from "next-axiom";

const persistor = persistStore(store);

const handleError = (error: Error, info: { componentStack: string }) => {
  log.error("[Frontend] Error Boundary", { error, info });
};
function App({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <MetaTags
        title="AXT PropTech S/A"
        // canonical={Config.Platform.CanonicalUrl + router.asPath}
        // imgUrl={Config.Platform.CanonicalUrl + "/assets/img/seo.jpg"}
        keywords="tokenomics, real estate, blockchain, signum, sustainable"
        description=""
        viewport="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={handleError}>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppInitializer />
            <Component {...pageProps} />
          </PersistGate>
        </ReduxProvider>
      </ErrorBoundary>
    </AppContextProvider>
  );
}

// @ts-ignore
export default appWithTranslation(App);
