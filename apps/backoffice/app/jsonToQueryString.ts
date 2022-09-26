interface Object {
  [key: string]: any;
}

export function jsonToQueryString(data: Object = {}): string {
  return Object.keys(data)
    .filter((k) => data[k] !== undefined)
    .map((k) => `${k}=${encodeURIComponent(data[k])}`)
    .join("&");
}
