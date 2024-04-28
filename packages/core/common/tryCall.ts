import retry, { AbortError } from "p-retry";

export function tryCall<T>(fetchFn: Function) {
  return retry(async () => {
    try {
      return (await fetchFn()) as T;
    } catch (e: any) {
      if (e.status && e.status >= 400 && e.status <= 500) {
        console.error("Unrecoverable Error", e);
        throw new AbortError(e.data.message);
      }
    }
  });
}
