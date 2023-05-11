export const getCompactNumberFormatter = (locale = "pt-BR") =>
  Intl.NumberFormat(locale, { notation: "compact" });
