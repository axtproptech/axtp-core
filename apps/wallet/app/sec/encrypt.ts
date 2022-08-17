import { encryptAES } from "@signumjs/crypto";

export function encrypt(key: string, message: string): Promise<string> {
  return Promise.resolve(encryptAES(message, key));
}
