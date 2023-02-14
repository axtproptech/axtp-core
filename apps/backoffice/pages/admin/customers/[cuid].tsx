import { Layout } from "@/app/components/layout";
import { SingleCustomer } from "@/features/customers/view/singleCustomer";
import { GetServerSidePropsContext } from "next";

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
