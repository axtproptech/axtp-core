import { Layout } from "@/app/components/layout";
import { CreatePool } from "@/features/pools";

export default function poolsPage() {
  return (
    <Layout>
      <CreatePool />
    </Layout>
  );
}
