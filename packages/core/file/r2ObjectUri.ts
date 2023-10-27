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
  constructor(private _parts: R2ObjectUriParts) {}

  static fromUrl(uri: string): R2ObjectUri {
    const result =
      /^r2:\/\/(?<accountId>.+)\/(?<bucket>.+)\?id=(?<objectId>.+)$/gi.exec(
        uri
      );

    if (result?.groups) {
      return new R2ObjectUri({
        accountId: result.groups.accountId,
        bucket: result.groups.bucket,
        objectId: result.groups.objectId,
      });
    }
    throw new Error("Invalid R2 Object URI");
  }

  get parts(): R2ObjectUriParts {
    return this._parts;
  }

  toString() {
    return `r2://${this._parts.accountId}/${this._parts.bucket}?id=${this._parts.objectId}`;
  }
}
