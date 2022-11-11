import { Layout } from "@/app/components/layout";
import { MetaTags } from "@/app/components/metaTags";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { RiArrowLeftCircleLine, RiHome6Line } from "react-icons/ri";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { Config } from "@/app/config";
import { PoolDetails } from "@/features/pool";

export async function getStaticPaths({ locales }: any) {
  const paths = Config.Contracts.PoolContractIds.flatMap((poolId) =>
    locales.map((locale: string) => ({
      params: { poolId },
      locale,
    }))
  );
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ locale, params }: any) {
  const poolId = params?.poolId as string;

  return {
    props: {
      ...(await serverSideTranslations(locale)),
      poolId,
      // Will be passed to the page component as props
    },
  };
}

export default function Page({ poolId }: any) {
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
    <Layout noBody bottomNav={bottomNav}>
      <MetaTags
        title="AXT PropTech S/A Pool"
        description={""}
        // add here an image for SEO
        // imgUrl={some image url}
        keywords="tokenomics, real estate, blockchain, signum, sustainable"
      />
      <PoolDetails poolId={poolId} />
    </Layout>
  );
}
