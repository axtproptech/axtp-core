import { Layout } from "@/app/components/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import {
  RiWallet3Line,
  RiArrowLeftCircleLine,
  RiHome6Line,
} from "react-icons/ri";
import { useMemo } from "react";
import { useAccount } from "@/app/hooks/useAccount";
import { PoolAssetDetails } from "@/features/pool";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation/bottomNavigationItem";

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale || "pt-BR", [
        "common",
        "assets",
      ])),
    },
  };
}

export default function Page() {
  const { t } = useTranslation();
  const { query } = useRouter();
  const poolId = query?.poolId as string;
  const aliasId = query?.aliasId as string;
  const account = useAccount();
  const bottomNav: BottomNavigationItem[] = useMemo(() => {
    const nav = [
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

    if (account) {
      nav.push({
        route: "/account",
        label: t("account"),
        icon: <RiWallet3Line />,
      });
    }

    return nav;
  }, [account, t]);

  return (
    <Layout noBody bottomNav={bottomNav}>
      <PoolAssetDetails poolId={poolId} aliasId={aliasId} />
    </Layout>
  );
}
