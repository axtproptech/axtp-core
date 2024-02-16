import { Layout } from "@/app/components/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { useTranslation } from "next-i18next";
import { RiArrowLeftCircleLine, RiFileListLine } from "react-icons/ri";
import { WithAccountOnly } from "@/app/components/withAccountOnly";
import { Withdrawal } from "@/features/account/withdrawal";
import { useState } from "react";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "withdrawal"])),
      // Will be passed to the page component as props
    },
  };
}

export default function Page() {
  const { t } = useTranslation();

  const [bottomNav, setBottomNav] = useState<BottomNavigationItem[]>([
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
  ]);

  return (
    <WithAccountOnly>
      <Layout bottomNav={bottomNav}>
        <Withdrawal onNavChange={setBottomNav} />
      </Layout>
    </WithAccountOnly>
  );
}
