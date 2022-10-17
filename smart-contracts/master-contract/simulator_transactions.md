# Simulator Steps

Use this scenarios to test the contract with the [SmartC Simulator](https://deleterium.info/sc-simulator/)

`REQUEST_MINTAXTC = 44bb502c1e25d22a`
`APPROVE_MINTAXTC = 8c51361c09aa9bd2`
`REQUEST_SEND_TO_POOL = b5cf9834bf80b0ac`
`APPROVE_SEND_TO_POOL = 094ac265e934bd10`
`REQUEST_BURNAXTC = f5dc19bd7ae21ec7`
`APPROVE_BURNAXTC = 8ce54b19ff9a088b`


```json
[
  {
    // initialize contract
    "blockheight": 2,
    "sender": "10000n",
    "recipient": "999n",
    "amount": "160_0000_0000n"
  },
  {
    // Request Minting from valid account
    "blockheight": 4,
    "sender": "1n",
    "recipient": "999n",
    "amount": "2500_0000n",
    "messageHex": "44bb502c1e25d22a6400000000000000"
  },
  {
    // Request Minting from invalid account - ignored
    "blockheight": 4,
    "sender": "3n",
    "recipient": "999n",
    "amount": "2500_0000n",
    "messageHex": "44bb502c1e25d22a6400000000000000"
  },
  {
    // Approval for minting
    "blockheight": 6,
    "sender": "3n",
    "recipient": "999n",
    "amount": "2500_0000n",
    "messageHex": "8c51361c09aa9bd2"
  },
  {
    // Approval for minting
    "blockheight": 6,
    "sender": "2n",
    "recipient": "999n",
    "amount": "2500_0000n",
    "messageHex": "8c51361c09aa9bd2"
  },
  {
    // Approval for minting - invalid account
    "blockheight": 6,
    "sender": "14n",
    "recipient": "999n",
    "amount": "2500_0000n",
    "messageHex": "8c51361c09aa9bd2"
  },
  {
    // Approval for minting - sending triggered (3/4 approvals)
    "blockheight": 8,
    "sender": "4n",
    "recipient": "999n",
    "amount": "2500_0000n",
    "messageHex": "8c51361c09aa9bd2"
  },
   {
    // Request Burning - 10 STC
    "blockheight": 10,
    "sender": "1n",
    "recipient": "999n",
    "amount": "2500_0000n",
    "messageHex": "f5dc19bd7ae21ec70a00000000000000"
  },
  {
    // Approve Burning Request
    "blockheight": 12,
    "sender": "3n",
    "recipient": "999n",
    "amount": "2500_0000n",
    "messageHex": "8ce54b19ff9a088b"
  },
  {
    // Approve Burning Request
    "blockheight": 12,
    "sender": "2n",
    "recipient": "999n",
    "amount": "2500_0000n",
    "messageHex": "8ce54b19ff9a088b"
  },
  {
    // Approve Burning Request - triggers burn
    "blockheight": 14,
    "sender": "4n",
    "recipient": "999n",
    "amount": "2500_0000n",
    "messageHex": "8ce54b19ff9a088b"
  },
  {
    // malicicious deactivate trial
    "blockheight": 18,
    "sender": "11n", // not creator
    "recipient": "999n",
    "amount": "2500_0000n",
    "messageHex": "85ecabb4b2a7206a"
  },
  {
    // deactivate contract
    "blockheight": 20,
    "sender": "555n",
    "recipient": "999n",
    "amount": "2500_0000n",
    "messageHex": "85ecabb4b2a7206a"
  },
  {
    // refunding as deactivated
    "blockheight": 22,
    "sender": "4n",
    "recipient": "999n",
    "amount": "100_0000_0000n",
    "messageHex": "0a9a51a00ec0153b"
  },
  {
    // refunding as deactivated
    "blockheight": 24,
    "sender": "66n",
    "recipient": "999n",
    "amount": "2500_0000n",
    "tokens": [
      {"asset": 100, "quantity": 1000000}
    ]
  }
]
```
