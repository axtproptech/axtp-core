import Head from "next/head";
import Navbar from "containers/Exclusive/components/Navbar";
import Footer from "containers/CryptoModern/Footer";
import { ExclusiveAreaPage } from "containers/Exclusive/LandingPage";
import {
  CryptoWrapper,
  ContentWrapper,
} from "containers/CryptoModern/cryptoModern.style";
import { contentService } from "../../bff/services/contentfulService";

const Hour = 60 * 60;
const Day = 24 * Hour;
export async function getStaticProps() {
  const articles = await contentService.fetchRecentArticles();

  return {
    props: {
      articles,
    },
    revalidate: Day, // In seconds
  };
}
const ExclusiveLandingPage = ({ articles }) => {
  return (
    <>
      <Head>
        <title>AXT PropTech Company S/A - Exclusive Area</title>
      </Head>

      <Navbar />

      <CryptoWrapper>
        <ContentWrapper>
          <ExclusiveAreaPage articles={articles} />
        </ContentWrapper>
        <Footer />
      </CryptoWrapper>
    </>
  );
};

export default ExclusiveLandingPage;
