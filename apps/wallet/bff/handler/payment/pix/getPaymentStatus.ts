import { RouteHandlerFunction } from "@/bff/route";
import { createPixProviderClient } from "@/bff/createPixProviderClient";

/* Provider Response
[
    {
        "id": "CHAR_BB6D61E5-A57A-4ECB-9C55-D7AB0146BC56",
        "reference_id": "74d1a95f424c4d020a5ce596f5438ceff21849643569900d5cf7f0d6636117f5",
        "status": "PAID",
        "created_at": "2023-02-20T14:39:48.112-03:00",
        "paid_at": "2023-02-20T14:39:49.163-03:00",
        "amount": {
            "value": 1575000,
            "currency": "BRL",
            "summary": {
                "total": 1575000,
                "paid": 1575000,
                "refunded": 0
            }
        },
        "payment_response": {
            "code": "20000",
            "message": "SUCESSO"
        },
        "payment_method": {
            "type": "PIX",
            "pix": {
                "notification_id": "NTF_0D66BDB3-D030-4DB1-B9CD-90AF7A76B05D"
            }
        },
        "links": [
            {
                "rel": "SELF",
                "href": "https://sandbox.api.pagseguro.com/charges/CHAR_BB6D61E5-A57A-4ECB-9C55-D7AB0146BC56",
                "media": "application/json",
                "type": "GET"
            },
            {
                "rel": "CHARGE.CANCEL",
                "href": "https://sandbox.api.pagseguro.com/charges/CHAR_BB6D61E5-A57A-4ECB-9C55-D7AB0146BC56/cancel",
                "media": "application/json",
                "type": "POST"
            }
        ],
        "notification_urls": [
            "https://order-api.sandbox.aws.intranet.pagseguro.uol/orders/notifications"
        ],
        "metadata": {}
    }
]
 */
export const getPaymentStatus: RouteHandlerFunction = async (req, res) => {
  try {
    const { txId } = req.query;
    const { response } = await createPixProviderClient().get(
      `/charges?reference_id=${txId}`
    );
    const status =
      response.length > 0 && response[0].status === "PAID"
        ? "confirmed"
        : "pending";
    res.status(200).json({
      status,
    });
  } catch (e) {
    res.status(200).json({
      status: "pending",
    });
  }
};
