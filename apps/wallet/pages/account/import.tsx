import { Layout } from "@/app/components/layout";
import { MetaTags } from "@/app/components/metaTags";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";

import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { AccountImport, OnStepChangeArgs } from "@/features/account";

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
      <MetaTags
        title="AXT PropTech S/A Account"
        description={""}
        // add here an image for SEO
        // imgUrl={some image url}
        keywords="tokenomics, real estate, blockchain, signum, sustainable"
      />
      <AccountImport onStepChange={handleStepChange} />
    </Layout>
  );
}
