import { HandlerFunction } from "@/bff/route";
import { prisma } from "@axtp/db";
import { notFound } from "@hapi/boom";
import { handleError } from "@/bff/handler/handleError";
import { toCustomerResponse } from "@/bff/handler/customer/toCustomerResponse";

// //https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%2711-30-2022%27&$format=json

export const getExchangeRate: HandlerFunction = async (req, res) => {
  try {
    return res.status(200).json(toCustomerResponse({ status: "fine" }));
  } catch (e: any) {
    handleError({ e, res });
  }
};
