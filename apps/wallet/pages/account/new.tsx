import { Layout } from "@/app/components/layout";
import { MetaTags } from "@/app/components/metaTags";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { AccountCreation, OnStepChangeArgs } from "@/features/account/creation";
import { useState } from "react";

import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";

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
        title="AXT PropTech Account"
        description={""}
        // add here an image for SEO
        // imgUrl={some image url}
        keywords="tokenomics, real estate, blockchain, signum, sustainable"
      />
      <AccountCreation onStepChange={handleStepChange} />
    </Layout>
  );
}
