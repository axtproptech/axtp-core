import { logger } from "./logger";
export const customLogger = (message: string, ...rest: string[]) => {
  logger.info(message, ...rest);
};
