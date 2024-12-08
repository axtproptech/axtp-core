import { Layout } from "@/app/components/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Config } from "@/app/config";
import { PoolShareAcquisition } from "@/features/pool";
import { useState } from "react";
import { OnStepChangeArgs } from "@/types/onStepChangeArgs";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation/bottomNavigationItem";
import { RiHome6Line } from "react-icons/ri";
import { useTranslation } from "next-i18next";

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
  return (
    <Layout
      noBody
      bottomNav={[{ route: "/", icon: <RiHome6Line />, label: t("home") }]}
    >
      <PoolShareAcquisition poolId={poolId} />
    </Layout>
  );
}
