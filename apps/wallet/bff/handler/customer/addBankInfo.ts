import { RouteHandlerFunction } from "@/bff/route";
import { prisma } from "@axtp/db";
import { handleError } from "@/bff/handler/handleError";
import { bffLoggingService } from "@/bff/bffLoggingService";
import { toSafeCustomerResponse } from "@/bff/handler/customer/toSafeCustomerResponse";
import { mixed, object, string } from "yup";

const bodySchema = object({
  identifier: string().required(),
  type: mixed().oneOf(["Pix", "Iban"]).required(),
});
export const addBankInfo: RouteHandlerFunction = async (req, res) => {
  try {
    const { customerId } = req.query;
    const { identifier, type } = bodySchema.validateSync(req.body);

    const updatedCustomer = await prisma.customer.update({
      where: {
        cuid: customerId as string,
      },
      include: {
        blockchainAccounts: true,
        bankInformation: true,
        signedDocuments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      data: {
        bankInformation: {
          create: {
            type,
            identifier,
          },
        },
      },
    });

    bffLoggingService.info({
      msg: "Bank Info successfully updated",
      domain: "customer",
      detail: { cuid: customerId },
    });

    res.status(201).json(toSafeCustomerResponse(updatedCustomer));
  } catch (e: any) {
    if (e.code !== "P2002") {
      // ignore expected duplicate error
      handleError({ e, res });
    }
  }
};
