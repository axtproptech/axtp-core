import Head from "next/head";
import Navbar from "containers/Exclusive/components/Navbar";
import Footer from "containers/CryptoModern/Footer";
import { ExclusiveAreaPage } from "containers/Exclusive/LandingPage";
import {
  CryptoWrapper,
  ContentWrapper,
} from "containers/CryptoModern/cryptoModern.style";
import { contentService } from "bff/services/contentfulService";
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
const ConfigRevalidate = parseInt(
  process.env.NEXT_SERVER_CMS_ISR_REVALIDATE_MINUTES || "0"
);
export async function getStaticProps() {
  const [articles, faqs, poolDescriptions, pools] = await Promise.all([
    contentService.fetchRecentArticles(),
    contentService.fetchExclusiveFAQs(),
    contentService.fetchPoolDescriptions(),
    contractViewerService.poolContract.fetchContracts({
      contractIds: PoolContractIds,
    }),
  ]);

  // merge offchain descriptions with onchain pool data
  for (let p of pools) {
    const pd = poolDescriptions.find((d) => d.content.poolId === p.poolId);
    if (pd) {
      p.description = pd.content.description;
      p.icon = pd.content.icon;
    }
  }

  return {
    props: {
      articles,
      pools,
      faqs,
    },
    revalidate: ConfigRevalidate ? ConfigRevalidate * Minute : false,
  };
}
const ExclusiveLandingPage = ({ articles, pools, faqs }) => {
  return (
    <>
      <Head>
        <title>AXT PropTech Company S/A - Exclusive Area</title>
      </Head>

      <Navbar />

      <CryptoWrapper>
        <ContentWrapper>
          <ExclusiveAreaPage articles={articles} pools={pools} faqs={faqs} />
        </ContentWrapper>
        <Footer />
      </CryptoWrapper>
    </>
  );
};

export default ExclusiveLandingPage;
