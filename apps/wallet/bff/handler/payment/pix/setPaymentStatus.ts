import { RouteHandlerFunction } from "@/bff/route";
import { sha256 } from "@/bff/sha256";
import { NextApiRequest } from "next";
import * as process from "process";
import { getEnvVar } from "@/bff/getEnvVar";
import { handleError } from "@/bff/handler/handleError";
import { recordPayment } from "@/bff/handler/payment/recordPayment";

/*

Expected format from PagSeguro

{
    "id": "ORDE_F87334AC-BB8B-42E2-AA85-8579F70AA328",
    "reference_id": "ex-00001",
    "created_at": "2020-11-21T23:23:22.69-03:00",
    "shipping": {
        "address": {
            "street": "Avenida Brigadeiro Faria Lima",
            "number": "1384",
            "complement": "apto 12",
            "locality": "Pinheiros",
            "city": "São Paulo",
            "region_code": "SP",
            "country": "BRA",
            "postal_code": "01452002"
        }
    },
    "items": [
        {
            "reference_id": "referencia do item",
            "name": "nome do item",
            "quantity": 1,
            "unit_amount": 500
        }
    ],
    "customer": {
        "name": "Jose da Silva",
        "email": "email@test.com",
        "tax_id": "12345678909",
        "phones": [
            {
                "country": "55",
                "area": "11",
                "number": "999999999",
                "type": "MOBILE"
            }
        ]
    },
    "charges": [
        {
            "id": "CHAR_F1F10115-09F4-4560-85F5-A828D9F96300",
            "reference_id": "referencia da cobranca",
            "status": "PAID",
            "created_at": "2020-11-21T23:30:22.695-03:00",
            "paid_at": "2020-11-21T23:30:24.352-03:00",
            "description": "descricao da cobranca",
            "amount": {
                "value": 500,
                "currency": "BRL",
                "summary": {
                    "total": 500,
                    "paid": 500,
                    "refunded": 0
                }
            },
            "payment_response": {
                "code": "20000",
                "message": "SUCESSO",
                "reference": "1606012224352"
            },
            "payment_method": {
                "type": "PIX"
            },
            "links": [
                {
                    "rel": "SELF",
                    "href": "https://sandbox.api.pagseguro.com/charges/CHAR_F1F10115-09F4-4560-85F5-A828D9F96300",
                    "media": "application/json",
                    "type": "GET"
                },
                {
                    "rel": "CHARGE.CANCEL",
                    "href": "https://sandbox.api.pagseguro.com/charges/CHAR_F1F10115-09F4-4560-85F5-A828D9F96300/cancel",
                    "media": "application/json",
                    "type": "POST"
                }
            ]
        }
    ],
    "qr_code": [
        {
            "id": "QRCO_86FE511B-E945-4FE1-BB5D-297974C0DB74",
            "amount": {
                "value": 500
            },
            "text": "00020101021226600016BR.COM.PAGSEGURO013686FE511B-E945-4FE1-BB5D-297974C0DB7452048999530398654045.005802BR5922Rafael Gouveia Firmino6009SAO PAULO63049879",
            "links": [
                {
                    "rel": "QRCODE.PNG",
                    "href": "https://sandbox.api.pagseguro.com/qrcode/QRCO_86FE511B-E945-4FE1-BB5D-297974C0DB74/png",
                    "media": "image/png",
                    "type": "GET"
                },
                {
                    "rel": "QRCODE.BASE64",
                    "href": "https://sandbox.api.pagseguro.com/qrcode/QRCO_86FE511B-E945-4FE1-BB5D-297974C0DB74/base64",
                    "media": "text/plain",
                    "type": "GET"
                }
            ]
        }
    ],
    "links": [
        {
            "rel": "SELF",
            "href": "https://sandbox.api.pagseguro.com/orders/ORDE_F87334AC-BB8B-42E2-AA85-8579F70AA328",
            "media": "application/json",
            "type": "GET"
        },
        {
            "rel": "PAY",
            "href": "https://sandbox.api.pagseguro.com/orders/ORDE_F87334AC-BB8B-42E2-AA85-8579F70AA328/pay",
            "media": "application/json",
            "type": "POST"
        }
    ]
}
 */

function isProviderAuthenticated(req: NextApiRequest): boolean {
  const payload = req.body;
  const authToken = (req.headers["x-authenticity-token"] || "") as string;
  const validationDigest = sha256(
    `${getEnvVar("NEXT_SERVER_PIX_API_TOKEN")}-${JSON.stringify(payload)}`
  );
  return authToken.toLowerCase() === validationDigest.toLowerCase();
}

function isProcessableRequest(req: NextApiRequest): boolean {
  return (req.headers["x-authenticity-token"] || "").length > 0;
}

// This is called by the pix provider via webhook... it's the callback
export const setPaymentStatus: RouteHandlerFunction = async (req, res) => {
  // PagSeguro sends not only payment status messages, but also notifications...
  if (!isProcessableRequest(req)) {
    console.log("[BFF] - ");
    return res.status(501).end();
  }

  // 1. Authenticate PagSeguro
  if (!isProviderAuthenticated(req)) {
    console.error(
      "[BFF] - setPaymentStatus: Could not authenticate PIX provider"
    );
    return res.status(403).end();
  }

  // we "cannot" store the permanent record here, as the data from PIX provider is incomplete,
  // and gathering them all here requires several requests to database. So, no further action here (yet)
  // atm, we might wanna use this function merely for logging/developing reasons...
  // We will use the getPaymentStatus method and check by polling. On the frontend we have all information

  res.status(200).end();
};
