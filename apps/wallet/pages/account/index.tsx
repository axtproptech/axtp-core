import { Layout } from "@/app/components/layout";
import { AccountDashboard } from "@/features/account/dashboard";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { useTranslation } from "next-i18next";
import {
  RiFileListLine,
  RiAwardLine,
  RiDownload2Line,
  RiHome6Line,
} from "react-icons/ri";
import { WithAccountOnly } from "@/app/components/withAccountOnly";
import { useAccount } from "@/app/hooks/useAccount";

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
  const {
    accountData: { balanceAXTC },
  } = useAccount();

  const bottomNav: BottomNavigationItem[] = [
    {
      label: t("home"),
      route: "/",
      icon: <RiHome6Line />,
    },
    {
      label: t("rewards"),
      route: "/account/rewards",
      icon: <RiAwardLine />,
    },
    {
      label: t("transactions"),
      route: "/account/transactions",
      icon: <RiFileListLine />,
    },
  ];

  const canWithdraw = Number(balanceAXTC) > 0;
  if (canWithdraw) {
    bottomNav.push({
      label: t("withdrawal"),
      route: "/account/withdrawal",
      icon: <RiDownload2Line />,
    });
  }

  return (
    <WithAccountOnly>
      <Layout noBody bottomNav={bottomNav}>
        <AccountDashboard />
      </Layout>
    </WithAccountOnly>
  );
}
