import { Amount } from "@signumjs/util";
import { Config } from "@/app/config";

export class InvalidInputError extends Error {
  constructor(detail?: string) {
    super(`Invalid Argument ${detail ? ": " + detail : ""}`);
  }
}

export class InputValidationService {
  public static assertAmountGreaterThan(minimum: Amount, actual: Amount) {
    if (!actual.greater(minimum)) {
      throw new InvalidInputError(
        `Amount must be greater than ${minimum.getSigna()} ${Config.Signum.TickerSymbol.toUpperCase()}`
      );
    }
  }

  public static assertAmountGreaterOrEqualThan(
    minimum: Amount,
    actual: Amount
  ) {
    if (!actual.greaterOrEqual(minimum)) {
      throw new InvalidInputError(
        `Amount must be greater or equal than ${minimum.getSigna()} ${Config.Signum.TickerSymbol.toUpperCase()}`
      );
    }
  }

  public static assertAmountBetween(
    minimum: Amount,
    maximum: Amount,
    actual: Amount
  ) {
    if (actual.greaterOrEqual(minimum) && actual.lessOrEqual(minimum)) return;
    throw new InvalidInputError(
      `Amount must be between ${minimum.getSigna()} and ${maximum.getSigna()} ${Config.Signum.TickerSymbol.toUpperCase()}`
    );
  }

  public static assertNumberBetween(
    minimum: number,
    maximum: number,
    actual: number
  ) {
    if (minimum <= actual && actual <= maximum) return;
    throw new InvalidInputError(
      `Value must be between ${minimum} and ${maximum}`
    );
  }

  public static assertNumberGreaterOrEqualThan(
    minimum: number,
    actual: number
  ) {
    if (actual < minimum) {
      throw new InvalidInputError(
        `Value must be greater or equal than ${minimum}`
      );
    }
  }

  public static assertNumberLessOrEqualThan(maximum: number, actual: number) {
    if (maximum < actual) {
      throw new InvalidInputError(
        `Value must be less or equal than ${maximum}`
      );
    }
  }

  public static isTextGreaterThan(text: string, characters: number): boolean {
    return !!(text && text.length > characters);
  }

  public static isTextLowerThan(text: string, characters: number): boolean {
    return !!(text && text.length < characters);
  }

  public static isNumberGreaterThan(
    value: string | number,
    amount: number
  ): boolean {
    if (typeof value === "number") {
      return value > amount;
    }

    const n = parseFloat(value);
    if (Number.isNaN(n)) return false;

    return n > amount;
  }

  public static isNumberLowerThan(
    value: string | number,
    amount: number
  ): boolean {
    if (typeof value === "number") {
      return value < amount;
    }
    const n = parseFloat(value);
    if (Number.isNaN(n)) return false;

    return n < amount;
  }
}
