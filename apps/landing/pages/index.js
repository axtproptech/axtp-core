import Head from "next/head";
import { ThemeProvider } from "styled-components";
import { theme } from "common/theme/cryptoModern";
import ResetCSS from "common/assets/css/style";
import Sticky from "react-stickynode";
import Navbar from "containers/CryptoModern/Navbar";
import Banner from "containers/CryptoModern/Banner";
import CountDown from "containers/CryptoModern/CountDown";
import Features from "containers/CryptoModern/FeatureSection";
import WorkHistory from "containers/CryptoModern/WorkHistory";
import Investment from "containers/CryptoModern/Investment";
import FundRaising from "containers/CryptoModern/FundRaising";
import Privacypolicy from "containers/CryptoModern/Privacy";
import WalletSection from "containers/CryptoModern/WalletSection";
import MapSection from "containers/CryptoModern/MapSection";
import FaqSection from "containers/CryptoModern/FaqSection";
import Newsletter from "containers/CryptoModern/Newsletter";
import Footer from "containers/CryptoModern/Footer";
import GlobalStyle, {
  CryptoWrapper,
  ContentWrapper,
} from "containers/CryptoModern/cryptoModern.style";

const CryptoModern = () => {
  return (
    <ThemeProvider theme={theme}>
      <>
        <Head>
          <title>AXT PropTech Company S/A - Landing</title>
          <meta
            name="Description"
            content="AXT PropTech Company S/A - Landing"
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
        {/* end of head */}

        <ResetCSS />
        <GlobalStyle />
        {/* end of global and reset style */}

        {/* start app classic landing */}
        <CryptoWrapper>
          <Sticky top={0} innerZ={9999} activeClass="sticky-active">
            <Navbar />
          </Sticky>
          <ContentWrapper>
            <Banner />
            {/*<CountDown />*/}
            <Features />
            <WorkHistory />
            <Investment />
            <FundRaising />
            <Privacypolicy />
            {/*<WalletSection />*/}
            {/*<MapSection />*/}
            <FaqSection />
            <Newsletter />
          </ContentWrapper>
          <Footer />
        </CryptoWrapper>
        {/* end of app classic landing */}
      </>
    </ThemeProvider>
  );
};
export default CryptoModern;
