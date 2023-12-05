import { Layout } from "@/app/components/layout";
import { SingleCustomer } from "@/features/customers/view/singleCustomer";
import { useRouter } from "next/router";
import { singleQueryArg } from "@/app/singleQueryArg";
export default function CustomersPage() {
  const { query } = useRouter();
  const aliasId = singleQueryArg(query.aliasId);
  if (!aliasId) return null;
  return (
    <Layout>
      <SingleCustomer cuid={aliasId} />
    </Layout>
  );
}
