import { isMobile } from "react-device-detect";

const Iterations = isMobile ? 10_000 : 50_000;

export interface StretchedKey {
  salt: string;
  key: string;
}

export async function stretchKey(
  secret: string,
  saltBase64?: string
): Promise<StretchedKey> {
  const byteSalt = saltBase64
    ? new Uint8Array(Buffer.from(saltBase64, "base64"))
    : window.crypto.getRandomValues(new Uint8Array(256));
  const byteSecret = new TextEncoder().encode(secret);

  const merged = new Uint8Array(byteSalt.length + byteSecret.length);
  merged.set(byteSalt);
  merged.set(byteSecret, byteSalt.length);
  let hash = await crypto.subtle.digest("SHA-512", merged);
  for (let i = 0; i < Iterations - 1; ++i) {
    hash = await crypto.subtle.digest("SHA-512", Buffer.from(hash));
  }

  return {
    salt: Buffer.from(byteSalt).toString("base64"),
    key: Buffer.from(hash).toString("base64"),
  };
}
