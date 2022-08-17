import { Layout } from "@/app/components/layout";
import { MetaTags } from "@/app/components/metaTags";
import { AccountSetup } from "@/features/account/accountSetup";

export default function Page() {
  return (
    <Layout>
      <MetaTags
        title="AXT PropTech Account"
        description={""}
        // add here an image for SEO
        // imgUrl={some image url}
        keywords="tokenomics, real estate, blockchain, signum, sustainable"
      />
      <AccountSetup />
    </Layout>
  );
}
