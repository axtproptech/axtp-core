import { formatNumber } from "@/app/formatNumber";

export const mapValidationError = (message: any, getValue?: boolean): any => {
  if (typeof message === "object" && getValue)
    return { value: formatNumber({ value: message?.value }) };

  if (typeof message === "object") return message.key;

  switch (message) {
    case "required":
      return "complete_this_field";

    case "fieldMustBeAnInteger":
      return "no_decimals_allowed";

    case "oneDecimalAllowed":
      return "one_decimal_allowed";

    case "positive":
      return "field_must_have_positive_value";

    case "customer_already_exists":
      return "customer_already_exists";
    default:
      return "invalid_field";
  }
};
