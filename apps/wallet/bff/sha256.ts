import { createHash } from "crypto";

export function sha256(message: string) {
  const hash = createHash("sha256");
  hash.update(message);
  return hash.digest("hex");
}
