import { Layout } from "@/app/components/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import {
  RiArrowLeftCircleLine,
  RiAwardLine,
  RiHome6Line,
  RiSettings4Line,
} from "react-icons/ri";
import { AccountTransactions } from "@/features/account/transactions";
import { WithAccountOnly } from "@/app/components/withAccountOnly";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation/bottomNavigationItem";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "transactions"])),
      // Will be passed to the page component as props
    },
  };
}

export default function Page() {
  const { t } = useTranslation("common");

  const bottomNav: BottomNavigationItem[] = [
    {
      label: t("back"),
      back: true,
      icon: <RiArrowLeftCircleLine />,
    },
    {
      label: t("rewards"),
      route: "/account/rewards",
      icon: <RiAwardLine />,
    },
    {
      label: t("home"),
      route: "/",
      icon: <RiHome6Line />,
    },
  ];

  return (
    <WithAccountOnly>
      <Layout noBody bottomNav={bottomNav}>
        <AccountTransactions />
      </Layout>
    </WithAccountOnly>
  );
}
