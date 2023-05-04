import Head from "next/head";
import { ThemeProvider } from "styled-components";
import { theme } from "common/theme/cryptoModern";
import ResetCSS from "common/assets/css/style";
import Navbar from "containers/Exclusive/components/Navbar";
import Footer from "containers/CryptoModern/Footer";
import LandingPage from "containers/Exclusive/LandingPage/index";
import GlobalStyle, {
  CryptoWrapper,
  ContentWrapper,
} from "containers/CryptoModern/cryptoModern.style";

const ExclusiveLandingPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>AXT PropTech Company S/A - Exlusive Area</title>
        <meta
          name="Description"
          content="AXT PropTech Company S/A - Exclusive Area"
        />
        <meta name="theme-color" content="#2563FF" />
        <meta
          name="keywords"
          content="blockchain, proptech, web3, signum, smart contracts"
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <ResetCSS />
      <GlobalStyle />

      <Navbar />

      <CryptoWrapper>
        <ContentWrapper>
          <LandingPage />
        </ContentWrapper>

        <Footer />
      </CryptoWrapper>
    </ThemeProvider>
  );
};

export default ExclusiveLandingPage;
