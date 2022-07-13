import { AuthLayout } from "@/app/components/Layout/AuthLayout";
import { Login } from "@/features/auth/Login";
import { getProviders } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "../api/auth/[...nextauth]";

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(req, res, authOptions);
  console.log("Check", session);

  if (session) {
    return {
      redirect: {
        destination: "/",
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
    <AuthLayout>
      <Login providers={providers} />
    </AuthLayout>
  );
}
