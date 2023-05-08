import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "styled-components";
import { theme } from "common/theme/cryptoModern";

import Head from "next/head";
import GlobalStyle from "containers/CryptoModern/cryptoModern.style";
import ResetCSS from "common/assets/css/style";
import "common/assets/css/tailwind.css";
import "common/assets/css/flaticon.css";
import "common/assets/css/icon-example-page.css";
import "../containers/CryptoModern/CountDown/timer.css";

import "swiper/css/bundle";
import "common/assets/css/react-slick.css";
import "common/assets/css/rc-collapse.css";
import "common/assets/css/embla.css";
import "rc-collapse/assets/index.css";

export default function CustomApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>AXT PropTech Company S/A</title>
        <meta
          name="Description"
          content="Welcome to the world of digital assets"
        />
      </Head>

      <ThemeProvider theme={theme}>
        <ResetCSS />
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}
