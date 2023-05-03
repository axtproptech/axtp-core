import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

const CustomClaims = {
  cuid: "axtp.com.br/cuid",
};

export const authOptions = {
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
  callbacks: {
    async session({ session, user, token }) {
      if (session && session.user && token.cuid) {
        session.user.cuid = token.cuid;
        delete session.email;
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile && profile[CustomClaims.cuid]) {
        token.cuid = profile[CustomClaims.cuid];
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
