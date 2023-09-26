import * as crypto from "crypto";
import { prisma } from "@axtp/db";
import { getEnvVar } from "@/bff/getEnvVar";

const EXPIRE_EMAIL_TOKEN_TIME_MINUTES = Number(
  getEnvVar("NEXT_SERVER_EMAIL_EXPIRE_TOKEN_TIME_MINUTES")
);

export const generateAndStoreEmailVerificationToken = async (email: string) => {
  const token = generateSecureToken();

  const expiredAt = new Date(
    Date.now() + EXPIRE_EMAIL_TOKEN_TIME_MINUTES * 60 * 1000
  );

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
