import { Login } from "@/features/auth/Login";
import { getProviders } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { MinimumLayout } from "@/app/components/Layout/minimumLayout";

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(req, res, authOptions);
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

export default function homePage({ providers }: any) {
  return (
    <MinimumLayout>
      <Login providers={providers} />
    </MinimumLayout>
  );
}
