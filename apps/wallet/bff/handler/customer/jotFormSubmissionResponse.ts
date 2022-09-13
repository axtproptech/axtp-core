type AnswerTypes =
  | "control_fullname"
  | "control_number"
  | "control_email"
  | "control_datetime"
  | "control_textbox"
  | "control_address"
  | "control_fileupload"
  | "control_radio";

export interface AnswerFullname {
  first: string;
  last: string;
}

export interface AnswerDateTime {
  day: string;
  month: string;
  year: string;
  datetime: string;
}

export interface AnswerAddress {
  addr_line1: string;
  addr_line2?: string;
  city: string;
  state: string;
  postal: string;
  country: string;
}

export type AnswerFiles = string[];

export interface JotFormResponseAnswer {
  name: string;
  order: string;
  text: string;
  type: AnswerTypes;
  answer:
    | string
    | AnswerFullname
    | AnswerDateTime
    | AnswerAddress
    | AnswerFiles;
  prettyFormat: string;
}

export interface JotFormSubmissionContent {
  id: string;
  form_id: string;
  ip: string;
  created_at: string;
  status: string;
  new: string;
  flag: string;
  notes: string;
  updated_at: string;
  answers: { [key: string]: JotFormResponseAnswer };
}

// export interface JotFormSubmissionResponse {
//     responseCode: number,
//     message: string,
//     content: JotFormSubmissionContent,
//     duration: string,
//     "limit-left": number
// }
