export async function decrypt(key: CryptoKey, encryptedB64: string) {
  const [iv, cipher] = encryptedB64.split(".");
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: Buffer.from(iv, "base64"),
    },
    key,
    Buffer.from(cipher, "base64")
  );
  return new TextDecoder().decode(decrypted);
}
