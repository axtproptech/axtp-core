import { handleError } from "../handleError";
import { prisma } from "@axtp/db";
import { object, string } from "yup";
import { unauthorized } from "@hapi/boom";

const VerifySecurityToken = object({
  subjectId: string().required(),
  token: string().required(),
  purpose: string().oneOf(["EmailVerification"]).required(),
});

export const verifySecurityToken = async (req, res) => {
  try {
    const { token, purpose, subjectId } = VerifySecurityToken.validateSync(
      req.body
    );

    const result = await prisma.securityToken.findUnique({
      // @ts-ignore
      where: { subjectId_purpose: { subjectId, purpose } },
    });

    const isValidAndNotExpired =
      result &&
      result.status === "Active" &&
      result.expiredAt > new Date() &&
      result.token === token;

    if (!isValidAndNotExpired) {
      throw unauthorized("invalid");
    }

    await prisma.securityToken.update({
      where: { subjectId_purpose: { subjectId, purpose } },
      data: { status: "Inactive" },
    });
    console.info(
      `Security Token [${subjectId}] for [${purpose}] successfully verified`
    );
    res.status(204);
  } catch (e) {
    handleError({ e, res });
  }
};
