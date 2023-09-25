import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { InitialSetup } from "@/features/kyc/setup/initialSetup";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      // Will be passed to the page component as props
    },
  };
}

export default function SetupPage() {
  return <InitialSetup />;
}
