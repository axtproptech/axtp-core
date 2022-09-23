export const isTrue = (b: string) => b.toLowerCase() === "true";

export const toNumber = (n: string) => {
  const f = parseFloat(n);
  if (Number.isNaN(f)) {
    throw new Error(`Invalid Configuration - Number Expected: ${n}`);
  }
  return f;
};

export interface ConfigType {
  apiKey: string;
  encKey: string;
  jwtSecret: string;
  isDevelopment: boolean;
  database: {
    maxItemsPerPage: number;
  };
  cache: {
    generic: number;
  };
}

export const Config: ConfigType = {
  apiKey: process.env.API_KEY || "",
  encKey: process.env.ENC_KEY || "",
  jwtSecret: process.env.JWT_SECRET || "",
  isDevelopment: process.env.NODE_ENV === "development",
  database: {
    maxItemsPerPage: toNumber(process.env.DATABASE_MAX_PAGE_ITEMS || "25"),
  },
  cache: {
    generic: toNumber(process.env.CACHE_SECONDS_GENERIC || "240"),
  },
};
