import { RouteHandlerFunction } from "@/bff/route";
import { prisma } from "@axtp/db";
import { notFound } from "@hapi/boom";
import { handleError } from "@/bff/handler/handleError";
import { toSafeCustomerResponse } from "@/bff/handler/customer/toSafeCustomerResponse";

function formatCpfCnpj(cpfCnpj: string) {
  const pruned = cpfCnpj.replace(/\D/g, "");
  return pruned.length === 11
    ? pruned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4")
    : pruned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");
}
async function fetchCustomerByPublicKey(publicKey: string) {
  const account = await prisma.blockchainAccount.findUnique({
    where: {
      publicKey,
    },
  });

  if (!account) {
    return null;
  }

  return prisma.customer.findUnique({
    where: {
      id: account.customerId,
    },
    include: {
      blockchainAccounts: true,
      termsOfUse: {
        where: {
          termsOfUseId: Number(process.env.ACTIVE_TERMS_OF_USE_ID || "1"),
        },
      },
    },
  });
}

async function fetchCustomerByCpf(cpf: string) {
  const normalizedCpf = formatCpfCnpj(cpf);
  return prisma.customer.findUnique({
    where: {
      cpfCnpj: normalizedCpf,
    },
    include: {
      blockchainAccounts: true,
      termsOfUse: {
        where: {
          termsOfUseId: Number(process.env.ACTIVE_TERMS_OF_USE_ID || "1"),
        },
      },
    },
  });
}

export const searchCustomer: RouteHandlerFunction = async (req, res) => {
  try {
    const { publicKey, cpf } = req.query;

    let customer;
    if (publicKey) {
      customer = await fetchCustomerByPublicKey(publicKey as string);
    } else if (cpf) {
      customer = await fetchCustomerByCpf(cpf as string);
    }

    if (!customer || customer.isBlocked) {
      const { output } = notFound();
      return res.status(output.statusCode).json(output.payload);
    }

    return res.status(200).json(toSafeCustomerResponse(customer));
  } catch (e: any) {
    handleError({ e, res });
  }
};
