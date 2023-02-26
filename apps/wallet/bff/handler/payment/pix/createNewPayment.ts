import { RouteHandlerFunction } from "@/bff/route";
import { sha256 } from "@/bff/sha256";
import { NewPixPaymentResponse } from "@/bff/types/newPixPaymentResponse";
import { prisma } from "@axtp/db";
import { badRequest, Boom, boomify, notFound } from "@hapi/boom";
import { getEnvVar } from "@/bff/getEnvVar";
import { createPixProviderClient } from "@/bff/createPixProviderClient";
import { array, number, object, string } from "yup";
import { bffLoggingService } from "@/bff/bffLoggingService";
import { HttpError } from "@signumjs/http";

/*
PagSeguro Order Object
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

function getWebHookUrl() {
  const webhookUrl = getEnvVar("NEXT_SERVER_PIX_WEBHOOK_URL");
  return `${webhookUrl}/api/public/pix/pagseg`;
}

const ISODateRegex =
  /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/;

const PaymentSchema = object({
  reference_id: string().required().min(1).max(200),
  customer: object({
    name: string().required().min(1).max(30),
    email: string().required().min(10).max(255).email(),
    tax_id: string()
      .required()
      .matches(/^\d{11}$|^\d{14}$/g),
    phones: array().ensure(), // we don't use that
  }),
  items: array().of(
    object({
      name: string().required().min(1).max(64),
      quantity: number().positive().max(99999),
      unit_amount: number().positive().max(999999999),
    })
  ),
  qr_codes: array().of(
    object({
      amount: object({ value: number().positive() }),
      expiration_date: string().required().matches(ISODateRegex),
    })
  ),
  notification_urls: array().of(string()).max(1).min(1),
});

export const createNewPayment: RouteHandlerFunction = async (req, res) => {
  const { customerId, accountId, tokenName, quantity, amountBrl } = req.body;
  const amount = Math.round(parseFloat(amountBrl) * 100); // payment is in BRL cent
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
        unit_amount: Math.round(amount / qnt),
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
    notification_urls: [getWebHookUrl()],
  };

  try {
    const validatedPayment = await PaymentSchema.validate(payment, {
      strict: true,
    });

    console.info("Sending to pix", payment);
    const { response } = await createPixProviderClient().post(
      "/orders",
      validatedPayment
    );
    bffLoggingService.info({
      msg: "Successfully created new PIX Order",
      domain: "pix",
      detail: response,
    });
    res.status(200).json({
      txId,
      pixUrl: response.qr_codes[0].text,
    } as NewPixPaymentResponse);
  } catch (e: any) {
    let boom = new Boom(e.message, { statusCode: 400 });
    if (e instanceof HttpError) {
      boom = new Boom(e.message, {
        statusCode: e.status,
        message: e.data,
      });
      res.status(boom.output.statusCode).json(boom.output);
    } else {
      res.status(boom.output.statusCode).json(boom.output);
    }

    bffLoggingService.error({
      msg: "PIX Order creation failed",
      domain: "pix",
      detail: boom.output,
    });
  }
};
