import { prisma } from "@axtp/db";
export async function processPayment(id: any, body: any) {
  const { transactionId: reference, status, observations } = body;
  return prisma.payment.update({
    where: { id },
    data: {
      status,
      processedRecordId: reference, // this is the signum txid for the contract call
      observations,
    },
    include: {
      customer: {
        select: {
          cuid: true,
        },
      },
    },
  });
}
