export const getCompactNumberFormatter = (locale) =>
  Intl.NumberFormat(locale, { notation: "compact" });
