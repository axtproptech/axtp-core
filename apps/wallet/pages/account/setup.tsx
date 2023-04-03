import { Layout } from "@/app/components/layout";
import { AccountSetup } from "@/features/account/accountSetup";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      // Will be passed to the page component as props
    },
  };
}

export default function Page() {
  return (
    <Layout>
      <AccountSetup />
    </Layout>
  );
}
