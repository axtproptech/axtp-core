import { RouteHandlerFunction } from "@/bff/route";
import { prisma } from "@axtp/db";
import { handleError } from "@/bff/handler/handleError";
import { notFound } from "@hapi/boom";
import { mixed, object, string, date } from "yup";
import { bffLoggingService } from "@/bff/bffLoggingService";

const bodySchema = object({
  expiryAt: date().optional(),
  poolId: string().optional(),
  documentHash: string().required(),
  url: string().required(),
  type: mixed()
    .oneOf([
      "TermsOfRisk",
      "SelfDeclaration10K",
      "SelfDeclaration100K",
      "SelfDeclaration1M",
    ])
    .required(),
  transactionId: string().required(),
});

export const storeSignedDocument: RouteHandlerFunction = async (req, res) => {
  try {
    const { customerId } = req.query;
    const { type, poolId, url, documentHash, expiryAt, transactionId } =
      bodySchema.validateSync(req.body);

    const foundCustomer = await prisma.customer.findUnique({
      where: { cuid: customerId as string },
    });

    if (!foundCustomer || foundCustomer.isBlocked) {
      const { output } = notFound(`Unknown customer: ${customerId}`);
      res.status(output.statusCode).json(output.payload);
      return;
    }

    await prisma.signedDocuments.create({
      data: {
        customerId: foundCustomer.id,
        poolId,
        type,
        url,
        documentHash,
        expiryAt,
        transactionId,
      },
    });

    bffLoggingService.info({
      msg: "Successfully signed a document",
      domain: "customer",
      detail: { poolId, type, transactionId, cuid: customerId },
    });

    res.status(201).end();
  } catch (e: any) {
    handleError({ e, res });
  }
};
