import { Layout } from "@/app/components/layout";
import { Dashboard } from "@/features/dashboard";

export default function homePage() {
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}
