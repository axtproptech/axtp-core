import { Layout } from "@/app/components/layout";
import { AccountDashboard } from "@/features/account/dashboard";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useAccount } from "@/app/hooks/useAccount";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { useTranslation } from "next-i18next";
import {
  RiArrowLeftCircleLine,
  RiFileListLine,
  RiHome6Line,
  RiSettings4Line,
} from "react-icons/ri";
import { WithAccountOnly } from "@/app/components/withAccountOnly";

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
      label: t("transactions"),
      route: "/account/transactions",
      icon: <RiFileListLine />,
    },
    {
      label: t("settings"),
      route: "/settings",
      icon: <RiSettings4Line />,
    },
  ];

  return (
    <WithAccountOnly>
      <Layout noBody bottomNav={bottomNav}>
        <AccountDashboard />
      </Layout>
    </WithAccountOnly>
  );
}
