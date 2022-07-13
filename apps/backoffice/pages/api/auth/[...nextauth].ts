import NextAuth, { NextAuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

export const authOptions: NextAuthOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.NEXT_SERVER_AUTH0_CLIENT_ID || "",
      clientSecret: process.env.NEXT_SERVER_AUTH0_CLIENT_SECRET || "",
      issuer: process.env.NEXT_SERVER_AUTH0_ISSUER,
    }),
  ],
  pages: {
    signIn: "/",
  },
};

export default NextAuth(authOptions);
