import { Layout } from "@/app/components/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { Config } from "@/app/config";
import { PoolShareAcquisition } from "@/features/pool";
import { useState } from "react";
import { OnStepChangeArgs } from "@/types/onStepChangeArgs";

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
  const [bottomNav, setBottomNav] = useState<BottomNavigationItem[]>([]);

  const handleStepChange = (args: OnStepChangeArgs) => {
    setBottomNav(args.bottomNav);
  };

  return (
    <Layout noBody bottomNav={bottomNav}>
      <PoolShareAcquisition poolId={poolId} onStepChange={handleStepChange} />
    </Layout>
  );
}
