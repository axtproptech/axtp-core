import { log } from "next-axiom";

interface Logger {
  info: any;
}

export class TrackingEventService {
  constructor(private logger: Logger) {}
  track(args: { msg: string; detail?: object }) {
    this.logger.info(args.msg, args.detail);
  }
}

export const trackingEventService = new TrackingEventService(
  log.with({ scope: "wallet-ui-event" })
);
