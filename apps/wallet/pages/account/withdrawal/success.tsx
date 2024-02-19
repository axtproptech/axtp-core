import { Layout } from "@/app/components/layout";
import { WithdrawalSuccess } from "@/features/account/withdrawal/withdrawalSuccess";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { RiHome6Line, RiWallet3Line } from "react-icons/ri";
import { useTranslation } from "next-i18next";

export async function getServerSideProps(context: any) {
  const { locale, query } = context;
  return {
    props: {
      token: query.token,
      amount: query.amount,
      currency: query.currency,
      ...(await serverSideTranslations(locale, ["common", "withdrawal"])),
      // Will be passed to the page component as props
    },
  };
}

export default function Page({ token, amount, currency }: any) {
  const { t } = useTranslation();
  const bottomNav = [
    {
      route: "/",
      label: t("home"),
      icon: <RiHome6Line />,
    },
    {
      route: "/account",
      label: t("account"),
      icon: <RiWallet3Line />,
    },
  ];

  return (
    <Layout bottomNav={bottomNav}>
      <WithdrawalSuccess token={token} amount={amount} currency={currency} />
    </Layout>
  );
}
