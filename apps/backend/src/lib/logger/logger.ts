import pino, { type Logger } from "pino";
import pretty from "pino-pretty";
let logger: Logger;
if (Bun.env.NODE_ENV !== "production") {
  logger = pino(
    { level: "info" },
    pino.transport({
      target: "@axiomhq/pino",
      options: {
        dataset: Bun.env.AXIOM_DATASET,
        token: Bun.env.AXIOM_KEY,
      },
    })
  );
} else {
  logger = pino({ level: "debug" }, pretty({ colorize: true }));
}

export { logger };
