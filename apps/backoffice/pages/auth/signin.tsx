import { Login } from "@/features/auth/login";
import { getProviders } from "next-auth/react";
import { getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { MinimumLayout } from "@/app/components/layout/minimumLayout";

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

export default function Page({ providers }: any) {
  return (
    <MinimumLayout>
      <Login providers={providers} />
    </MinimumLayout>
  );
}
