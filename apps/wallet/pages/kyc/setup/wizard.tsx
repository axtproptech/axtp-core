import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Wizard } from "@/features/kyc/setup/wizard";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      // Will be passed to the page component as props
    },
  };
}

export default function WizardPage() {
  return <Wizard />;
}
