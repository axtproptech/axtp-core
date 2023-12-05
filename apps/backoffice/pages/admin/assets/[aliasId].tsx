import { Layout } from "@/app/components/layout";
import { UpdateAsset } from "@/features/assets";
import { useRouter } from "next/router";
import { singleQueryArg } from "@/app/singleQueryArg";

export default function UpdateAssetPage() {
  const { query } = useRouter();
  const aliasId = singleQueryArg(query.aliasId);
  if (!aliasId) return null;
  return (
    <Layout>
      <UpdateAsset aliasId={aliasId} />
    </Layout>
  );
}
