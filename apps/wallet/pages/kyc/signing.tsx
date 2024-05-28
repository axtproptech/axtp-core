import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { RiArrowLeftCircleLine, RiHome6Line, RiSaveLine } from "react-icons/ri";
import { useTranslation } from "next-i18next";
import { Layout } from "@/app/components/layout";
import { WithAccountOnly } from "@/app/components/withAccountOnly";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { useState } from "react";
import { TermsSigning } from "@/features/kyc/termsSigning";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      // Will be passed to the page component as props
    },
  };
}

export default function Signing() {
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
        <TermsSigning onNavChange={setBottomNav} />
      </Layout>
    </WithAccountOnly>
  );
}
