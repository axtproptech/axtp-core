import Head from "next/head";
import Navbar from "containers/Exclusive/components/Navbar";
import Footer from "containers/CryptoModern/Footer";
import { ExclusiveAreaPage } from "containers/Exclusive/LandingPage";
import {
  CryptoWrapper,
  ContentWrapper,
} from "containers/CryptoModern/cryptoModern.style";
import { contentService } from "../../bff/services/contentfulService";
import { SmartContractViewerService } from "@axtp/core";

const AxtcContractId = process.env.NEXT_PUBLIC_MASTER_CONTRACT_ID || "";
const SignumNodeHost = process.env.NEXT_PUBLIC_SIGNUM_NODE_HOST || "";
const PoolContractIds = (process.env.NEXT_PUBLIC_AXTP_CONTRACT_IDS || "").split(
  ","
);
const contractViewerService = new SmartContractViewerService(
  SignumNodeHost,
  AxtcContractId
);

const Minute = 60;
const Hour = 60 * Minute;
const Day = 24 * Hour;
export async function getStaticProps() {
  const [articles, pools] = await Promise.all([
    contentService.fetchRecentArticles(),
    contractViewerService.poolContract.fetchContracts({
      contractIds: PoolContractIds,
    }),
  ]);

  return {
    props: {
      articles,
      pools,
    },
    revalidate: 15 * Minute,
  };
}
const ExclusiveLandingPage = ({ articles, pools }) => {
  return (
    <>
      <Head>
        <title>AXT PropTech Company S/A - Exclusive Area</title>
      </Head>

      <Navbar />

      <CryptoWrapper>
        <ContentWrapper>
          <ExclusiveAreaPage articles={articles} pools={pools} />
        </ContentWrapper>
        <Footer />
      </CryptoWrapper>
    </>
  );
};

export default ExclusiveLandingPage;
