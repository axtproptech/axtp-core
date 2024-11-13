import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { RiArrowLeftCircleLine, RiHome6Line, RiSaveLine } from "react-icons/ri";
import { useTranslation } from "next-i18next";
import { Layout } from "@/app/components/layout";
import { BankingInformation } from "@/features/kyc/bankingInformation";
import { WithAccountOnly } from "@/app/components/withAccountOnly";
import { useState } from "react";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation/bottomNavigationItem";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      // Will be passed to the page component as props
    },
  };
}

export default function Banking() {
  const { t } = useTranslation();
  const [bottomNav, setBottomNav] = useState<BottomNavigationItem[]>([
    {
      label: t("back"),
      back: true,
      icon: <RiArrowLeftCircleLine />,
    },
    {
      label: t("save"),
      icon: <RiSaveLine />,
      disabled: true,
    },
  ]);
  return (
    <WithAccountOnly>
      <Layout bottomNav={bottomNav}>
        <BankingInformation onNavChange={setBottomNav} />
      </Layout>
    </WithAccountOnly>
  );
}
