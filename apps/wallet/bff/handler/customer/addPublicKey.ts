import { RouteHandlerFunction } from "@/bff/route";
import { prisma } from "@axtp/db";
import { Address } from "@signumjs/core";
import { handleError } from "@/bff/handler/handleError";
import { bffLoggingService } from "@/bff/bffLoggingService";

export const addPublicKey: RouteHandlerFunction = async (req, res) => {
  try {
    const { customerId } = req.query;
    const { publicKey, isTestnet = false } = req.body;

    const address = Address.fromPublicKey(publicKey, isTestnet ? "TS" : "S");
    const existingAccount = await prisma.blockchainAccount.findUnique({
      where: {
        publicKey,
      },
    });

    if (existingAccount) {
      bffLoggingService.info({
        msg: "Public Key added already",
        domain: "customer",
        detail: { publicKey, cuid: customerId },
      });
      return res.status(204).end();
    }

    await prisma.customer.update({
      where: {
        cuid: customerId as string,
      },
      data: {
        blockchainAccounts: {
          create: {
            publicKey,
            accountId: address.getNumericId(),
            rsAddress: address.getReedSolomonAddress(),
          },
        },
      },
    });

    bffLoggingService.info({
      msg: "Public Key successfully updated",
      domain: "customer",
      detail: { publicKey, cuid: customerId },
    });

    res.status(201).end();
  } catch (e: any) {
    if (e.code !== "P2002") {
      // ignore expected duplicate error
      handleError({ e, res });
    }
  }
};
