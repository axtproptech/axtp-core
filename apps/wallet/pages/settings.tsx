import { Layout } from "@/app/components/layout";
import { MetaTags } from "@/app/components/metaTags";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { RiArrowLeftCircleLine, RiHome6Line } from "react-icons/ri";
import { useTranslation } from "next-i18next";
import { Settings } from "@/features/settings";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      // Will be passed to the page component as props
    },
  };
}

export default function Page() {
  const { t } = useTranslation();

  const bottomNav: BottomNavigationItem[] = [
    {
      label: t("back"),
      back: true,
      icon: <RiArrowLeftCircleLine />,
    },
    {
      label: t("home"),
      route: "/",
      icon: <RiHome6Line />,
    },
  ];
  return (
    <Layout bottomNav={bottomNav}>
      <MetaTags
        title="AXT PropTech S/A"
        description={""}
        // add here an image for SEO
        // imgUrl={some image url}
        keywords="tokenomics, real estate, blockchain, signum, sustainable"
      />
      <Settings />
    </Layout>
  );
}
