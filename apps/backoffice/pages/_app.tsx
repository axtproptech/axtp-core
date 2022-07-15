import "./globals.css";
import type { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { AppContextProvider } from "@/app/contexts/AppContext";
import { store, storePersistor } from "@/states/store";
import { AppInitializer } from "@/app/components/appInitializer";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { theme } from "@/app/themes";
import { NavigationScroll } from "@/app/components/layout/NavigationScroll";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <AppContextProvider>
        <ReduxProvider store={store}>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme()}>
              <CssBaseline />
              <AppInitializer />
              <PersistGate loading={null} persistor={storePersistor}>
                <NavigationScroll>
                  <Component {...pageProps} />
                </NavigationScroll>
              </PersistGate>
            </ThemeProvider>
          </StyledEngineProvider>
        </ReduxProvider>
      </AppContextProvider>
    </SessionProvider>
  );
}
