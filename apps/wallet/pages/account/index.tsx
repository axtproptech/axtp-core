import { Layout } from "@/app/components/layout";
import { MetaTags } from "@/app/components/metaTags";
import { AccountDashboard } from "@/features/account/dashboard";

export default function Page() {
  return (
    <Layout noBody>
      <MetaTags
        title="AXT PropTech Account"
        description={""}
        // add here an image for SEO
        // imgUrl={some image url}
        keywords="tokenomics, real estate, blockchain, signum, sustainable"
      />
      <AccountDashboard />
    </Layout>
  );
}
