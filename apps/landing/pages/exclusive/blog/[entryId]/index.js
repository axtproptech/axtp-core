import Head from "next/head";
import Navbar from "containers/Exclusive/components/Navbar";
import Footer from "containers/CryptoModern/Footer";
import { BlogEntryPage } from "containers/Exclusive/Blog/Entry";
import {
  CryptoWrapper,
  ContentWrapper,
} from "containers/CryptoModern/cryptoModern.style";
import { contentService } from "../../../../bff/services/contentfulService/contentfulService";

const Hour = 60 * 60;
const Day = 24 * Hour;

export async function getStaticProps({ params }) {
  const article = await contentService.fetchSingleArticle(params.entryId);

  if (!article) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      article,
    },
    revalidate: Day, // In seconds
  };
}

export async function getStaticPaths() {
  const articles = await contentService.fetchRecentArticles();
  return {
    paths: articles.map((a) => ({ params: { entryId: a.id } })),
    fallback: "blocking",
  };
}

const ExclusiveBlogEntryPage = ({ article }) => {
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
          <BlogEntryPage entry={article} />
        </ContentWrapper>

        <Footer />
      </CryptoWrapper>
    </>
  );
};

export default ExclusiveBlogEntryPage;
