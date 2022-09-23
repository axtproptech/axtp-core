import { Config, ConfigType } from "./config";
import { PrismaClient } from "@prisma/client";
// import {
//     createLogger,
//     DevLoggerConfig,
//     Logger,
//     LoggerType,
// } from "@/rest/logger";

export interface ContextType {
  config: ConfigType;
  // logger: Logger;
  prisma: PrismaClient;
}

export const context: ContextType = {
  config: Config,
  // logger: createLogger({
  //     type: LoggerType.Dev,
  //     config: {} as DevLoggerConfig,
  // }),
  prisma: new PrismaClient(),
};
