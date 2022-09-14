import { Layout } from "@/app/components/layout";
import { MetaTags } from "@/app/components/metaTags";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { BackendForFrontendService } from "@/bff/backendForFrontendService";
import useSWR, { SWRConfig } from "swr";
import { RegisterSuccess } from "@/features/kyc/registerSuccess";

export async function getServerSideProps(ctx: any) {
  const { query, locale, req } = ctx;
  const queryURL = `/customer/${query.cuid}`;
  const service = new BackendForFrontendService(req);
  const data = await service.get(queryURL);
  return {
    notFound: !data,
    props: {
      ...(await serverSideTranslations(locale)),
      fallback: {
        [queryURL]: data,
        fetchingUrl: queryURL,
      },
    },
  };
}

const SuccessPage = ({ url }: any) => {
  const { data } = useSWR(url);
  return (
    <Layout>
      <MetaTags
        title="AXT PropTech S/A"
        description={""}
        // add here an image for SEO
        // imgUrl={some image url}
        keywords="tokenomics, real estate, blockchain, signum, sustainable"
      />
      <RegisterSuccess customer={data} />
    </Layout>
  );
};

export default function Page({ fallback }: { fallback: any }) {
  return (
    <SWRConfig value={{ fallback }}>
      <SuccessPage url={fallback.fetchingUrl} />
    </SWRConfig>
  );
}
