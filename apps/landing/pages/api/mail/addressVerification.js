import { route } from "bff/route";
import { sendAddressVerificationMail } from "bff/handler/mail/sendAddressVerificationMail";

export default function handler(req, res) {
  return route({
    req,
    res,
    post: sendAddressVerificationMail,
  });
}
