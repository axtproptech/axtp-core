import { Layout } from "@/app/components/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { useTranslation } from "next-i18next";
import {
  RiArrowLeftCircleLine,
  RiHome6Line,
  RiSettings4Line,
} from "react-icons/ri";
import { WithAccountOnly } from "@/app/components/withAccountOnly";
import { AccountRewards } from "@/features/account/rewards";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "rewards"])),
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
    <WithAccountOnly>
      <Layout noBody bottomNav={bottomNav}>
        <AccountRewards />
      </Layout>
    </WithAccountOnly>
  );
}
