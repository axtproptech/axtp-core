import Head from "next/head";
import { ThemeProvider } from "styled-components";
import { theme } from "common/theme/cryptoModern";
import ResetCSS from "common/assets/css/style";
import Sticky from "react-stickynode";
import Navbar from "containers/CryptoModern/Navbar";
import Banner from "containers/CryptoModern/Banner";
import Features from "containers/CryptoModern/FeatureSection";
import ExpertsTeam from "containers/CryptoModern/ExpertsTeam";
import MarketsPortal from "containers/CryptoModern/Markets";
import BlockchainProjects from "containers/CryptoModern/BlockchainProjects";
import FaqSection from "containers/CryptoModern/FaqSection";
import Register from "containers/CryptoModern/Newsletter";
import Footer from "containers/CryptoModern/Footer";
import GlobalStyle, {
  CryptoWrapper,
  ContentWrapper,
} from "containers/CryptoModern/cryptoModern.style";
import { MessageBox } from "containers/CryptoModern/MessageBox";
import Compliance from "containers/CryptoModern/Compliance";

const CryptoModern = () => {
  return (
    <ThemeProvider theme={theme}>
      <>
        <Head>
          <title>AXT PropTech Company S/A</title>
          <meta
            name="Description"
            content="Welcome to the world of digital assets"
          />
          <meta name="theme-color" content="#2563FF" />
          <meta
            name="keywords"
            content="blockchain, proptech, web3, signum, smart contracts, reit, real estate"
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
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.axtp.com.br/" />
          <meta property="og:title" content="AXTP PropTech Company S/A" />
          <meta
            property="og:description"
            content="Welcome to the world of digital assets"
          />
          <meta
            property="og:image"
            content="https://www.axtp.com.br/axtp-seo.jpg"
          />
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://www.axtp.com.br/" />
          <meta property="twitter:title" content="AXTP PropTech Company S/A" />
          <meta
            property="twitter:description"
            content="Welcome to the world of digital assets"
          />
          <meta
            property="twitter:image"
            content="https://www.axtp.com.br/axtp-seo.jpg"
          />
        </Head>
        {/* end of head */}

        <ResetCSS />
        <GlobalStyle />
        {/* end of global and reset style */}

        {/* start app classic landing */}
        <CryptoWrapper>
          <MessageBox />
          <Sticky top={0} innerZ={9999} activeClass="sticky-active">
            <Navbar />
          </Sticky>
          <ContentWrapper>
            <Banner />
            {/*<CountDown />*/}
            <Features />
            <ExpertsTeam />
            <MarketsPortal />
            <BlockchainProjects />
            <Compliance />
            {/*<WalletSection />*/}
            {/*<MapSection />*/}
            <FaqSection />
            <Register />
          </ContentWrapper>
          <Footer />
        </CryptoWrapper>
        {/* end of app classic landing */}
      </>
    </ThemeProvider>
  );
};
export default CryptoModern;
