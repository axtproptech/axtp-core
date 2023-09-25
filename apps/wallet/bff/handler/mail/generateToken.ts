import * as crypto from "crypto";
import { prisma } from "@axtp/db";

export const createTokenDatabase = async (email: string) => {
  //generate a random token of 6 digits
  const token = generateSecureToken();

  //that token should be saved on column token and the email on column email and expiredAt should be 1 hour from now
  const expiredAt = new Date(Date.now() + 60 * 60 * 1000);
  //save it in the database on table EmailVerificationTemp

  await prisma.emailVerificationTemp.upsert({
    where: { email },
    create: { email, token, expiredAt },
    update: { token, expiredAt },
  });

  return token;
};

export const generateSecureToken = (length = 6) =>
  crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length)
    .toUpperCase();
