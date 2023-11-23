import { ApiHandler } from "@/bff/types/apiHandler";
import { prisma } from "@axtp/db";
import { badRequest } from "@hapi/boom";
import { object, number, ValidationError } from "yup";

let documentRequestSchema = object({ documentId: number().required() });

export const deleteCustomerDocument: ApiHandler = async ({ req, res }) => {
  try {
    const { documentId } = documentRequestSchema.validateSync(req.query);

    await prisma.document.update({
      where: { id: documentId },
      data: {
        active: false,
      },
    });
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
