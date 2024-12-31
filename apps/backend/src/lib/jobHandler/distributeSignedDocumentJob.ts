import { getHeadlessBrowserInstance } from "../headlessBrowser";
import { jobQueue } from "../jobQueue";
import { z, ZodError } from "zod";
import { JobAbortError } from "../jobQueue/jobaAbortError";
import { MailService } from "@axtp/core/mailer";

const EmailSignedDocumentSchema = z.object({
  cuid: z.string(),
  email: z.string().email(),
  transactionId: z.string(),
  htmlDocument: z.string(),
});

async function uploadPdf(data: Uint8Array, filename) {}

async function generatePdf(htmlContent: string): Promise<Uint8Array> {
  const browser = await getHeadlessBrowserInstance();
  const page = await browser.newPage();

  // Set page options
  await page.setContent(htmlContent);
  const pdf = await page.pdf({
    format: "A4",
    landscape: false,
    margin: {
      top: "20px",
      bottom: "20px",
      left: "10px",
      right: "10px",
    },
  });
  await page.close();

  return pdf;
}

jobQueue.processJobs("distribute-signed-document", async (payload) => {
  // try{
  //   // generate pdf from send html
  //   // upload document to R2
  //   // send email with document link
  //   const {email, htmlDocument} = EmailSignedDocumentSchema.parse(payload);
  //
  //   const pdf = await generatePdf(htmlDocument);
  //
  //
  //
  //   const mailer = new MailService(Bun.env.BREVO_API_KEY);
  //   mailer.sendTransactionalEmail({
  //     sender:{
  //       email: Bun.env.BREVO_SENDER_EMAIL,
  //       name: Bun.env.BREVO_SENDER_NAME,
  //     },
  //     to: [{email: }]
  //     attachments:[{absoluteUrl}]
  //   })
  // }catch(e){
  //   if(e instanceof ZodError){
  //     throw new JobAbortError(e.message)
  //   }
  //   throw e;
  // }
});
