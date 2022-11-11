export const getCompactFormatter = (locale: string) =>
  Intl.NumberFormat(locale, { notation: "compact" });
