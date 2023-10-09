interface CreateR2BucketObjectUrlArgs {
  accountId: string;
  bucket: string;
  objectId: string;
}

/**
 * Creates a _synthetic_ URL for the Cloudflares R2 bucket objects.
 *
 * Use `parseR2BucketObjectUrl` to parse the URL.
 *
 * @param {CreateR2BucketObjectUrlArgs} args
 * @return  {string} URL
 */
export function createR2BucketObjectUrl({
  objectId,
  bucket,
  accountId,
}: CreateR2BucketObjectUrlArgs) {
  return `r2://${accountId}/${bucket}?id=${objectId}`;
}

/**
 * Parses a R2 bucket object URL created with `createR2BucketObjectUrl`.
 *
 * @param {string} url
 * @return  {CreateR2BucketObjectUrlArgs}
 *
 */
export function parseR2BucketObjectUrl(
  url: string
): CreateR2BucketObjectUrlArgs {
  const parsedUrl = new URL(url);
  if (parsedUrl.protocol !== "r2:") {
    throw new Error("Invalid R2 URL");
  }

  const objectId = parsedUrl.searchParams.get("id");
  if (!objectId) {
    throw new Error("Invalid R2 URL");
  }

  const [accountId, bucket] = parsedUrl.pathname.split("/");
  if (!accountId || !bucket || !objectId) {
    throw new Error("Invalid R2 URL");
  }

  return {
    accountId,
    bucket,
    objectId,
  };
}
