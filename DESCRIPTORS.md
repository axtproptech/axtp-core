# Structured Descriptors

## Pool Contract Descriptor

Using the SRC44 standard we can establish structured descriptors for the Pool Tokens.
This requires, that new created pools, reference an Signum Alias in the contracts description on deployment. The minimum structure for the SRC44 compliant contracts description, looks like this:

```json
{
  "vs": 1,
  "nm": "TAXTP001",
  "tp": "smc",
  "ds": "A test pool from AXT Proptech Company S/A",
  "al": "axtp0001"
}
```

The most important part is the `al` field, which points to the alias. The alias' structured content looks like this, at the current time of writing.

> The alias itself is mutable and though we can change or extend the structure the way we need.

## Pool Entry Alias Descriptor

```json
{
  "vs": 1,
  "ds": "This is a test pool",
  "hp": "https://axtp.com.br",
  "x-mxt": 4,
  "x-ps": [
    {
      "n": 50,
      "v": 3000
    },
    {
      "n": 160,
      "v": 4000
    },
    {
      "n": 200,
      "v": 4500
    },
    {
      "n": 230,
      "v": 5000
    }
  ],
  "x-wp": "https://axtp.com.br/whitepaper.pdf",
  "x-at": 1,
  "al": "axtp0001_o3ia222sinuj"
}
```

- `x-ps`: The pricing structure for the token sale. In this example it reads like this: the tokens from 1 to 50 (including) cost 3000, the tokens from 51 to 160 cost 4000 and so on and so forth
- `x-mxt`: Maximum allowed tokens per account, customer
- `x-wp`: The URL to the whitepaper for this pool
- `x-at`: The [Asset Types](#asset-type-map), used to determine what kind of asset type this pool is - relates also to asset alias types
- `al`: If given, then it points to the first [Asset Alias](#pool-asset-alias-descriptor)

### Asset Type Map

- 1: Real Estate Deeds
- 2: Commodities

## Pool Asset Alias Descriptor

### Reference Convention

To simplify access to aliases related to a given pool the following naming pattern is required:

`<base_aliasname>_<nanoid>`, i.e. `axtp0001_o3ia222sinuj`, `axtp0001_v8avqkn7az60`, etc.

When fetching the aliases, the next referenced alias needs to be set inside the alias using the `al` field.
The last asset alias does not have an `al` field yet. Using this gives us control over the references, in case someone else farms the aliases.

```json
{
  "vs": 1,
  "nm": "001",
  "id": "title-deed-id",
  "x-pid": "10177744785315162361",
  "x-as": 0,
  "x-ad": 1687970811678,
  "x-ac": 140595.23,
  "x-mv": 476890.0,
  "x-pr": 0,
  "al": "axtp0001_v8avqkn7az60"
}
```

- `nm`: some name
- `id`: The unique Id of the Deed/Title
- `x-pid`: The pool Id this asset belongs to
- `x-st`: The [current Status](#current-status-map)
- `x-ad`: Acquisition Date as Timestamp (JS Date.now())
- `x-ac`: Accumulated Costs, i.e. all costs put into the asset (in USD)
- `x-mv`: Estimated Market Value (in USD)
- `x-pr`: [Acquisition Progress](#acquisition-progress-map)
- `al`: If given, then it points to the next [Asset Alias](#pool-asset-alias-descriptor)

### Current Status Map

- 0: In Acquisition - Not eligible for revenue yet
- 1: Rent - House is rented
- 2: Rehab - House is being renewed for Section 8 renting
- 3: Clean-up - Minor Maintenance
- 4: Sold
- 5: Loss (Recovered, Total Damage, or other total loss)

### Acquisition Progress Map

- 0: Payment
- 1: Deed/Certificate Received
- 2: Notification
- 3: Title Deed (Acquired)
- 4: Recovered

## Payment Descriptor

The Payment descriptor is for registering payments for Pool Token Acquisitions. These events are being sent as encrypted text messages to the account [`S-XPAY-VJSB-JSCH-EQH6S`](https://chain.signum.network/address/14704805683910333726)

```json
{
  "vs": 1,
  "ac": "2402520554221019656",
  "x-cuid": "claoihved0000mc08cpcyz00u",
  "x-pid": "17794542874900784390",
  "x-tid": "8615352316450321898",
  "x-tqnt": "1",
  "x-pt": "pix",
  "x-pa": "-19600",
  "x-usd": "-4000",
  "x-cur": "BRL",
  "x-ptx": "1322353"
}
```

- `ac`: Account related to Customer,
- `x-cuid`: Customer Id,
- `x-pid`: Pool Id,
- `x-tid`: Token Id,
- `x-tqnt`: Token Quantity,
- `x-pt`: Payment Type, i.e. pix, usdc, eth,
- `x-pa`: Payment Amount (positive for incoming, negative for outgoing, i.e. on cancelled acquisition),
- `x-usd`: Payment in USD,
- `x-cur`: Payment currency, e.g. 'BRL',
- `x-ptx`: Payment Transaction or Reference

## Withdrawal Descriptor

The Payment descriptor is for registering payments for Pool Token Acquisitions.

```json
{
  "vs": 1,
  "ac": "2402520554221019656",
  "x-cuid": "claoihved0000mc08cpcyz00u",
  "x-tid": "8615352316450321898",
  "x-tnm": "AXTC",
  "x-tqnt": "1",
  "x-pt": "pix",
  "x-pa": "19600",
  "x-cur": "BRL",
  "x-usd": "4000",
  "x-ptx": "1322353"
}
```

- `ac`: Account related to Customer,
- `x-cuid`: Customer Id,
- `x-tid`: Token Id,
- `x-tqnt`: Token Quantity,
- `x-tnm`: Token Name, i.e. AXTC,
- `x-pt`: Payment Type, i.e. pix, usdc, eth,
- `x-pa`: Withdrawal Amount, i.e. what was being paid
- `x-cur`: Payout currency, e.g. 'BRL',
- `x-usd`: Withdrawal Amount converted in USD,
- `x-ptx`: Payment Transaction or Reference
