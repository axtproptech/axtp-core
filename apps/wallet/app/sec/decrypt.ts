import { decryptAES } from "@signumjs/crypto";

export async function decrypt(key: string, cipher: string): Promise<string> {
  return Promise.resolve(decryptAES(cipher, key));
}
