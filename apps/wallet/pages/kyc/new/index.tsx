import { Layout } from "@/app/components/layout";
import { MetaTags } from "@/app/components/metaTags";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NewKYC } from "@/features/kyc/new";
import { RiHome6Line } from "react-icons/ri";

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
    <Layout
      bottomNav={[
        {
          route: "/",
          label: "Home",
          icon: <RiHome6Line />,
        },
      ]}
    >
      <MetaTags
        title="AXT PropTech S/A"
        description={""}
        // add here an image for SEO
        // imgUrl={some image url}
        keywords="tokenomics, real estate, blockchain, signum, sustainable"
      />
      <NewKYC />
    </Layout>
  );
}
