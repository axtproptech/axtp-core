import {
  AnswerAddress,
  AnswerDateTime,
  AnswerFullname,
  JotFormSubmissionContent,
} from "@/bff/handler/customer/jotFormSubmissionResponse";

// Current KYC responses as order
// Use  https://api.jotform.com/submission/5443436762481459856?apiKey=<apikey>
const AnswerIndex = {
  Name: 1,
  Cpf: 2,
  Email: 3,
  Phone: 5,
  BirthDate: 6,
  BirthPlace: 7,
  MothersName: 8,
  Occupation: 9,
  Address: 10,
  ResidentProof: 11,
  DocumentType: 12,
  Documents: 13,
};

export class JotFormSubmissionParser {
  constructor(private submission: JotFormSubmissionContent) {}

  private answer(index: number) {
    return this.submission.answers[index].answer;
  }

  get id() {
    return this.submission.id;
  }

  get phone() {
    return (this.answer(AnswerIndex.Phone) || "") as string;
  }

  get cpf() {
    // validate

    return (this.answer(AnswerIndex.Cpf) || "") as string;
  }

  get email() {
    return (this.answer(AnswerIndex.Email) || "") as string;
  }

  get fullName() {
    return (this.answer(AnswerIndex.Name) || {
      first: "",
      last: "",
    }) as AnswerFullname;
  }

  get mothersName() {
    return (this.answer(AnswerIndex.MothersName) || {
      first: "",
      last: "",
    }) as AnswerFullname;
  }

  get birthDate() {
    // validate and > 18
    const dateTime = this.answer(AnswerIndex.BirthDate) as AnswerDateTime;
    return dateTime ? new Date(dateTime.datetime) : new Date(0);
  }

  get birthPlace() {
    return (this.answer(AnswerIndex.BirthPlace) || "") as string;
  }

  get occupation() {
    return (this.answer(AnswerIndex.Occupation) || "") as string;
  }

  get address() {
    return (this.answer(AnswerIndex.Address) || {
      postal: "",
      country: "",
      city: "",
      addr_line2: "",
      addr_line1: "",
      state: "",
    }) as AnswerAddress;
  }

  get residentProofUrls() {
    return (this.answer(AnswerIndex.ResidentProof) || []) as string[];
  }

  get documentType() {
    const type = (this.answer(AnswerIndex.DocumentType) || "") as string;
    return type.toLowerCase();
  }

  get documentUrls() {
    return (this.answer(AnswerIndex.Documents) || []) as string[];
  }
}
