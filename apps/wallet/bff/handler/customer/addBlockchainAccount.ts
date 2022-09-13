import { HandlerFunction } from "@/bff/route";
import { prisma } from "@axt/db-package";
import { Address } from "@signumjs/core";
import { handleError } from "@/bff/handler/handleError";

export const addBlockchainAccount: HandlerFunction = async (req, res) => {
  try {
    const { customerId, publicKey, isTestnet = false } = req.body;

    const address = Address.fromPublicKey(publicKey, isTestnet ? "TS" : "S");
    const existingAccount = await prisma.blockchainAccount.findUnique({
      where: {
        publicKey,
      },
    });

    if (existingAccount) {
      return res.status(204).end();
    }

    await prisma.customer.update({
      where: {
        id: customerId,
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

    res.status(204).end();
  } catch (e: any) {
    handleError({ e, res });
  }
};
