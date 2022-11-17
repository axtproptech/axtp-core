import { HandlerFunction } from "@/bff/route";
import { prisma } from "@axtp/db";
import { notFound } from "@hapi/boom";
import { handleError } from "@/bff/handler/handleError";

export const getTermsOfUse: HandlerFunction = async (_, res) => {
  try {
    const termsOfUse = await prisma.termsOfUse.findUnique({
      where: {
        id: Number(process.env.ACTIVE_TERMS_OF_USE_ID || ("1" as string)),
      },
    });

    if (!termsOfUse) {
      const { output } = notFound();
      return res.status(output.statusCode).json(output.payload);
    }

    return res.status(200).json(termsOfUse);
  } catch (e: any) {
    handleError({ e, res });
  }
};
