import {
  formatRelative,
  formatDistance,
  format,
  differenceInHours,
} from "date-fns";
import { ptBR, enUS } from "date-fns/locale";

export interface FormatNumberArgs {
  date: Date | string;
  locale?: string;
  withTime?: boolean;
}

const localization = {
  "en-US": enUS,
  "pt-BR": ptBR,
};

const formatsWithTime = {
  "en-US": "MM/dd/yyyy hh:mm aaa",
  "pt-BR": "dd.MM.yyyy HH:mm",
};

const formats = {
  "en-US": "MM/dd/yyyy",
  "pt-BR": "dd.MM.yyyy",
};

export function formatDate({
  date,
  locale = "pt-BR",
  withTime = true,
}: FormatNumberArgs) {
  const now = new Date();
  const d = typeof date === "string" ? new Date(date) : date;
  const delta = differenceInHours(now, d);
  if (delta < 4) {
    // @ts-ignore
    return formatDistance(d, now, { locale: localization[locale] || enUS });
  } else if (delta < 48) {
    // @ts-ignore
    return formatRelative(d, now, { locale: localization[locale] || enUS });
  } else {
    return withTime
      ? // @ts-ignore
        format(d, formatsWithTime[locale] || formatsWithTime["en-US"])
      : // @ts-ignore
        format(d, formats[locale] || formats["en-US"]);
  }
}
