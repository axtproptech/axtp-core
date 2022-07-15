import { Layout } from "@/app/components/layout";
import { ManageLiquidity } from "@/features/liquidity";

export default function poolsPage() {
  return (
    <Layout>
      <ManageLiquidity />
    </Layout>
  );
}
