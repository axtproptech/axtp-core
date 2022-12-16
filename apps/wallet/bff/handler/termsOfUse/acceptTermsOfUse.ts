import { RouteHandlerFunction } from "@/bff/route";
import { prisma } from "@axtp/db";
import { handleError } from "@/bff/handler/handleError";
import { notFound } from "@hapi/boom";

export const acceptTermsOfUse: RouteHandlerFunction = async (req, res) => {
  try {
    const { customerId } = req.body;
    const termsOfUseId = Number(process.env.ACTIVE_TERMS_OF_USE_ID || "1");
    const [foundCustomer, foundTerms] = await Promise.all([
      prisma.customer.findUnique({
        where: { cuid: customerId },
      }),
      prisma.termsOfUse.findUnique({
        where: { id: termsOfUseId },
      }),
    ]);

    if (!foundCustomer) {
      const { output } = notFound(`Unknown customer: ${customerId}`);
      res.status(output.statusCode).json(output.payload);
      return;
    }

    if (!foundTerms) {
      const { output } = notFound(`Unknown terms: ${termsOfUseId}`);
      res.status(output.statusCode).json(output.payload);
      return;
    }

    await prisma.termsOfUseOnCustomer.upsert({
      where: {
        customerId_termsOfUseId: {
          termsOfUseId: foundTerms.id,
          customerId: foundCustomer.id,
        },
      },
      update: {
        accepted: true,
      },
      create: {
        accepted: true,
        termsOfUseId: foundTerms.id,
        customerId: foundCustomer.id,
      },
    });

    res.status(204).end();
  } catch (e: any) {
    handleError({ e, res });
  }
};
