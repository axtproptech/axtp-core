import { RouteHandlerFunction } from "@/bff/route";
import { handleError } from "../handleError";
import { getEnvVar } from "@/bff/getEnvVar";
import { emails_templates } from "./emailTemplates";
import { prisma } from "@axtp/db";

const brevo = require("@getbrevo/brevo");

let defaultClient = brevo.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = getEnvVar("NEXT_SERVER_BREVO_API_KEY");

// define the model of request body
export type VerifyEmailBody = {
  email: string;
  token: string;
};

export const verifyEmail: RouteHandlerFunction = async (req, res) => {
  try {
    const { email, token } = req.body;
    const result = await prisma.emailVerificationTemp.findUnique({
      where: { email },
    });
    console.log(result);
    //check if token is expired
    console.log(new Date());
    if (result!.expiredAt < new Date()) {
      res.status(401).json({ token: "expired" });
      return;
    }

    if (result?.token.toUpperCase() !== token.toUpperCase()) {
      res.status(401).json({ token: "invalid" });
      return;
    }
    res.status(200).json({ token: "valid" });
  } catch (e: any) {
    handleError({ e, res });
  }
};
