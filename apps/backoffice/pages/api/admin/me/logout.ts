import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  res.redirect(
    `${process.env.NEXT_SERVER_AUTH0_ISSUER}/v2/logout?client_id=${process.env.NEXT_SERVER_AUTH0_CLIENT_ID}&returnTo=${process.env.NEXTAUTH_URL}`
  );
}
