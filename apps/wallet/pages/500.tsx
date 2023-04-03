import { Layout } from "@/app/components/layout";
import { Error500 } from "@/features/error";
import { RiArrowLeftCircleLine, RiHome6Line } from "react-icons/ri";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      // Will be passed to the page component as props
    },
  };
}

export default function Custom500() {
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
      <Error500 />
    </Layout>
  );
}
