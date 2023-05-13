import Head from "next/head";
import Footer from "containers/CryptoModern/Footer";
import { BlogEntryPage } from "containers/Exclusive/Blog/Entry";
import {
  CryptoWrapper,
  ContentWrapper,
} from "containers/CryptoModern/cryptoModern.style";
import { contentService } from "bff/services/contentfulService";

const PreviewBlogEntryPage = ({ article }) => {
  return (
    <>
      <Head>
        <title>Blog - AXT PropTech Company S/A</title>
        <meta
          name="Description"
          content="Blog posts from the AXTP PropTech Company and community. Discover the latest in our investment platform."
        />
      </Head>

      <CryptoWrapper>
        <ContentWrapper>
          <BlogEntryPage entry={article} />
        </ContentWrapper>

        <Footer />
      </CryptoWrapper>
    </>
  );
};

export async function getServerSideProps({ params }) {
  const article = await contentService.fetchSingleArticle(params.entryId, true);

  if (!article) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      article,
    },
  };
}

export default PreviewBlogEntryPage;
