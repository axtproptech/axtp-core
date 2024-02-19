import retry, { AbortError } from "p-retry";
import { HttpError } from "@signumjs/http";

export function tryCall<T>(fetchFn: Function) {
  return retry(async () => {
    try {
      return (await fetchFn()) as T;
    } catch (e: any) {
      if (e instanceof HttpError) {
        if (e.status >= 400 && e.status <= 500) {
          throw new AbortError(e.data.message);
        }
      }
    }
  });
}
