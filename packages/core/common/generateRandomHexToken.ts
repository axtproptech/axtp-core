import crypto from "crypto";

export const generateRandomHexToken = (length: number) =>
  crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length)
    .toUpperCase();
