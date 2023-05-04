import { getServerSession } from "next-auth";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import { ApiHandler } from "@/bff/types/apiHandler";
import { unauthorized } from "@hapi/boom";
import { HttpClientFactory } from "@signumjs/http";

export const resetPassword: ApiHandler = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    throw unauthorized();
  }

  const http = HttpClientFactory.createHttpClient(
    `${process.env.NEXT_SERVER_AUTH0_ISSUER}`
  );
  const response = await http.post("dbconnections/change_password", {
    client_id: process.env.NEXT_SERVER_AUTH0_CLIENT_ID,
    email: session.user?.email,
    connection: process.env.NEXT_SERVER_AUTH0_CONNECTION,
  });

  console.log("Password reset", response);

  res.status(200).end();
};
