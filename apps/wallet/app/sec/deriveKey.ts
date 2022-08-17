export async function deriveKey(secret: string): Promise<CryptoKey> {
  return window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    "PBKDF2",
    false,
    ["encrypt", "decrypt"]
  );
}
