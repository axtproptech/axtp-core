import { RouteHandlerFunction } from "@/bff/route";
import { sha256 } from "@/bff/sha256";
import { NewPixPaymentResponse } from "@/bff/types/newPixPaymentResponse";
import { HttpClientFactory } from "@signumjs/http";
import * as process from "process";
import { prisma } from "@axtp/db";
import { NextApiRequest } from "next/types";
import { badRequest, notFound } from "@hapi/boom";
import { log } from "next-axiom";

const TestPayload =
  "00020126830014br.gov.bcb.pix2561api.pagseguro.com/pix/v2/210387E0-A6BF-45D1-80B5-CFEB9BBCEE2F5204899953039865802BR5921Pagseguro Internet SA6009SAO PAULO62070503***63047E6D";

/*
{
    "reference_id": "ex-00002",
    "customer": {
        "name": "Jose da Silva",
        "email": "email@test.com",
        "tax_id": "12345678909",
        "phones": []
    },
    "items": [
        {
            "name": "nome do item",
            "quantity": 1,
            "unit_amount": 500
        }
    ],
    "qr_codes": [
        {
            "amount": {
                "value": 500
            },
            "expiration_date": "2023-02-22T20:15:59-03:00"
        }
    ],
    "notification_urls": [
        "https://meusite.com/notificacoes"
    ]
}
 */

const PixProviderClient = HttpClientFactory.createHttpClient(
  process.env.NEXT_SERVER_PIX_PROVIDER_URL || "",
  {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_SERVER_PIX_API_TOKEN || ""}`,
    },
  }
);

function getWebHookUrl(req: NextApiRequest) {
  return (
    (process.env.NODE_ENV === "development" ? "http://" : "https://") +
    req.headers.host +
    "/api/public/pix/pagseg"
  );
}

export const createNewPayment: RouteHandlerFunction = async (req, res) => {
  const { customerId, accountId, tokenName, quantity, amountBrl } = req.body;
  const amount = parseFloat(amountBrl);
  const qnt = parseFloat(quantity);

  if (
    !customerId ||
    !accountId ||
    !tokenName ||
    !quantity ||
    !amountBrl ||
    isNaN(amount) ||
    isNaN(qnt)
  ) {
    const { output } = badRequest("Invalid Arguments");
    return res.status(output.statusCode).json(output.payload);
  }

  const txId = sha256(
    `${customerId}.${accountId}.${tokenName}.${quantity}.${amountBrl}-${Date.now()}`
  );

  const customer = await prisma.customer.findUnique({
    where: {
      cuid: customerId,
    },
  });

  if (!customer) {
    const { output } = notFound();
    return res.status(output.statusCode).json(output.payload);
  }

  const expiration = Date.now() + 1000 * 60 * 10; // ten minutes

  const payment = {
    reference_id: txId,
    customer: {
      name: customer.firstName,
      email: customer.email1,
      tax_id: customer.cpfCnpj.replace(/[.\-\/]/gi, ""),
      phones: [],
    },
    items: [
      {
        name: tokenName,
        quantity,
        unit_amount: amount / qnt,
      },
    ],
    qr_codes: [
      {
        amount: {
          value: amountBrl,
        },
        expiration_date: new Date(expiration).toISOString(),
      },
    ],
    notification_urls: [getWebHookUrl(req)],
  };

  const { response } = await PixProviderClient.post("/orders", payment);

  console.log("[BFF] - createNewPayment", response);

  res.status(200).json({
    txId,
    pixUrl: response.qr_codes[0].text,
  } as NewPixPaymentResponse);
};
