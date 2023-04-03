import { Layout } from "@/app/components/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { JotformRegistry } from "@/features/kyc/jotformRegistry";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      // Will be passed to the page component as props
    },
  };
}

export default function NewKYCPage() {
  return (
    <Layout noBody>
      <JotformRegistry />
    </Layout>
  );
}
