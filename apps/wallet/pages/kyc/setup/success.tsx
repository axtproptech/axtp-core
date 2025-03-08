import useSWR, { SWRConfig } from "swr";
import { Layout } from "@/app/components/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { BackendForFrontendService } from "@/bff/backendForFrontendService";
import { RegisterSuccess } from "@/features/kyc/setup/registerSuccess";
import { CustomerSafeData } from "@/types/customerSafeData";

export async function getServerSideProps(ctx: any) {
  const { query, locale, req } = ctx;
  const queryURL = `/customer/${query.cuid}`;
  const service = new BackendForFrontendService(req);
  const data = await service.get<CustomerSafeData>(queryURL);
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
