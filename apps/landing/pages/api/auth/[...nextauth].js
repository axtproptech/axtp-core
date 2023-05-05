import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

const NS = "axtp.com.br";
const CustomClaims = {
  cuid: `${NS}/cuid`,
  firstName: `${NS}/firstName`,
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
        session.user.firstName = token.firstName;
        delete session.email;
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile && profile[CustomClaims.cuid]) {
        token.cuid = profile[CustomClaims.cuid];
        token.firstName = profile[CustomClaims.firstName];
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
