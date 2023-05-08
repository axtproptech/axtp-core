import Head from "next/head";
import Navbar from "containers/Exclusive/components/Navbar";
import Footer from "containers/CryptoModern/Footer";
import CmsPage from "containers/Exclusive/Cms";
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
          <CmsPage />
        </ContentWrapper>

        <Footer />
      </CryptoWrapper>
    </>
  );
};

export default ExclusiveCmsPage;
