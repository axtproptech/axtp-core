import Head from "next/head";
import Navbar from "containers/Exclusive/components/Navbar";
import Footer from "containers/CryptoModern/Footer";
import CmsEntryPage from "containers/Exclusive/Cms/entry";
import {
  CryptoWrapper,
  ContentWrapper,
} from "containers/CryptoModern/cryptoModern.style";

const ExclusiveCmsEntryPage = () => {
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
          <CmsEntryPage />
        </ContentWrapper>

        <Footer />
      </CryptoWrapper>
    </>
  );
};

export default ExclusiveCmsEntryPage;
