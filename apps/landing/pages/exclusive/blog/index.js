import Head from "next/head";
import Navbar from "containers/Exclusive/components/Navbar";
import Footer from "containers/CryptoModern/Footer";
import { BlogPage } from "containers/Exclusive/Blog";
import {
  CryptoWrapper,
  ContentWrapper,
} from "containers/CryptoModern/cryptoModern.style";
import { contentService } from "bff/services/contentfulService";

const Minute = 60;
const Hour = 60 * Minute;
const Day = 24 * Hour;
const ConfigRevalidate = parseInt(
  process.env.NEXT_SERVER_CMS_ISR_REVALIDATE_MINUTES || "0"
);
export async function getStaticProps() {
  const articles = await contentService.fetchRecentArticles();

  return {
    props: {
      articles,
    },
    revalidate: ConfigRevalidate ? ConfigRevalidate * Minute : 1,
  };
}

const ExclusiveBlogPage = ({ articles }) => {
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
          <BlogPage articles={articles} />
        </ContentWrapper>
        <Footer />
      </CryptoWrapper>
    </>
  );
};

export default ExclusiveBlogPage;
