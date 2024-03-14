# AXT Pool Contract

This contract represents an AXT Pool, i.e. represents a class of physical world assets for example Real Estate
properties.

## Case

A pool can generate/mint a maximum amount of tokens (AXTP) that are priced in AXTC (a stable coin). Token Holders will
receive the token (AXTP) and
participate proportionally on the gains of the pools business operation. The Pool itself has additional functionality
like

- Distribution based on MultiSignature Approval
- Setting a Gross Market Value of the entire Pool
- Refund AXTC for eventual reversion of payout amounts
- Deactivation (Sunsetting the contract)

## Contract API

|                             |     |
|-----------------------------|-----|
| Multiple Instances          | Yes |
| Code Hash                   |     |
| Testnet Creation Account Id |     |
| Testnet Reference Hash      |     |
| Mainnet Creation Account Id |     |
| Mainnet Reference Hash      |     |

### Data Stack

| Name                           | Stack Index (0-based) | Initializable | Values        | Description                                                                                      |
|--------------------------------|-----------------------|---------------|---------------|--------------------------------------------------------------------------------------------------|
| poolName                       | 4                     | x             | 8 char string | Name of the Pool and its emitted token                                                           |
| poolRate                       | 5                     | x             | number        | The base price per token in AXTC (non-fractional                                                 |
| poolTokenQuantity              | 6                     | x             | number        | The maximum amount of mintable tokens. All AXTP tokens are non-fractional/integral (decimals: 0) |
| nominalValueAXTC               | 7                     | -             | number        | The product of `poolRate` and `poolTokenQuantity` representing the potential value of the pool   |
| poolTokenId                    | 8                     | -             | Id            | The token's Id created by the contract                                                           |
| paidAXTC                       | 9                     | -             | number        | The accumulated paid AXTC to Token Holders                                                       |
| grossMarketValueAXTC           | 10                    | -             | number        | The current GMV                                                                                  |
| refundAXTC                     | 11                    | -             | number        | The pending AXTC to be refunded                                                                  |
| approval Account1              | 13                    | -             | Account Id    | Approval Account                                                                                 |
| approval ApprovedDistribution1 | 14                    | -             | [0,1]         | Approval Status for Distribution                                                                 |
| approval ApprovedRefund1       | 15                    | -             | [0,1]         | Approval Status for Refund                                                                       |
| approval Account2              | 16                    | -             | Account Id    | Approval Account                                                                                 |
| approval ApprovedDistribution2 | 17                    | -             | [0,1]         | Approval Status for Distribution                                                                 |
| approval ApprovedRefund2       | 18                    | -             | [0,1]         | Approval Status for Refund                                                                       |
| approval Account3              | 19                    | -             | Account Id    | Approval Account                                                                                 |
| approval ApprovedDistribution3 | 20                    | -             | [0,1]         | Approval Status for Distribution                                                                 |
| approval ApprovedRefund3       | 21                    | -             | [0,1]         | Approval Status for Refund                                                                       |
| approval Account4              | 22                    | -             | Account Id    | Approval Account                                                                                 |
| approval ApprovedDistribution4 | 23                    | -             | [0,1]         | Approval Status for Distribution                                                                 |
| approval ApprovedRefund4       | 24                    | -             | [0,1]         | Approval Status for Refund                                                                       |
| isDeactivated                  | 25                    | -             | [0,1]         | Deactivation Status - Deactivated Contract are not reactive anymore                              |                 

### Methods:

| Method                    | Arg0 | Arg1            | Arg2     | Arg2 | Role/Permission      | Description                                                                                                                                              |
|---------------------------|------|-----------------|----------|------|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Send AXTP to Token Holder | 1    | Token Holder Id | Quantity |      | Approver             | Sends Pool Tokens to Token Holder.                                                                                                                       |
| Approve Distribution      | 2    |                 |          |      | Approvers (MultiSig) | Approves a distribution (when having AXTC balance) to Token Holders. Needs 3/4 approvals to trigerr distribution                                         |
| Update Gross Market Value | 3    | Quantity AXTC   |          |      | Approver             | Updates the Gross Market Value (in AXTC) of this Asset Pool                                                                                              |
| Request AXTC Refund       | 4    | Quantity AXTC   |          |      | Approver             | Request the refund of AXTC to Master Contract. This can be used to reduce/revert the Distribution to Token Holders. A new request overwrites an old one. |
| Approve AXTC Refunding    | 5    |                 |          |      | Approvers (MultiSig) | Approves requested AXTC refunding. Needs 3/4 to trigger refunding.                                                                                       |
| Deactivate                | 99   |                 |          |      | Creator              | Sets contract as deactivated and sends all AXTC to Master Contract, and all Signa to Creator.                                                            |

### Maps

No Maps

## Tests

Just run `yarn test` to run the tests.