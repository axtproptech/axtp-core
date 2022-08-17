import { Layout } from "@/app/components/layout";
import { Error404Page } from "@/features/error";
import { MetaTags } from "@/app/components/metaTags";
import { RiArrowLeftCircleLine, RiHome6Line } from "react-icons/ri";
import { useTranslation } from "next-i18next";

export default function Custom404() {
  const { t } = useTranslation();

  return (
    <Layout
      bottomNav={[
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
      ]}
    >
      <MetaTags
        title="Signum R.Est - Meh!"
        description={""}
        // add here an image for SEO
        // imgUrl={some image url}
        keywords="tokenomics, real estate, blockchain, signum, sustainable"
      />
      <Error404Page />
    </Layout>
  );
}
