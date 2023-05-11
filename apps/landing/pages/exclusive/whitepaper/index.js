import Head from "next/head";
import Navbar from "containers/Exclusive/components/Navbar";
import Footer from "containers/CryptoModern/Footer";
import { WhitepaperPage } from "containers/Exclusive/Whitepaper";
import {
  CryptoWrapper,
  ContentWrapper,
} from "containers/CryptoModern/cryptoModern.style";

const ExclusiveWhitepaper = () => {
  return (
    <>
      <Head>
        <title>AXT PropTech Company S/A - Exclusive Area</title>
      </Head>

      <Navbar />

      <CryptoWrapper>
        <ContentWrapper>
          <WhitepaperPage />
        </ContentWrapper>
        <Footer />
      </CryptoWrapper>
    </>
  );
};

export default ExclusiveWhitepaper;
