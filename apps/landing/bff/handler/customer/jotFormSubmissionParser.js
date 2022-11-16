// Current KYC responses as order
// Use  https://api.jotform.com/submission/5444259092483314503?apiKey=<apikey>
const AnswerIndex = {
  Name: 1,
  Phone: 14,
  Email: 5,
};

export class JotFormSubmissionParser {
  #submission;
  constructor(submission) {
    this.#submission = submission;
  }

  answer(index) {
    return this.#submission.answers[index].answer;
  }

  get id() {
    return this.#submission.id;
  }

  get phone() {
    return this.answer(AnswerIndex.Phone) || "";
  }

  get email() {
    return this.answer(AnswerIndex.Email) || "";
  }

  get fullName() {
    return (
      this.answer(AnswerIndex.Name) || {
        first: "",
        last: "",
      }
    );
  }
}
