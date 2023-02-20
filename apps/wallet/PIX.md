# PIX

We use PagSeguro as PIX Provider.

The current payment process works as follows:

1. User Selects number of tokens to purchase
2. User generates a QRCode, i.e. an order is created by the wallet
3. The returned PIX Url is being encoded as QR Code (and copyable as link)
4. While the user is doing the payment the wallet polls for the payment status
5. Once the payment was confirmed a payment record is being written on the blockchain and database

## For Development

You need access to PagSeguro sandbox and having the API Token.

Both values need to be injected as environment variables

```
NEXT_SERVER_PIX_API_TOKEN=<token>
NEXT_SERVER_PIX_PROVIDER_URL='https://sandbox.api.pagseguro.com'
NEXT_SERVER_PIX_WEBHOOK_URL=<web_hook_url>
```

As you are running on `localhost`, you need to tunnel your localhost to the internet,
as PagSeguro needs calls back to `/api/public/pix/pagseg`.

Easiest way is [ngrok](https://ngrok.com/)!

You need to set the `NEXT_SERVER_PIX_WEBHOOK_URL` with the URL that (in case of ngrok) looks like this `https://a3f6-201-43-222-21.sa.ngrok.io`

More on [PagSeguro API here](https://documenter.getpostman.com/view/10863174/TVetc6HV)

### Simulating a payment

To simulate a payment follow this procedure

Once you generated an QR Code you can see the order object printed to the servers console.
Pickup the `id` in the `qr_codes` array of the object, it looks like `QRCO_C409EAAE-AB66-4B17-AC4C-6A5F3505022E`

Open Postman (or similar) and use the following endpoint:

```
https://sandbox.api.pagseguro.com/pix/pay/<qr_code_id>
```

Make a POST with the following payload:

```json
{
  "status": "PAID",
  "tx_id": "<qr_code_id>"
}
```

> Authentication is as `Authorization: Bearer ...`
