import { Layout } from "@/app/components/layout";
import { AllCustomersOverview } from "@/features/customers/view/allCustomersOverview";
import { SingleCustomer } from "@/features/customers/view/singleCustomer";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { getProviders } from "next-auth/react";

export async function getServerSideProps({
  params,
}: GetServerSidePropsContext) {
  return {
    props: {
      cuid: params?.cuid,
    },
  };
}

export default function customersPage({ cuid }: any) {
  return (
    <Layout>
      <SingleCustomer cuid={cuid || ""} />
    </Layout>
  );
}
