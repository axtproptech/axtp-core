import { Layout } from "@/app/components/layout";
import { MetaTags } from "@/app/components/metaTags";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NewKYC } from "@/features/kyc/new";
import { RiHome6Line } from "react-icons/ri";
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
    <Layout>
      <MetaTags
        title="AXT PropTech S/A"
        description={""}
        // add here an image for SEO
        // imgUrl={some image url}
        keywords="tokenomics, real estate, blockchain, signum, sustainable"
      />
      <JotformRegistry />
    </Layout>
  );
}
