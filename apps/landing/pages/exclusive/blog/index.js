import Head from "next/head";
import Navbar from "containers/Exclusive/components/Navbar";
import Footer from "containers/CryptoModern/Footer";
import ExclusiveAreaPage from "containers/Exclusive/LandingPage/index";
import {
  CryptoWrapper,
  ContentWrapper,
} from "containers/CryptoModern/cryptoModern.style";

const ExclusiveCmsPage = () => {
  return (
    <>
      <Head>
        <title>Blog - AXT PropTech Company S/A</title>
        <meta
          name="Description"
          content="Blog posts from the AXTP PropTech Company and community. Discover the latest in our investment platform."
        />
      </Head>

      <Navbar />

      <CryptoWrapper>
        <ContentWrapper>
          <ExclusiveAreaPage />
        </ContentWrapper>

        <Footer />
      </CryptoWrapper>
    </>
  );
};

export default ExclusiveCmsPage;
