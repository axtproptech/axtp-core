import { RouteHandlerFunction } from "@/bff/route";
import { sha256 } from "@/bff/sha256";
import { NewPixPaymentResponse } from "@/bff/types/newPixPaymentResponse";
import { HttpClientFactory } from "@signumjs/http";
import * as process from "process";
import { prisma } from "@axtp/db";
import { NextApiRequest } from "next/types";
import { badRequest, notFound } from "@hapi/boom";
import { getEnvVar } from "@/bff/getEnvVar";
import { createPixProviderClient } from "@/bff/createPixProviderClient";

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

function getWebHookUrl(req: NextApiRequest) {
  const CallbackEndpoint = "/api/public/pix/pagseg";

  const webhookUrl = getEnvVar("NEXT_SERVER_PIX_WEBHOOK_URL");
  if (webhookUrl) {
    return `${webhookUrl}${CallbackEndpoint}`;
  }

  return (
    (process.env.NODE_ENV === "development" ? "http://" : "https://") +
    req.headers.host +
    CallbackEndpoint
  );
}

export const createNewPayment: RouteHandlerFunction = async (req, res) => {
  const { customerId, accountId, tokenName, quantity, amountBrl } = req.body;
  const amount = parseFloat(amountBrl) * 100; // payment is in BRL cent
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
          value: amount,
        },
        expiration_date: new Date(expiration).toISOString(),
      },
    ],
    notification_urls: [getWebHookUrl(req)],
  };

  const { response } = await createPixProviderClient().post("/orders", payment);

  console.log("[BFF] - createNewPayment", response);

  res.status(200).json({
    txId,
    pixUrl: response.qr_codes[0].text,
  } as NewPixPaymentResponse);
};
