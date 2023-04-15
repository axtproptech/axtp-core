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
  RiHome6Line,
  RiSettings4Line,
  RiFileListLine,
} from "react-icons/ri";
import { AccountTransactions } from "@/features/account/transactions";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      // Will be passed to the page component as props
    },
  };
}

export default function Page() {
  const router = useRouter();
  const { t } = useTranslation();
  const { accountId } = useAccount();

  useEffect(() => {
    if (!accountId && router) {
      router.replace("/account/setup");
    }
  }, [accountId, router]);

  if (!accountId) return null;

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
    {
      label: t("settings"),
      route: "/settings",
      icon: <RiSettings4Line />,
    },
  ];

  return (
    <Layout noBody bottomNav={bottomNav}>
      <AccountTransactions />
    </Layout>
  );
}
