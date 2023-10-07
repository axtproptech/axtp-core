import { setLocale } from "yup";

setLocale({
  string: {
    min: ({ min }) => ({ key: "more_characters_feedback", value: min }),
    max: ({ max }) => ({ key: "less_characters_feedback", value: max }),
  },
  number: {
    min: ({ min }) => ({ key: "more_amount_feedback", value: min }),
    max: ({ max }) => ({ key: "less_amount_feedback", value: max }),
  },
});
