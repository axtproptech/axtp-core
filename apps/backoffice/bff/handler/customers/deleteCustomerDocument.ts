import { ApiHandler } from "@/bff/types/apiHandler";
import { prisma } from "@axtp/db";
import { badRequest, notFound } from "@hapi/boom";
import { object, number, ValidationError, string } from "yup";
import { mailService } from "@/bff/services/backofficeMailService/backofficeMailService";

let documentRequestSchema = object({
  documentId: number().required(),
  cuid: string().required(),
});

export const deleteCustomerDocument: ApiHandler = async ({ req, res }) => {
  try {
    const { documentId, cuid } = documentRequestSchema.validateSync(req.query);

    const customer = await prisma.customer.findUnique({
      where: {
        cuid,
      },
    });

    if (!customer) {
      throw notFound();
    }

    await prisma.document.update({
      where: { id: documentId },
      data: {
        active: false,
      },
    });

    await mailService.sendInternalCustomerUpdated({
      action: "Customer Document Removed",
      customer,
    });

    res.status(204);
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
