import { log } from "next-axiom";

interface Logger {
  info: any;
  error: any;
  warn: any;
}

export class BffLoggingService {
  constructor(private logger: Logger) {}
  info(args: { msg: string; domain: string; detail?: object }) {
    this.logger.info(args.msg, { ...args.detail, domain: args.domain });
  }
  warn(args: { msg: string; domain: string; detail?: object }) {
    this.logger.warn(args.msg, { ...args.detail, domain: args.domain });
  }
  error(args: { msg: string; domain: string; detail?: object }) {
    this.logger.error(args.msg, { ...args.detail, domain: args.domain });
  }
}

export const bffLoggingService = new BffLoggingService(
  log.with({ scope: "bff" })
);
