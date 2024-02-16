import { Layout } from "@/app/components/layout";
import { Home } from "@/features/home";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { RiQuestionLine, RiSettings4Line, RiWallet3Line } from "react-icons/ri";
import { BottomNavigationProps } from "react-daisyui";
import { useTranslation } from "next-i18next";
import { openExternalUrl } from "@/app/openExternalUrl";
import { useAppContext } from "@/app/hooks/useAppContext";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      // Will be passed to the page component as props
    },
  };
}

export default function Page() {
  const { t } = useTranslation();
  const { Documents } = useAppContext();
  const navigateToManual = () => {
    openExternalUrl(Documents.Manual);
  };

  return (
    <Layout
      bottomNav={[
        {
          onClick: navigateToManual,
          label: t("manual"),
          icon: <RiQuestionLine />,
        },
        {
          route: "/account",
          label: t("account"),
          icon: <RiWallet3Line />,
        },
        {
          label: t("settings"),
          route: "/settings",
          icon: <RiSettings4Line />,
        },
      ]}
    >
      <Home />
    </Layout>
  );
}
