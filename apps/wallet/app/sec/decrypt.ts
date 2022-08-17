export async function decrypt(key: CryptoKey, cipher: any, iv: Uint8Array) {
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    cipher
  );
  return new TextDecoder().decode(decrypted);
}
