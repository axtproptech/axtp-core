import { Layout } from "@/app/components/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { HomeKYC } from "@/features/kyc/home";
import { RiHome6Line } from "react-icons/ri";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      // Will be passed to the page component as props
    },
  };
}

export default function HomeKYCPage() {
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
      <HomeKYC />
    </Layout>
  );
}
