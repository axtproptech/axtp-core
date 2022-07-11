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
    // send STC
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
    // approve #4
    "blockheight": 8,
    "sender": "4n",
    "recipient": "999n",
    "amount": "2500_0000n",
    "messageHex": "0a9a51a00ec0153b"
  }

]
```