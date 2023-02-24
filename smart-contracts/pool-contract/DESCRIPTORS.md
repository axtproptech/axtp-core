# Structured Descriptors

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

> The alias itself is immutable and though we can change or extend the structure the way we need.


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
  "x-wp": "https://axtp.com.br/whitepaper.pdf"
}
```

- `x-ps`: The pricing structure for the token sale. In this example it reads like this: the tokens from 1 to 50 (including) cost 3000, the tokens from 51 to 160 cost 4000 and so on and so forth
- `x-mxt`: Maximum allowed tokens per account, customer
- `x-wp`: The URL to the whitepaper for this pool

