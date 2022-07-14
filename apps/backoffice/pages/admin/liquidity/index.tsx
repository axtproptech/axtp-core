import { Layout } from "@/app/components/Layout";
import { ManageLiquidity } from "@/features/liquidity";

export default function poolsPage() {
  return (
    <Layout>
      <ManageLiquidity />
    </Layout>
  );
}
