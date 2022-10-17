# Simulator Steps

Use this scenarios to test the contract with the [SmartC Simulator](https://deleterium.info/sc-simulator/)


```js
[
  {
    // initialize contract
    "blockheight": 2,
    "sender": "10000n",
    "recipient": "999n",
    "amount": "500_0000_0000n"
  },
  {
    // Register a token holder #10
    "blockheight": 4,
    "sender": "1n",
    "recipient": "999n",
    "amount": "2500_0000n",
    "messageHex": "6b6b056bb72960e10a000000000000000100000000000000"
  },
  {
    // Register a token holder #11
    "blockheight": 4,
    "sender": "1n",
    "recipient": "999n",
    "amount": "2500_0000n",
    "messageHex": "6b6b056bb72960e10b000000000000000100000000000000"
  },
  {
    // Register a token holder #12
    "blockheight": 4,
    "sender": "1n",
    "recipient": "999n",
    "amount": "2500_0000n",
    "messageHex": "6b6b056bb72960e10c000000000000000100000000000000"
  },
  {
    // Register a token holder #13 - failed due to too high amount
    "blockheight": 4,
    "sender": "1n",
    "recipient": "999n",
    "amount": "2500_0000n",
    "messageHex": "6b6b056bb72960e10c0000000000000001ffff0000000000"
  },
  {
    // send AXTC
    "blockheight": 6,
    "sender": "66n",
    "recipient": "999n",
    "amount": "2500_0000n",
    "tokens": [
      {"asset": 100, "quantity": 1000000}
    ]
  },
  {
    // approve #1
    "blockheight": 8,
    "sender": "1n",
    "recipient": "999n",
    "amount": "2500_0000n",
    "messageHex": "0a9a51a00ec0153b"
  },
  {
    // approve #2
    "blockheight": 8,
    "sender": "2n",
    "recipient": "999n",
    "amount": "2500_0000n",
    "messageHex": "0a9a51a00ec0153b"
  },
  {
    // approve #4 - dividend payout happens
    "blockheight": 8,
    "sender": "4n",
    "recipient": "999n",
    "amount": "2500_0000n",
    "messageHex": "0a9a51a00ec0153b"
  },
  {
    // test burning AXTP sent to contract
    "blockheight": 10,
    "sender": "4n",
    "recipient": "999n",
    "amount": "2500_0000n",
    "tokens": [
      {"asset": 101010, "quantity": 2}
    ]
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
