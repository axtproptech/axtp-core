import { Layout } from "@/app/components/layout";
import dynamic from "next/dynamic";

const DynamicManageLiquidity = dynamic(
  () => import("@/features/liquidity/view/ManageLiquidity"),
  {
    loading: () => null,
    ssr: false,
  }
);
export default function manageLiquidityPage() {
  return (
    <Layout>
      <DynamicManageLiquidity />
    </Layout>
  );
}
