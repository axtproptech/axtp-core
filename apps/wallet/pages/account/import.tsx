import { Layout } from "@/app/components/layout";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";

import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { AccountImport } from "@/features/account";
import { OnStepChangeArgs } from "@/types/onStepChangeArgs";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      // Will be passed to the page component as props
    },
  };
}

export default function Page() {
  const [bottomNav, setBottomNav] = useState<BottomNavigationItem[]>([]);

  const handleStepChange = (args: OnStepChangeArgs) => {
    setBottomNav(args.bottomNav);
  };

  return (
    <Layout bottomNav={bottomNav}>
      <AccountImport onStepChange={handleStepChange} />
    </Layout>
  );
}
