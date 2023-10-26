interface R2ObjectUriParts {
  accountId: string;
  bucket: string;
  objectId: string;
}

/**
 * Creates a _synthetic_ URL for the Cloudflares R2 bucket objects.
 *
 * Used for serialized object URIs in database.
 */
export class R2ObjectUri {
  constructor(private parts: R2ObjectUriParts) {}

  static fromUrl(url: string): R2ObjectUri {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "r2:") {
      throw new Error("Invalid R2 Object URI");
    }

    const objectId = parsedUrl.searchParams.get("id");
    if (!objectId) {
      throw new Error("Invalid R2 Object URI");
    }

    const [accountId, bucket] = parsedUrl.pathname.split("/");
    if (!accountId || !bucket || !objectId) {
      throw new Error("Invalid R2 Object URI");
    }

    return new R2ObjectUri({
      accountId,
      bucket,
      objectId,
    });
  }

  toString() {
    return `r2://${this.parts.accountId}/${this.parts.bucket}?id=${this.parts.objectId}`;
  }
}
