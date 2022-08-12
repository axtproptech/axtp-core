import { Layout } from "@/app/components/layout";
import { MetaTags } from "@/app/components/metaTags";

export default function Page() {
  return (
    <Layout>
      <MetaTags
        title="Signum R.Est"
        description={""}
        // add here an image for SEO
        // imgUrl={some image url}
        keywords="tokenomics, real estate, blockchain, signum, sustainable"
      />
      <h1> Account </h1>
    </Layout>
  );
}
