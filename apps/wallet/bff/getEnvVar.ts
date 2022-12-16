import * as process from "process";

export const getEnvVar = (envVar: string) => {
  if (process.env[envVar] === undefined || process.env[envVar] === "") {
    throw new Error(`Required ENV VAR: ${envVar}`);
  }
  return process.env[envVar] as string;
};
