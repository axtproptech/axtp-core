import { Login } from "@/features/auth/login";
import { getProviders } from "next-auth/react";
import { getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import { MinimumLayout } from "@/app/components/layout/minimumLayout";
import { Container, styled } from "@mui/material";

const Background = styled("div")({
  position: "absolute",
  width: "100%",
  height: "100%",
  backgroundImage: "url(./landing-bg.jpg)",
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
});

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
    <>
      <Background />
      <Container sx={{ minHeight: "100vh", p: 4, position: "relative" }}>
        <Login providers={providers} />
      </Container>
    </>
  );
}
