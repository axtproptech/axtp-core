import { RouteHandlerFunction } from "@/bff/route";
import { handleError } from "../handleError";
import { prisma } from "@axtp/db";
import { object, string } from "yup";
import { unauthorized } from "@hapi/boom";
import { bffLoggingService } from "@/bff/bffLoggingService";

const VerifySecurityToken = object({
  subjectId: string().required(),
  token: string().required(),
  purpose: string().oneOf(["EmailVerification"]).required(),
});

export const verifySecurityToken: RouteHandlerFunction = async (req, res) => {
  try {
    const { token, purpose, subjectId } = VerifySecurityToken.validateSync(
      req.body
    );

    const result = await prisma.securityToken.findUnique({
      where: { subjectId_purpose: { subjectId, purpose } },
    });

    if (
      !result ||
      result.expiredAt < new Date() ||
      result.status !== "Active" ||
      result.token !== token
    ) {
      throw unauthorized();
    }

    await prisma.securityToken.update({
      where: { subjectId_purpose: { subjectId, purpose } },
      data: { status: "Inactive" },
    });
    bffLoggingService.info({
      msg: `Security Token [${subjectId}] for [${purpose}] successfully verified`,
      domain: "token",
    });
    res.status(204);
  } catch (e: any) {
    handleError({ e, res });
  }
};
