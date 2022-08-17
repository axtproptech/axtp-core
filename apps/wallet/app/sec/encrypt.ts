export async function encrypt(key: CryptoKey, message: string) {
  const encoded = new TextEncoder().encode(message);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const cipher = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );
  return (
    Buffer.from(iv).toString("base64") +
    "." +
    Buffer.from(cipher).toString("base64")
  );
}
