import { Layout } from "@/app/components/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { useTranslation } from "next-i18next";
import { RiArrowLeftCircleLine, RiFileListLine } from "react-icons/ri";
import { WithAccountOnly } from "@/app/components/withAccountOnly";
import { Withdrawal } from "@/features/account/withdrawal";
import { useEffect, useLayoutEffect, useState } from "react";
import { useAccount } from "@/app/hooks/useAccount";
import { useRouter } from "next/router";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "withdrawal"])),
      // Will be passed to the page component as props
    },
  };
}

export default function Page() {
  const { t } = useTranslation();
  const { customer } = useAccount();
  const router = useRouter();

  const [bottomNav, setBottomNav] = useState<BottomNavigationItem[]>([
    {
      label: t("back"),
      back: true,
      icon: <RiArrowLeftCircleLine />,
    },
  ]);

  useLayoutEffect(() => {
    if (!customer?.hasBankInformation) {
      router.replace("/kyc/banking?redirect=/account/withdrawal", undefined, {
        shallow: true,
      });
    }
  }, [customer, router]);

  return (
    <WithAccountOnly>
      <Layout bottomNav={bottomNav}>
        <Withdrawal onNavChange={setBottomNav} />
      </Layout>
    </WithAccountOnly>
  );
}
