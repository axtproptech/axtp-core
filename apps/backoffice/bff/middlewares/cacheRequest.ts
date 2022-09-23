import { Middleware } from "../withMiddleware";

export enum CacheType {
  Generic = "generic",
  Stats = "stats",
}

export const cacheRequest =
  (type: CacheType = CacheType.Generic): Middleware =>
  ({ res, ctx }) => {
    // @ts-ignore
    const seconds = ctx.config.cache[type];
    res.setHeader(
      "Cache-Control",
      `public,max-age=${seconds},s-maxage=${seconds}`
    );
    return true;
  };
