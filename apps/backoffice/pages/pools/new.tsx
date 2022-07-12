import { Layout } from "@/app/components/Layout";
import { CreatePool } from "@/features/pools";

export default function poolsPage() {
  return (
    <Layout>
      <CreatePool />
    </Layout>
  );
}
